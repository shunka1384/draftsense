"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 900) setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

    const { answer, error } = await res.json()
    setMessages(prev => [...prev, { role: "assistant", content: error || answer || "No response" }])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Your perfect navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-black/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#00f5ff]/50 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-black" />
            </div>
            <span className="font-bold text-lg">DS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white">Features</Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</Link>
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white">Sign In</Link>
            <Link href="/auth/sign-up">
              <Button className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-medium shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                Get Started Free
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero with background magic */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a0a0f] to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(0,245,255,0.3) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(0,245,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }} />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00f5ff]/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00f5ff]/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#00f5ff]/15 rounded-full blur-[100px] animate-float-slower" />
          <div
            className="absolute w-96 h-96 bg-[#00f5ff]/30 rounded-full blur-[120px] transition-all duration-300"
            style={{ left: mousePosition.x, top: mousePosition.y, transform: "translate(-50%, -50%)" }}
          />
        </div>

        <div className="container mx-auto px-4 relative text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            Smarter picks.{" "}
            <span className="bg-gradient-to-r from-white via-[#00f5ff] to-[#00f5ff] bg-clip-text text-transparent">
              Stronger pools.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10">
            The AI co-pilot that reads every stat site so you don&apos;t have to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-bold px-8">
                Start for free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10">
              See how it works
            </Button>
          </div>

          {/* LIVE GROK CHAT — THIS IS THE ONE */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500/10 p-4 border-b border-cyan-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-lg">DS</div>
                <div>
                  <div className="font-semibold">AI Hockey Assistant</div>
                  <div className="text-cyan-400 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live • Powered by Grok-3
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 mt-20">
                    Ask anything — e.g. &quot;Skinner vs Saros&quot;
                  </p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <div className={`inline-block max-w-md px-5 py-3 rounded-2xl ${m.role === "user" ? "bg-cyan-500 text-black" : "bg-gray-800/80 text-cyan-100 border border-cyan-500/20"}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-cyan-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                    Thinking...
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-cyan-500/20 flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about any player, trade, matchup..."
                  className="flex-1 bg-gray-900/50 border-cyan-500/30 text-white"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keep the rest of your beautiful sections exactly as they were */}
      {/* ... (features, pricing, footer — all untouched) */}
    </div>
  )
}
