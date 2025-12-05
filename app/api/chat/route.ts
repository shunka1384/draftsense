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
          content: `You are DraftSense AI.
For any current stat question, use browse_page on the player's NHL.com or EliteProspects page.
Extract ONLY the 2025-26 season stats.
Answer instantly with real numbers — no "will update" or "retrieval".

Format:
**Player (Team)**
SV%: .XXX (NHL.com) · GAA: X.XX · Record: W-L-OTL
1-sentence context

**Recommendation**
Verdict
**Edge → Player** (confidence %)`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "browse_page",
            description: "Get live NHL stats",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string" },
                instructions: { type: "string", description: "Extract ONLY 2025-26 stats: SV%, GAA, record, goals, points. Ignore everything else." }
              },
              required: ["url", "instructions"]
            }
          }
        }
      ],
      tool_choice: "required",
      temperature: 0,
      max_tokens: 250
    })
  });

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (toolCall) {
    const args = JSON.parse(toolCall.function.arguments);
    const page = await fetch(args.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await page.text();

    const final = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          { role: 'system', content: 'Extract ONLY the 2025-26 stats from this HTML and answer in the exact format. No extra text.' },
          { role: 'user', content: `HTML: ${html.slice(0, 50000)}\n\nQuestion: ${message}` }
        ],
        temperature: 0,
        max_tokens: 200
      })
    });

    const result = await final.json();
    return Response.json({ answer: result.choices[0].message.content });
  }

  return Response.json({ answer: data.choices[0].message.content });
}
