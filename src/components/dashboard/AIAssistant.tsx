"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const suggestions = [
  "Generate orbital decay report",
  "Compare last 10 launches",
  "Explain CME M2.4 impact",
  "List rover discoveries",
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const history = await res.json();
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // Default greeting
          setMessages([
            {
              role: "ai",
              text: "Aether telemetry sweeps nominal. I can assist you with orbital mechanics, SpaceX countdown schedules, near-Earth object threat radar, or planetary geology datasets. What is your query?",
            },
          ]);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Auto-scroll chat window to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    
    const userMessage: Message = { role: "user", text: textToSend };
    // Optimistically add user prompt to state
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send history up to the last 10 exchanges to stay within rate-limits and token constraints
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.slice(-10),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "ai", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Downlink communication failure. Check API keys." }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "ai", text: "Uplink signal blocked. Check connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-7 relative overflow-hidden h-full flex flex-col justify-between min-h-[460px]" id="ai-assistant">
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-accent to-primary grid place-items-center">
            <Sparkles className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-base">Aether AI</div>
            <div className="flex items-center gap-1.5 select-none pointer-events-none">
              <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
              <span className="font-accent text-[8px] text-muted-foreground">REASONING ENGINE · v4.2</span>
            </div>
          </div>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground select-none">ONLINE</span>
      </div>

      {/* Message Log */}
      <div
        ref={scrollRef}
        className="relative mt-4 flex-1 space-y-4 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-border pr-2 py-1"
      >
        {initialLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] text-xs leading-relaxed rounded-2xl px-4 py-2.5 
                  ${
                    m.role === "user"
                      ? "bg-primary/10 text-foreground border border-primary/20 rounded-br-md"
                      : "bg-white/[0.03] text-foreground/90 border border-border rounded-bl-md"
                  }
                `}
              >
                {m.text}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.03] text-foreground/90 border border-border rounded-bl-md rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-3 w-3 text-primary animate-spin" />
              <span className="font-accent text-[8px] text-muted-foreground uppercase tracking-widest select-none pointer-events-none">COGNITIVE SOLVER PROCESSING…</span>
            </div>
          </div>
        )}
      </div>

      {/* Inputs & Suggestions */}
      <div className="relative mt-4 pt-4 border-t border-border/40 select-none">
        <div className="flex gap-1.5 flex-wrap mb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestClick(s)}
              disabled={loading}
              className="text-[9px] px-2.5 py-1 rounded-full border border-border bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition cursor-pointer disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="relative flex items-center gap-2 rounded-xl border border-border bg-background/60 backdrop-blur p-1.5 pl-3"
        >
          <input
            placeholder="Ask Aether about any mission, dataset or anomaly…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-muted-foreground/70 py-2.5 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-9 w-9 grid place-items-center rounded-lg bg-foreground text-background hover:bg-foreground/90 transition cursor-pointer disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
export default AIAssistant;
