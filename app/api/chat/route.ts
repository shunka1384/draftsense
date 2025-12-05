import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://draftsense.ca",
        "X-Title": "DraftSense",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "x-ai/grok-beta",
        messages: [
          { role: "system", content: "You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources." },
          { role: "user", content: message }
        ],
        temperature: 0.1,
        max_tokens: 300
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log('OpenRouter error:', res.status, errorText);  // Logs to Vercel dashboard
      return Response.json({ answer: `API error: ${res.status} - Check key/credits` });
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || "No response from API";

    console.log('OpenRouter data:', data);  // Logs full response for debugging

    return Response.json({ answer });
  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ answer: `Server error: ${err.message}` });
  }
}
