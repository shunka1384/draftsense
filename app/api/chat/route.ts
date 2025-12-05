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
          content: `You are DraftSense AI — fantasy hockey expert.
For EVERY stat question, use browse_page on EliteProspects player pages (e.g., https://www.eliteprospects.com/player/ID/player-name).
Extract ONLY 2025-26 season stats: SV%, GAA, record, goals, points, etc.
Answer instantly with real numbers — no "update after" or placeholders.

Format:
**Player (Team)**
Stat: Value (EliteProspects) · Stat: Value
1-sentence context

**Recommendation**
1-line verdict
**Edge → Player** (confidence %)

Max 80 words. Cite EliteProspects.`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "browse_page",
            description: "Scrape EliteProspects for live NHL stats",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string" },
                instructions: { type: "string", description: "Extract ONLY 2025-26 season stats from the regular season table: SV%, GAA, record, GP, saves, shots. Ignore career/previous years. Provide exact numbers." }
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
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (toolCall) {
    const args = JSON.parse(toolCall.function.arguments);
    const page = await fetch(args.url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } 
    });
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
          { role: 'system', content: 'From this EliteProspects HTML, extract ONLY the 2025-26 stats (SV%, GAA, record) and answer in the exact format. No extra text.' },
          { role: 'user', content: `HTML: ${html.slice(0, 60000)}\n\nQuestion: ${message}` }
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
