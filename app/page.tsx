"use client";

import { useState } from "react";
import ProjectCards from "@/components/ProjectCards";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  const [preset, setPreset] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        {/* Header */}
        <header className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Aniket’s AI Resume Assistant
            </h1>
            <p className="text-slate-600">
              View my resume and ask questions about my projects, experience, and impact.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
              >
                Open Resume PDF
              </a>

              <a
                href="/resume.pdf"
                download
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-100"
              >
                Download Resume
              </a>
            </div>
          </div>
        </header>

        {/* Resume Viewer */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Resume</h2>

          <div className="h-[75vh] w-full overflow-hidden rounded-2xl border bg-white shadow-sm">
            <iframe
              src="/resume.pdf"
              title="Resume PDF"
              className="h-full w-full"
            />
          </div>

          <p className="text-sm text-slate-600">
            If the PDF doesn’t render in your browser, click “Open Resume PDF”.
          </p>
        </section>

        {/* Projects */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="text-slate-600">
            Click a prompt to auto-fill the chat.
          </p>
          <ProjectCards onAsk={(q) => setPreset(q)} />
        </section>

        {/* Chat */}
        <section className="space-y-3">
          <ChatBox preset={preset} />
        </section>
      </div>
    </main>
  );
}
