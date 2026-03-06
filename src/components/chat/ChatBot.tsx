"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "bot";
  text: string;
}

const GDG_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

function GDGDotIcon({ size = 28 }: { size?: number }) {
  const r = size / 2;
  const dotR = size * 0.165;
  const offset = size * 0.28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={r - offset} cy={r - offset} r={dotR} fill="#4285F4" />
      <circle cx={r + offset} cy={r - offset} r={dotR} fill="#EA4335" />
      <circle cx={r - offset} cy={r + offset} r={dotR} fill="#34A853" />
      <circle cx={r + offset} cy={r + offset} r={dotR} fill="#FBBC05" />
    </svg>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey! I'm the GDG VITB assistant. Ask me anything about our community, events, or team 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updatedMessages: Message[] = [...messages, { role: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Build history from all messages except the initial bot greeting
    const history = updatedMessages.slice(1).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));
    // Remove the last user message from history — it goes as `query`
    const historyWithoutLast = history.slice(0, -1);

    try {
      const res = await fetch(
        "https://rag-chatbot-api-production-30b4.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text,
            history: historyWithoutLast,
            top_k: 5,
          }),
        },
      );
      const data = await res.json();
      const reply = data?.answer || "Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-[5.5rem] right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[calc(100vw-2rem)] max-w-[360px] sm:w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: "#1E1E1E" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-white/10"
              style={{ background: "#111" }}
            >
              <GDGDotIcon size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[0.95rem] leading-tight">
                  GDG VITB
                </p>
                <p className="text-[#34A853] text-[0.72rem] font-medium">
                  ● Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close chat"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto px-4 py-3 flex flex-col gap-3 scrollbar-custom">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="mt-1 mr-2 shrink-0">
                      <GDGDotIcon size={22} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-[0.85rem] leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "rounded-br-sm text-black font-medium"
                        : "rounded-bl-sm text-white/90 border border-white/10"
                    }`}
                    style={{
                      background: msg.role === "user" ? "#FFD427" : "#2a2a2a",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <GDGDotIcon size={22} />
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-sm border border-white/10"
                    style={{ background: "#2a2a2a" }}
                  >
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            background: GDG_COLORS[i],
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="px-3 py-3 border-t border-white/10 flex gap-2 items-center"
              style={{ background: "#111" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-[0.85rem] placeholder:text-white/30 outline-none focus:border-[#FFD427]/60 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ background: "#FFD427" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open GDG chatbot"
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center border border-white/10 relative"
        style={{ background: "#1E1E1E" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFD427"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.div
              key="icon"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <GDGDotIcon size={26} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
