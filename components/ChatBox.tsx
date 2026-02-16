"use client";

import { useEffect, useState } from "react";

export default function ChatBox({ preset }: { preset?: string }) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("Answers will appear here...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preset) setInput(preset);
  }, [preset]);

  async function ask() {
    const msg = input.trim();
    if (!msg) return;

    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, sessionId: "recruiter-demo" }),
    });

    if (!res.body) {
      setAnswer("No response body.");
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      setAnswer((prev) => prev + decoder.decode(value));
    }

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        🤖 Ask my AI Resume Assistant
      </h2>
      <p className="text-sm text-slate-600 mt-1">
        Ask about my projects, skills, technical decisions, and impact (with sources).
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Ask a question..."
        />
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          type="button"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[160px]">
        <pre className="whitespace-pre-wrap text-sm text-slate-900">
          {answer || (loading ? "Thinking..." : "")}
        </pre>
      </div>
    </div>
  );
}
