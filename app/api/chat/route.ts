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
          content: `You are DraftSense AI — fantasy hockey expert. For stats questions (e.g., "current SV%"), use tools to scrape NHL.com/ESPN/FantasyPros for 2025-26 data.

TOOLS: Use web_search or browse_page for real-time stats. Always cite sources inline.

FORMAT:
**Player (Team)**
Current Stat1: Value (source) · Stat2: Value
1-sentence context

**Recommendation**
Verdict
**Edge → Player** (confidence %)

Max 80 words. Be accurate, concise.`
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: 'web_search',
          tool_name: 'web_search',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query for stats' },
              num_results: { type: 'integer', default: 5 }
            },
            required: ['query']
          }
        },
        {
          type: 'browse_page',
          tool_name: 'browse_page',
          parameters: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              instructions: { type: 'string', description: 'Extract stats like SV%, GAA' }
            },
            required: ['url', 'instructions']
          }
        }
      ],
      tool_choice: 'auto',
      temperature: 0.3,
      max_tokens: 300,
      stream: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return Response.json({ error }, { status: response.status });
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}
