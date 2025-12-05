import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { message } = await req.json()

  const result = streamText({
    model: "xai/grok-4-fast",
    prompt: `You are a professional fantasy hockey analyst. The user asks: "${message}"\n\nProvide concise, actionable insights about NHL players, stats, trends, and fantasy advice. Use data-driven analysis and keep responses under 150 words.`,
    maxOutputTokens: 500,
  })

  const fullText = await result.text

  return Response.json({ message: fullText })
}
