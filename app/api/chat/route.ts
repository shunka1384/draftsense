import { NextRequest } from 'next/server';

export const runtime = 'edge'; // Important for streaming stability

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
          content: `You are DraftSense AI — elite fantasy hockey analyst. Use 2025-26 real stats/projections from FantasyPros, NHL.com, Dobber.

STRICT RULES:
- Cite 1-2 sources inline (e.g., "Per FantasyPros").
- Max 80 words, 6 lines.
- Use this format:
**Player1 (Team)**
Record · GAA/SOG · Key Stat
1-sentence context

**Player2 (Team)**
Record · GAA/SOG · Key Stat
1-sentence context

**Recommendation**
1-line verdict
**Edge → Player** (with % confidence)

No fluff, no lists, no "for the season". Be opinionated but accurate.`
          },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), { status: response.status });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response from Grok';

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
