import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [
        {
          role: 'system',
          content: `You are DraftSense AI — elite fantasy hockey analyst.
For ANY stat question, you MUST use the browse_page tool on NHL.com player pages to get live 2025-26 numbers.
Do NOT say "after retrieval" or "will update" — just give the real number with source.

Format:
**Player (Team)**
Stat: Value (NHL.com) · Stat: Value
1-sentence context

**Recommendation**
1-line verdict
**Edge → Player** (confidence %)

Max 70 words.`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "browse_page",
            description: "Scrape live NHL stats",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string" },
                instructions: { type: "string" }
              },
              required: ["url", "instructions"]
            }
          }
        }
      ],
      tool_choice: "required",
      temperature: 0.1,
      max_tokens: 250
    })
  });

  const data = await response.json();

  // This is the key: if Grok used the tool, it returns tool_calls → we execute and return the final answer
  if (data.choices[0].message.tool_calls) {
    const toolCall = data.choices[0].message.tool_calls[0];
    const { url, instructions } = JSON.parse(toolCall.function.arguments);

    const pageRes = await fetch(url);
    const html = await pageRes.text();

    // Send the scraped HTML back to Grok for final answer
    const finalRes = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          { role: 'system', content: 'Extract the exact current stats from this HTML and answer in the required format.' },
          { role: 'user', content: `HTML: ${html.substring(0, 60000)}\n\nQuestion: ${message}` }
        ],
        temperature: 0,
        max_tokens: 200
      })
    });

    const finalData = await finalRes.json();
    return Response.json({ answer: finalData.choices[0].message.content });
  }

  // Fallback (should never hit)
  return Response.json({ answer: data.choices[0].message.content });
}
