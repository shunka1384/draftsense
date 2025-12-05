"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles } from "lucide-react"

export function PremiumChatBar() {
  const [input, setInput] = useState("Compare Skinner vs Saros tonight")
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    setIsExpanded(true)
    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,245,255,0.2)] overflow-hidden">
      {/* Header Bar - Always Visible */}
      <div className="bg-gradient-to-r from-[#00f5ff]/20 via-[#00f5ff]/10 to-transparent p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00f5ff]/20 flex items-center justify-center backdrop-blur-sm border border-[#00f5ff]/30">
            <Sparkles className="w-5 h-5 text-[#00f5ff]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">AI Hockey Assistant</h3>
            <p className="text-xs text-gray-400">Powered by advanced analytics</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse shadow-[0_0_8px_rgba(0,245,255,0.6)]" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Expanded Chat Messages */}
      {isExpanded && messages.length > 0 && (
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 bg-black/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-[#00f5ff] text-black font-medium"
                    : "bg-white/10 text-white backdrop-blur-sm border border-white/10"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pre-filled Demo Stats - Only show when not expanded */}
      {!isExpanded && (
        <div className="p-6 space-y-4 bg-black/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Stuart Skinner (EDM)</span>
              <span className="text-[#00f5ff] font-semibold">.924 SV%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f5ff] to-[#00f5ff]/60 w-[92%] rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Juuse Saros (NSH)</span>
              <span className="text-[#00f5ff] font-semibold">.919 SV%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00f5ff] to-[#00f5ff]/60 w-[91%] rounded-full" />
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed pt-2">
            <span className="text-[#00f5ff] font-medium">Recommendation:</span> Both are strong options. Skinner has
            higher recent form, but Saros offers elite consistency.
          </p>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-white/10 bg-black/30">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any player..."
            disabled={isLoading}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#00f5ff] focus:ring-[#00f5ff]/20"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-[#00f5ff] hover:bg-[#00f5ff]/90 text-black shrink-0 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
