// app/page.tsx  ← PASTE THIS ENTIRE FILE
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = input
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    })

    const { answer } = await res.json()
    setMessages(prev => [...prev, { role: "assistant", content: answer }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-6xl font-black text-center mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
          DraftSense
        </h1>
        <p className="text-center text-xl text-gray-400 mb-12">
          Live answers. Real stats. No bullshit.
        </p>

        {/* LIVE CHAT */}
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600/20 p-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-xl">DS</div>
              <div>
                <div className="font-bold">AI Hockey Assistant</div>
                <div className="text-cyan-300 text-sm">Live • Powered by Grok-3 real-time search</div>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 mt-32">
                Ask me anything — e.g. “Stuart Skinner save percentage?” or “McDavid points this year?”
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block max-w-xl px-6 py-4 rounded-3xl ${m.role === "user" ? "bg-cyan-500 text-black" : "bg-gray-800 text-cyan-100"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-cyan-400">Searching the web...</p>}
          </div>

          <div className="p-6 border-t border-cyan-500/20 flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about any player, stat, trade..."
              className="flex-1 bg-gray-800 border-cyan-500/40"
              disabled={loading}
            />
            <Button onClick={sendMessage} disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
