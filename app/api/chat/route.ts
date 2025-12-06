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
      messages: [
        { role: 'system', content: 'You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources.' },
        { role: 'user', content: message }
      ],
      temperature: 0,
      max_tokens: 150,  
      stream: true  
    })
  });

  if (!res.ok) {
    const error = await res.text();
    return Response.json({ answer: `API error: ${res.status} - ${error}` });
  }

  // Stream the response
  const reader = res.body.getReader();
  let answer = '';
  const encoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = encoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
    for (const line of lines) {
      const json = line.slice(6);
      if (json === '[DONE]') break;
      const parsed = JSON.parse(json);
      if (parsed.choices[0].delta.content) {
        answer += parsed.choices[0].delta.content;
      }
    }
  }

  return Response.json({ answer });
}
