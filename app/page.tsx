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

  // Mouse glow orb
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 900) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Send message to Grok
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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
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

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background effects */}
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
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The AI co-pilot that reads every stat site so you don&apos;t have to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-bold px-8 shadow-[0_0_30px_rgba(0,245,255,0.4)]">
                Start for free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10">
              See how it works
            </Button>
          </div>

          {/* LIVE GROK CHAT */}
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
                    Ask anything — e.g. "Skinner vs Saros"
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
                <Button onClick={sendMessage} disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 rounded-full border-2 border-[#00f5ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
              <p className="text-gray-400">Ask anything about any player. Get stats, trends, and matchup analysis in seconds.</p>
            </Card>
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#00f5ff]/30" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Deep Analysis</h3>
              <p className="text-gray-400">AI reads MoneyPuck, Natural Stat Trick, and more to give you the edge.</p>
            </Card>
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 border-2 border-[#00f5ff] rounded" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Hours</h3>
              <p className="text-gray-400">Stop opening 10 tabs. Get everything you need in one conversation.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#00f5ff] flex items-center justify-center text-2xl font-bold text-[#00f5ff] mx-auto">
                    {n}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {n === 1 ? "Ask Your Question" : n === 2 ? "AI Analyzes" : "Make Better Picks"}
                  </h3>
                  <p className="text-gray-400">
                    {n === 1 && "Type in any player comparison, matchup question, or lineup decision."}
                    {n === 2 && "Our AI scans real-time stats, trends, and advanced metrics across the web."}
                    {n === 3 && "Get clear recommendations backed by data, not guesswork."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-400">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-5xl font-bold mb-8">$0<span className="text-xl text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />10 queries/day</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Basic stats</li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>

            {/* Pro */}
            <Card className="p-8 bg-gradient-to-b from-[#00f5ff]/10 to-white/5 border border-[#00f5ff] relative scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00f5ff] text-black px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-5xl font-bold mb-8">$19<span className="text-xl text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Unlimited queries</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Advanced analytics</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Lineup optimizer</li>
              </ul>
              <Button className="w-full bg-[#00f5ff] text-black font-bold">Start Free Trial</Button>
            </Card>

            {/* Elite */}
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Elite</h3>
              <p className="text-5xl font-bold mb-8">$49<span className="text-xl text-gray-400">/month</span></p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Everything in Pro</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />Custom AI models</li>
                <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#00f5ff]" />API access</li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/5 to-transparent" />
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to dominate your league?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of fantasy managers making smarter decisions.</p>
          <Button size="lg" className="bg-[#00f5ff] text-black font-bold px-12 shadow-xl">
            Start free today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 DraftSense. All rights reserved. · Privacy · Terms · Contact
        </div>
      </footer>
    </div>
  )
}
