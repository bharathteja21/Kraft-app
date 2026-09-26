"use client";

import { useState } from "react";
import { useSession } from "@/lib/session-store";

type Message = { role: "user" | "assistant"; text: string };

export default function ChatWidget() {
  const { plan } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm the Kraft assistant. Ask me which template fits your content, or how exports work." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const locked = plan === "free";

  async function send() {
    if (!input.trim() || locked) return;
    const next = [...messages, { role: "user" as const, text: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", text: data.reply || "Sorry, I couldn't reach the assistant." }]);
    } catch {
      setMessages([...next, { role: "assistant", text: "Chat is offline in this demo — wire up ANTHROPIC_API_KEY to enable it." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 card mb-3 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-kraft-line font-serif text-kraft-gold">
            Kraft Assistant {locked && <span className="pill bg-kraft-line ml-2">Pro only</span>}
          </div>
          <div className="flex-1 max-h-80 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span className={"inline-block px-3 py-2 rounded-lg " + (m.role === "user" ? "bg-kraft-gold text-black" : "bg-kraft-line")}>
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-xs opacity-60">Thinking…</div>}
          </div>
          <div className="p-3 border-t border-kraft-line flex gap-2">
            <input
              value={input}
              disabled={locked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={locked ? "Upgrade to Pro to chat" : "Ask something…"}
              className="flex-1 bg-transparent border border-kraft-line rounded px-2 py-1 text-sm outline-none disabled:opacity-40"
            />
            <button onClick={send} disabled={locked} className="btn-gold px-3 py-1 rounded text-sm disabled:opacity-40">
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="btn-gold w-14 h-14 rounded-full shadow-lg text-xl"
        aria-label="Toggle chat"
      >
        💬
      </button>
    </div>
  );
}
