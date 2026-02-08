"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    text: "Hi there! 👋 Welcome to GDG VITB. How can I help you today?",
    sender: "bot",
    timestamp: new Date(),
  },
];

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(trimmed),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center",
          "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300",
          "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
          isOpen && "rotate-90 bg-red-500 hover:bg-red-600",
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-50 flex flex-col",
          "bottom-20 right-4 sm:bottom-24 sm:right-6",
          "w-[calc(100vw-2rem)] sm:w-[360px] max-h-[70vh] sm:max-h-[520px]",
          "rounded-2xl shadow-2xl",
          "border border-gray-200 dark:border-gray-700",
          "bg-white dark:bg-gray-900",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-0 opacity-0 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 rounded-t-2xl bg-blue-600 text-white">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-white/20">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold leading-tight">
              GDG VITB Chat
            </h3>
            <p className="text-xs text-blue-100">
              We typically reply instantly
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] sm:min-h-[300px] max-h-[50vh] sm:max-h-[350px] hide-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 max-w-[85%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center h-7 w-7 rounded-full shrink-0 mt-1",
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
                )}
              >
                {msg.sender === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm",
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 mr-auto max-w-[85%]">
              <div className="flex items-center justify-center h-7 w-7 rounded-full shrink-0 mt-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-gray-100 dark:bg-gray-800">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-800 dark:text-gray-200",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "border-none outline-none focus:ring-2 focus:ring-blue-400",
            )}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "flex items-center justify-center h-10 w-10 rounded-full transition-all",
              "bg-blue-600 text-white hover:bg-blue-700",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-400",
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("event") || lower.includes("hackathon")) {
    return "We host exciting events like hackathons, workshops, and tech talks throughout the year! Check out our Events page for upcoming activities. 🚀";
  }
  if (
    lower.includes("join") ||
    lower.includes("member") ||
    lower.includes("register")
  ) {
    return "We'd love to have you! Head over to our Recruitment page to apply and become part of the GDG VITB family. 🎉";
  }
  if (lower.includes("team") || lower.includes("lead")) {
    return "Our team page showcases all the amazing people behind GDG VITB. Check it out in the Teams section! 👥";
  }
  if (
    lower.includes("contact") ||
    lower.includes("reach") ||
    lower.includes("email")
  ) {
    return "You can reach us through our Contact Us page or email us directly. We're always happy to connect! 📧";
  }
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return "Hey! 😊 How can I assist you today? Feel free to ask about events, teams, or anything about GDG VITB!";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Let me know if there's anything else I can help with. 😊";
  }
  if (lower.includes("gallery") || lower.includes("photo")) {
    return "Check out our Gallery page to see photos from past events and community moments! 📸";
  }

  return "Thanks for reaching out! For more detailed assistance, please visit our Contact Us page or explore the website. Is there anything specific I can help with? 😊";
}
