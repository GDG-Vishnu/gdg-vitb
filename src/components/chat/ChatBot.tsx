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
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[calc(100vw-2rem)] max-w-[360px] sm:w-[360px] overflow-hidden border-[3px] border-black bg-white"
            style={{ boxShadow: "6px 6px 0px 0px #000" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b-[3px] border-black bg-[#FFE7A5]">
              <GDGDotIcon size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-black font-bold text-[0.95rem] leading-tight font-productSans tracking-wide">
                  GDG VITB
                </p>
                <p className="text-[#34A853] text-[0.72rem] font-bold font-productSans">
                  ● Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-black hover:bg-black hover:text-white transition-colors p-1 border-2 border-black"
                aria-label="Close chat"
              >
                <svg
                  width="14"
                  height="14"
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
            <div
              className="h-[300px] overflow-y-auto px-4 py-3 flex flex-col gap-3 scrollbar-custom"
              style={{
                backgroundImage:
                  "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
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
                    className={`max-w-[80%] px-3 py-2 text-[0.85rem] leading-relaxed whitespace-pre-wrap break-words border-[2px] border-black font-productSans ${
                      msg.role === "user"
                        ? "text-black font-semibold bg-[#FFD427]"
                        : "text-black bg-white"
                    }`}
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
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
                    className="px-3 py-2 border-[2px] border-black bg-white"
                    style={{ boxShadow: "3px 3px 0px 0px #000" }}
                  >
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 border-[1.5px] border-black animate-bounce"
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
            <div className="px-3 py-3 border-t-[3px] border-black flex gap-2 items-center bg-white">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 min-w-0 bg-white border-[2px] border-black px-3 py-2 text-black text-[0.85rem] placeholder:text-stone-400 outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 font-productSans"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 flex items-center justify-center border-[2px] border-black bg-[#FFD427] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-30"
                style={{ boxShadow: "3px 3px 0px 0px #000" }}
              >
                <svg
                  width="15"
                  height="15"
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
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ x: 2, y: 2 }}
        aria-label="Open GDG chatbot"
        className="w-13 h-13 p-2.5 flex items-center justify-center border-[3px] border-black bg-[#FFE7A5] relative"
        style={{ boxShadow: "4px 4px 0px 0px #000" }}
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
              stroke="#000"
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
