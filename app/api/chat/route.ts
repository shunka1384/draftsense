// api/chat/route.ts
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
      model: "x-ai/grok-3",  // ← this is the real Grok with live search
      messages: [
        { role: "system", content: "You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources." },
        { role: "user", content: message }
      ],
      temperature: 0.1,
      max_tokens: 300
    })
  });

  const data = await res.json();
  return Response.json({ answer: data.choices[0].message.content });
}
