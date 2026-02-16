"use client";

import { useEffect, useState } from "react";

export default function ChatBox({ preset }: { preset?: string }) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preset) setInput(preset);
  }, [preset]);

  async function ask() {
    const msg = input.trim();
    if (!msg) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: "recruiter-demo" }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setAnswer(text || `Request failed: ${res.status}`);
        return;
      }

      if (!res.body) {
        setAnswer("No response body.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value));
      }
    } catch {
      setAnswer("Error calling /api/chat. Check server logs and API key.");
    } finally {
      setLoading(false);
    }
  }

  const lines = answer
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");

  const bulletLines = lines.filter((l) => l.trim().startsWith("- "));
  const otherLines = lines.filter((l) => !l.trim().startsWith("- "));

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        🤖 Ask my AI Resume Assistant
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Ask about my projects, skills, technical decisions, and impact (with sources).
      </p>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Ask a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
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

      <div className="mt-4 min-h-[160px] rounded-xl border border-slate-200 bg-slate-50 p-4">
        {!answer && !loading ? (
          <p className="text-sm text-slate-500">Answers will appear here...</p>
        ) : (
          <div className="space-y-3 text-sm text-slate-900">
            {bulletLines.length > 0 && (
              <ul className="ml-8 list-disc space-y-2 marker:text-slate-700">
                {bulletLines.map((line, i) => (
                  <li key={`b-${i}`}>{line.replace(/^- /, "")}</li>
                ))}
              </ul>
            )}

            {otherLines.map((line, i) => {
              if (line.toLowerCase().startsWith("sources:")) {
                const urlMatch = line.match(/https?:\/\/\S+/);
                const url = urlMatch?.[0];

                return (
                  <div key={`s-${i}`} className="pt-1 text-xs text-slate-600">
                    Sources:{" "}
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline hover:text-blue-700"
                      >
                        link
                      </a>
                    ) : null}
                    
                  </div>
                );
              }

              return (
                <p key={`p-${i}`} className="whitespace-pre-wrap">
                  {line}
                </p>
              );
            })}

            {loading && <p className="text-sm text-slate-500">Thinking...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
