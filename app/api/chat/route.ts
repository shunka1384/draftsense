import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
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
          content: 'You are DraftSense AI — fantasy hockey expert. Use live web search for all 2025-26 stats. Be accurate, concise, cite sources. Use tools for real-time data.'
        },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the web for live NHL stats",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
                num_results: { type: "integer", default: 5 }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto",  // Enables live search
      temperature: 0.1,
      max_tokens: 300
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "No response";

  return Response.json({ answer });
}
