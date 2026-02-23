"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Linkify from "linkify-react";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const linkifyOptions = {
  defaultProtocol: "https",
  target: "_blank",
  rel: "noopener noreferrer",
  className: "text-blue-600 underline hover:text-blue-700 break-all",
};

// Detects "Label: https://..." and renders as a short clickable badge
// e.g. "GitHub: https://github.com/..." → [GitHub ↗]
function renderLinkBadge(text: string): React.ReactElement | null {
  const match = text.match(/^([^:]+):\s*(https?:\/\/\S+)$/i);
  if (!match) return null;
  const label = match[1].trim();
  const url = match[2].trim();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
    >
      {label} ↗
    </a>
  );
}

function renderAssistantText(text: string) {
  const lines = (text || "").split("\n").map((l) => l.trimEnd());

  type Block =
    | { type: "text"; content: string }
    | { type: "bullets"; items: string[] };

  const blocks: Block[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (trimmed.startsWith("- ")) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "bullets") {
        last.items.push(trimmed.replace(/^- /, ""));
      } else {
        blocks.push({ type: "bullets", items: [trimmed.replace(/^- /, "")] });
      }
    } else {
      blocks.push({ type: "text", content: trimmed });
    }
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="whitespace-pre-wrap">
              <Linkify options={linkifyOptions}>{block.content}</Linkify>
            </p>
          );
        }

        return (
          <ul key={i} className="list-disc ml-6 space-y-1 marker:text-slate-700">
            {block.items.map((item, j) => {
              const badge = renderLinkBadge(item);
              if (badge) {
                // No bullet dot for link lines — render as inline badge
                return (
                  <li key={j} className="list-none -ml-6 mt-1">
                    {badge}
                  </li>
                );
              }
              return (
                <li key={j}>
                  <Linkify options={linkifyOptions}>{item}</Linkify>
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}

export default function ChatBox({ preset }: { preset?: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm GOJO, Aniket's AI Resume Assistant. Ask me anything about his resume, projects, and technical experience.",
    },
  ]);

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return "recruiter-demo";
    const key = "ai_resume_session_id";
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = `sess_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
    return id;
  }, []);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (preset) setInput(preset);
  }, [preset]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `Request failed: ${res.status}`);
      }

      if (!res.body) throw new Error("No response body.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = {
              role: "assistant",
              content: (last.content || "") + chunk,
            };
          }
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length && copy[copy.length - 1].role === "assistant") {
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "Sorry — I couldn't reach the server. Please check your API key and /api/chat route.",
          };
        }
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl p-4" style={{background:"#0e0e0e"}}>
      <h2 className="text-base font-semibold text-slate-100">
        🤖 Ask my AI Resume Assistant
      </h2>
      <p className="text-xs text-slate-500 mt-1">
        Ask about projects, skills, technical decisions, and experience.
      </p>

      {/* Chat window */}
      <div className="mt-3 h-[340px] overflow-y-auto rounded-xl p-3" style={{background:"#0a0a0a", border:"1px solid #1e1e1e"}}>
        <div className="space-y-3">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                    isUser
                      ? "bg-slate-700 text-white"
                      : "bg-[#141414] text-slate-200 border border-[#2a2a2a]",
                  ].join(" ")}
                >
                  {m.role === "assistant" ? (
                    renderAssistantText(
                      m.content ||
                        (loading && idx === messages.length - 1 ? "..." : "")
                    )
                  ) : (
                    <p className="whitespace-pre-wrap">
                      <Linkify options={linkifyOptions}>{m.content}</Linkify>
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm text-slate-400" style={{background:"#141414", border:"1px solid #2a2a2a"}}>
                Thinking…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600" style={{background:"#141414", border:"1px solid #2a2a2a"}}
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-40 transition-colors" style={{background:"#e2e8f0", color:"#0f172a"}}
          type="button"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Tip: Press Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}