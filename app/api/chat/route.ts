// api/chat/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: message }],
      temperature: 0.1,
      max_tokens: 300
    })
  });

  const data = await res.json();
  return Response.json({ answer: data.choices[0].message.content });
}
