import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',  // Updated from deprecated grok-beta
      messages: [
        {
          role: 'system',
          content: `You are DraftSense AI — the world's best fantasy hockey expert.
Use ONLY real, up-to-the-second 2025-26 NHL stats from sources like NHL.com, FantasyPros, Dobber.
Compare goalies correctly (Stuart Skinner and Juuse Saros are both goalies).
Always answer in under 100 words, super sharp, fantasy-first.
Include: record, GAA, SV%, last 5 games, team context, and who wins in fantasy right now.
End with a clear recommendation.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: 300,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json({ error: `API error: ${response.status} - ${errorText}` }, { status: response.status });
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}
