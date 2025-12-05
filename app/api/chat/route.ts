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
        model: 'grok-3',  // Fallback to stable Grok 3
        messages: [
          { role: 'system', content: 'You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources.' },
          { role: 'user', content: message }
        ],
        temperature: 0.1,
        max_tokens: 300
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log('xAI API Error:', res.status, errorText);
      return Response.json({ answer: `API error: ${res.status}. Check quota or key.` });
    }

    const data = await res.json();
    console.log('xAI Response:', JSON.stringify(data, null, 2));  // Logs full response

    const answer = data.choices?.[0]?.message?.content || "No response from Grok";

    return Response.json({ answer });
  } catch (err) {
    console.error('Server Error:', err);
    return Response.json({ answer: `Server error: ${err.message}` });
  }
}
