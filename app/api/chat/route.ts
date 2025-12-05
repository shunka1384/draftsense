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
For any current stat question (SV%, goals, points, etc.), use the browse_page tool on EliteProspects or NHL.com to get live 2025-26 data.
Always cite the source.

Format:
**Player (Team)**
Stat: Value (source) · Stat: Value
1-sentence context

**Recommendation**
1-line verdict
**Edge → Player** (confidence %)

Max 80 words. Be accurate, concise.`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "browse_page",
            description: "Scrape a webpage for live stats",
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
      tool_choice: "auto",
      temperature: 0.3,
      max_tokens: 300
    })
  });

  if (!response.ok) {
    const err = await response.text();
    return Response.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}
