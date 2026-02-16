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
      body: JSON.stringify({ message: msg }),
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
    <div className="rounded-xl border p-4 bg-white">
      <h2 className="text-xl font-semibold">🤖 Ask my AI Resume Assistant</h2>
      <p className="text-sm text-gray-600 mt-1">
        Ask about my projects, skills, technical decisions, and impact (with sources).
      </p>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Ask a question..."
        />
        <button
          onClick={ask}
          disabled={loading}
          className="rounded-lg bg-black px-4 py-2 text-white"
          type="button"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <pre className="mt-4 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-lg min-h-[140px]">
        {answer}
      </pre>
    </div>
  );
}
