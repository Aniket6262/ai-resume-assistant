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

function renderAssistantText(text: string) {
  const lines = (text || "")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");

  // Detect bullets that start with "- "
  const bulletLines = lines.filter((l) => l.trim().startsWith("- "));
  const otherLines = lines.filter((l) => !l.trim().startsWith("- "));

  return (
    <div className="space-y-2">
      {otherLines.map((line, i) => {
        // Keep your Sources formatter (clickable)
        if (line.toLowerCase().startsWith("sources:")) {
          const urlMatch = line.match(/https?:\/\/\S+/);
          const url = urlMatch?.[0];

          return (
            <div key={`src-${i}`} className="pt-1 text-xs text-slate-600">
              {"Sources: "}
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700 break-all"
                >
                  {url}
                </a>
              ) : (
                <span>{line.replace(/^sources:\s*/i, "")}</span>
              )}
            </div>
          );
        }

        // Normal text: linkify automatically
        return (
          <p key={`p-${i}`} className="whitespace-pre-wrap">
            <Linkify options={linkifyOptions}>{line}</Linkify>
          </p>
        );
      })}

      {bulletLines.length > 0 && (
        <ul className="list-disc ml-6 space-y-1 marker:text-slate-700">
          {bulletLines.map((line, i) => (
            <li key={`b-${i}`}>
              <Linkify options={linkifyOptions}>
                {line.replace(/^- /, "")}
              </Linkify>
            </li>
          ))}
        </ul>
      )}
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
        "Hi! Ask me anything about Aniket’s resume, projects, and technical experience. I’ll share sources when relevant.",
    },
  ]);

  const sessionId = useMemo(() => {
    // stable per browser tab/session
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

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    // Add empty assistant placeholder (we stream into it)
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

        // Stream into the last assistant message
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
    } catch (e: any) {
      setMessages((prev) => {
        const copy = [...prev];
        // Replace last assistant bubble with error
        if (copy.length && copy[copy.length - 1].role === "assistant") {
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "Sorry — I couldn’t reach the server. Please check your API key and /api/chat route.",
          };
        }
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        🤖 Ask my AI Resume Assistant
      </h2>
      <p className="text-sm text-slate-600 mt-1">
        Ask about projects, skills, technical decisions, and impact (with sources).
      </p>

      {/* Chat window */}
      <div className="mt-4 h-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-900 border border-slate-200",
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
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white text-slate-700 border border-slate-200">
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
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
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
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          type="button"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Tip: Press Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}
