"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Send, Bot, User, FileText, Lightbulb, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { AI_STARTER_MESSAGES } from "@/lib/mock-data";

const SUGGESTED_PROMPTS = [
  "Explain what an NDA is in simple terms",
  "What clauses should every employment contract have?",
  "Can I terminate a freelance contract early?",
  "What is intellectual property assignment?",
  "What happens if payment is delayed?",
  "Summarize the key risks in a non-compete clause",
];

const AI_RESPONSES: Record<string, string> = {
  default: "That's a great question about contracts! Let me help you understand this better.\n\nContract law can be complex, but the key things to remember are:\n\n• **Read everything carefully** before signing\n• **Understand your obligations** and the other party's obligations\n• **Know your rights** including termination and dispute resolution\n• **Seek legal advice** for complex or high-value contracts\n\nWould you like me to explain any specific aspect in more detail?",

  nda: "An **NDA (Non-Disclosure Agreement)** is a legal contract that establishes a confidential relationship between parties.\n\n**Key elements:**\n• **Definition of confidential information** — what's protected\n• **Obligations** — how the receiving party must handle the info\n• **Exclusions** — what's NOT considered confidential (public info, etc.)\n• **Duration** — how long the obligation lasts\n• **Remedies** — what happens if breached\n\n**Types:**\n• Mutual NDA — both parties share confidential info\n• One-way NDA — only one party shares\n\nWould you like help generating an NDA?",

  ip: "**Intellectual Property (IP) Assignment** means transferring ownership of creative work from the creator to another party (usually the employer or client).\n\n**Common IP clauses:**\n• **Work for hire** — everything you create during employment belongs to the company\n• **Assignment clause** — you formally transfer ownership\n• **License clause** — you retain ownership but grant usage rights\n\n**Watch out for:**\n• Overly broad clauses that capture pre-existing IP\n• No carve-out for personal projects\n• Perpetual and irrevocable assignments\n\nAlways try to negotiate a pre-existing IP exclusion!",

  terminate: "Whether you can **terminate a contract early** depends on the termination provisions:\n\n**Common termination types:**\n• **Termination for convenience** — either party can exit with notice (e.g., 30 days)\n• **Termination for cause** — only if the other party breaches\n• **Mutual termination** — both parties agree to end it\n\n**Before terminating, check:**\n1. Notice period required (typically 14-30 days)\n2. Any penalties or fees for early termination\n3. What deliverables must be handed over\n4. IP ownership upon termination\n5. Non-compete and non-solicitation obligations\n\nWould you like me to help draft a termination notice?",

  payment: "**Late payment** is a common contract concern. Here's what typically happens:\n\n**Standard provisions:**\n• **Late fees** — usually 1.5-2% per month on overdue amounts\n• **Suspension of services** — you may pause work after X days overdue\n• **Termination rights** — after extended non-payment\n\n**Protecting yourself:**\n• Include clear payment terms (Net 30, Net 60, etc.)\n• Specify the invoice date as the trigger\n• Add late payment interest clauses\n• Consider milestone payments instead of completion payments\n• Retain IP until payment is received\n\nWould you like help drafting a payment clause?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("nda") || lower.includes("non-disclosure")) return AI_RESPONSES.nda;
  if (lower.includes("ip") || lower.includes("intellectual property")) return AI_RESPONSES.ip;
  if (lower.includes("terminate") || lower.includes("early") || lower.includes("exit")) return AI_RESPONSES.terminate;
  if (lower.includes("payment") || lower.includes("delayed") || lower.includes("late")) return AI_RESPONSES.payment;
  return AI_RESPONSES.default;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(AI_STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: getAIResponse(content),
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 1200 + Math.random() * 800);
  };

  const renderContent = (content: string) => {
    return content.split(/(\*\*[^*]+\*\*|\n\n|\n)/).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part === "\n\n") return <br key={i} />;
      if (part === "\n") return <br key={i} />;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 animate-pulse-glow">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold">Accord Legal Assistant</h1>
          <p className="text-xs text-muted-foreground">Ask anything about contracts and legal documents</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Suggested prompts (when fresh) */}
        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Suggested questions
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-xs text-left hover:bg-accent hover:border-primary/30 transition-all group"
                  id={`chat-prompt-${prompt.slice(0, 20).replace(/\s/g, "-")}`}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10"
            }`}>
              {msg.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4 text-primary" />
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"} px-4 py-3`}>
              <p className="text-sm leading-relaxed">{renderContent(msg.content)}</p>
              <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/60" : "text-muted-foreground"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/50 shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Ask about any contract clause, legal term, or your agreements..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={isTyping}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
            id="chat-message-input"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="rounded-xl h-12 w-12 shrink-0 p-0"
            id="chat-send-btn"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          Accord provides general information only. Not legal advice. Consult a qualified attorney for legal decisions.
        </p>
      </div>
    </div>
  );
}
