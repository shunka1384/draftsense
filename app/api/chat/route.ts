import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

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
        { role: "system", content: "You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats (season started October 2025). Be accurate, concise, cite sources. No outdated data." },
        { role: "user", content: message }
      ],
      temperature: 0.1,
      max_tokens: 200  // Reduced for speed
    })
  });

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "No response";

  return Response.json({ answer });
}
