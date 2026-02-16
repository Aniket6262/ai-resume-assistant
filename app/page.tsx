export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Aniket’s AI Resume Assistant</h1>
          <p className="text-gray-600">
            View my resume and ask questions about my projects, experience, and impact.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Open Resume PDF
            </a>

            <a
              href="/resume.pdf"
              download
              className="rounded-lg border px-4 py-2"
            >
              Download Resume
            </a>
          </div>
        </header>

        {/* Resume Viewer */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Resume</h2>

          <div className="h-[75vh] w-full overflow-hidden rounded-xl border">
            <iframe
              src="/resume.pdf"
              title="Resume PDF"
              className="h-full w-full"
            />
          </div>

          <p className="text-sm text-gray-500">
            If the PDF doesn’t render in your browser, click “Open Resume PDF”.
          </p>
        </section>

        {/* Next Section Placeholder */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Next</h2>
          <p className="text-gray-600">
            Next we’ll add Project Cards and an AI Chat assistant (with sources).
          </p>
        </section>
      </div>
    </main>
  );
}
