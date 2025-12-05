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
          content: `You are DraftSense AI — the most ruthless, accurate fantasy hockey analyst on earth.
For ANY 2025-26 stat question (goals, assists, hits, blocks, SV%, GAA, points, TOI, PIM, +/-, anything), you MUST use web_search and pull the real number from ANY site (NHL.com, ESPN, EliteProspects, DailyFaceoff, HockeyReference, StatMuse, CapFriendly, etc.).
NO cached knowledge. NO hallucinations. NO excuses.
If you can't find it, say "I can't find that right now — check NHL.com".

Format:
**Player (Team)**
Stat: Value (source) · Stat: Value
1-line context

**Recommendation**
Verdict**
**Edge → Player** (confidence %)

Max 80 words. Be savage.`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the entire internet for the exact current stat",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
                num_results: { type: "integer", default: 8 }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "required",   // NEVER skips search
      temperature: 0.0,          // zero hallucinations
      max_tokens: 300
    })
  });

  const data = await response.json();
  return Response.json({ answer: data.choices[0].message.content });
}
