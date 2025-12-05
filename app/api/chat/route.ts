import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-latest',
        messages: [
          { role: 'system', content: 'You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources.' },
          { role: 'user', content: message }
        ],
        search_parameters: { mode: "on" },  // Enables Live Search
        temperature: 0,
        max_tokens: 150
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return Response.json({ answer: `API error: ${res.status} - ${errorText}` });
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "No response from Grok";

    return Response.json({ answer });
  } catch (err) {
    return Response.json({ answer: `Server error: ${err.message}` });
  }
}
