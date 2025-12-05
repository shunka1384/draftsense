import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Force Grok to ALWAYS scrape for any stat-related question
  const systemPrompt = `You are DraftSense AI — fantasy hockey expert.
For EVERY question about current stats (SV%, GAA, points, goals, record, etc.), you MUST use the browse_page tool on NHL.com or EliteProspects to get the exact 2025-26 numbers.
Do NOT guess or use cached knowledge.

Format:
**Player (Team)**
Stat: Value (source) · Stat: Value
1-sentence context

**Recommendation**
1-line verdict
**Edge → Player** (confidence %)

Max 80 words.`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "browse_page",
            description: "Scrape live NHL stats from a webpage",
            parameters: {
              type: "object",
              properties: {
                url: { type: "string" },
                instructions: { type: "string", description: "Extract current 2025-26 stats: SV%, GAA, record, goals, points, etc." }
              },
              required: ["url", "instructions"]
            }
          }
        }
      ],
      tool_choice: "required",        // ← THIS IS THE KEY LINE
      temperature: 0.1,
      max_tokens: 300
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "Error fetching stats";

  return Response.json({ answer });
}
