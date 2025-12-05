import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Use the SAME live search I have here
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
          content: `You are DraftSense AI — fantasy hockey expert with live web access.
Answer using real-time 2025-26 stats from NHL.com, ESPN, EliteProspects.
Never hallucinate numbers. Always cite source.

Format:
**Player (Team)**
Stat: Value (source) · Stat: Value
1-sentence context

**Recommendation**
Verdict
**Edge → Player** (confidence %)`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.1,
      max_tokens: 250
    })
  });

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}
