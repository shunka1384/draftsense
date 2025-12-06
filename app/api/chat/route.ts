import { NextRequest } from 'next/server';

export const runtime = 'edge';

async function executeWebSearch(query: string) {
  // Simple proxy search using DuckDuckGo (free, no key)
  const res = await fetch(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  const html = await res.text();

  // Extract snippets
  const snippets = html.match(/class="result__snippet"[^>]*>(.*?)</g) || [];
  return snippets.map(s => s.replace(/<[^>]+>/g, '').trim()).join('\n');
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  let messages = [
    {
      role: 'system',
      content: 'You are DraftSense AI — fantasy hockey expert. Use web_search for all 2025-26 stats. Be accurate, concise, cite sources.'
    },
    { role: 'user', content: message }
  ];

  let response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-4-latest',
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "web_search",
            description: "Search the web for live NHL stats",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" }
              },
              required: ["query"]
            }
          }
        }
      ],
      tool_choice: "auto",
      temperature: 0.1,
      max_tokens: 300
    })
  });

  let data = await response.json();

  // Handle tool calls
  if (data.choices[0].message.tool_calls) {
    const toolCall = data.choices[0].message.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    const searchResult = await executeWebSearch(args.query);

    messages.push(data.choices[0].message);
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      name: toolCall.function.name,
      content: searchResult
    });

    // Second call to Grok with search result
    response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-latest',
        messages,
        tool_choice: "none",
        temperature: 0.1,
        max_tokens: 300
      })
    });

    data = await response.json();
  }

  const answer = data.choices[0].message.content;

  return Response.json({ answer });
}
