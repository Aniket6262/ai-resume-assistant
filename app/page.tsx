"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  const [preset] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        {/* Header */}
        <header className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Aniket’s AI Resume Assistant
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Ask anything about my resume, projects, and technical experience. 
              The assistant answers using resume-backed context and includes sources when relevant.
            </p>
          </div>
        </header>

        {/* Chat (main focus) */}
        <section className="space-y-3">
          <ChatBox preset={preset} />
        </section>

        {/* Resume (dropdown, hidden by default) */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Resume</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Optional: open or download my resume PDF.
                </p>
              </div>

              <span className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 group-open:hidden">
                Show
              </span>
              <span className="hidden rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 group-open:inline">
                Hide
              </span>
            </summary>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-3">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                >
                  Open Resume (new tab)
                </a>

                <a
                  href="/resume.pdf"
                  download
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-100"
                >
                  Download Resume
                </a>
              </div>

              <p className="text-xs text-slate-500">
                If your browser doesn’t preview PDFs, use “Open Resume (new tab)”.
              </p>
            </div>
          </details>
        </section>

        {/* Footer / About */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">About</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">
            This AI assistant is designed for recruiters and hiring managers to quickly
            understand my experience, technical decisions, and impact without scanning
            a full resume.
          </p>
        </section>
      </div>
    </main>
  );
}
