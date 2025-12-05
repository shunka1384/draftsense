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
      model: 'grok-4-latest',
      messages: [
        {
          role: 'system',
          content: 'You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources.'
        },
        { role: 'user', content: message }
      ],
      temperature: 0.1,
      max_tokens: 300,
      tool_choice: "none"   // ← THIS LINE FORCES A DIRECT ANSWER
    })
  });

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "No response from Grok";

  return Response.json({ answer });
}
