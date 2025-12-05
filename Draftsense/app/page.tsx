"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PremiumChatBar } from "@/components/premium-chat-bar"

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse in hero section (first 800px)
      if (e.clientY < 800) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/sign-up">
              <Button
                className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-medium shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
                size="sm"
              >
                Get Started Free
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a0a0f] to-black" />

        {/* Hockey Rink Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 245, 255, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 245, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Glowing Cyan Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00f5ff]/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00f5ff]/10 rounded-full blur-[120px] animate-float-slow" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#00f5ff]/15 rounded-full blur-[100px] animate-float-slower" />

          {/* Mouse-following orb */}
          <div
            className="absolute w-96 h-96 bg-[#00f5ff]/30 rounded-full blur-[120px] pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-balance">
              Smarter picks.{" "}
              <span className="bg-gradient-to-r from-white via-[#00f5ff] to-[#00f5ff] bg-clip-text text-transparent">
                Stronger pools.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The AI co-pilot that reads every stat site so you don't have to.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-semibold px-8 shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all"
                >
                  Start for free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 hover:border-[#00f5ff] bg-transparent px-8"
              >
                See how it works
              </Button>
            </div>
          </div>

          {/* Glassmorphic Chat Bar */}
          <div className="max-w-3xl mx-auto">
            <PremiumChatBar />
          </div>
        </div>
      </section>

      {/* 3 Glass Feature Cards */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 rounded-full border-2 border-[#00f5ff]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask anything about any player. Get stats, trends, and matchup analysis in seconds.
              </p>
            </Card>

            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 rounded-full bg-[#00f5ff]/30" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Deep Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                AI reads MoneyPuck, Natural Stat Trick, and more to give you the edge.
              </p>
            </Card>

            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#00f5ff]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#00f5ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00f5ff]/20 transition-colors">
                <div className="w-6 h-6 border-2 border-[#00f5ff] rounded" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Hours</h3>
              <p className="text-gray-400 leading-relaxed">
                Stop opening 10 tabs. Get everything you need in one conversation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3 Numbered Circles Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#00f5ff] flex items-center justify-center text-2xl font-bold text-[#00f5ff] mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold">Ask Your Question</h3>
                <p className="text-gray-400 leading-relaxed">
                  Type in any player comparison, matchup question, or lineup decision.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#00f5ff] flex items-center justify-center text-2xl font-bold text-[#00f5ff] mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold">AI Analyzes</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our AI scans real-time stats, trends, and advanced metrics across the web.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#00f5ff] flex items-center justify-center text-2xl font-bold text-[#00f5ff] mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold">Make Better Picks</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get clear recommendations backed by data, not guesswork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Yearly Toggle */}
      <section id="pricing" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Simple Pricing</h2>
            <p className="text-xl text-gray-400">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">10 queries per day</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Basic player stats</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Email support</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 bg-transparent"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Pro Plan - Most Popular */}
            <Card className="p-8 bg-gradient-to-b from-[#00f5ff]/10 to-white/5 backdrop-blur-xl border border-[#00f5ff] relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00f5ff] text-black text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$19</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Unlimited queries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Lineup optimizer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Priority support</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="block">
                  <Button className="w-full bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-semibold shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Elite Plan */}
            <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Elite</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$49</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">Custom AI models</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">API access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#00f5ff] shrink-0" />
                    <span className="text-sm text-gray-300">White-glove support</span>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 bg-transparent"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
              Ready to dominate your league?
            </h2>
            <p className="text-xl text-gray-400">Join thousands of fantasy managers making smarter decisions.</p>
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black font-semibold px-10 shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all"
              >
                Start free today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#00f5ff]/50 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-black" />
              </div>
              <span className="font-semibold">DraftSense</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-gray-400">© 2025 DraftSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
