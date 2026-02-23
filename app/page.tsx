"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1e1e1e" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-mono text-sm text-slate-500 tracking-widest uppercase">
          AY
        </span>
        <div className="flex gap-8 text-sm text-slate-400">
          {["About", "Experience", "Projects", "Skills"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className="hover:text-white transition-colors"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #64748b, transparent)" }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <p
          className="font-mono text-slate-500 text-sm tracking-widest uppercase mb-6"
          style={{ animation: "fadeUp 0.6s ease both" }}
        >
          Software Engineer
        </p>
        <h1
          className="text-7xl md:text-8xl font-light text-white leading-none tracking-tight mb-6"
          style={{ animation: "fadeUp 0.6s 0.1s ease both", fontFamily: "var(--font-sans)" }}
        >
          Aniket
          <br />
          <span className="text-slate-500">Yadav</span>
        </h1>
        <p
          className="text-slate-400 text-lg max-w-xl leading-relaxed mb-10"
          style={{ animation: "fadeUp 0.6s 0.2s ease both" }}
        >
          MS Software Engineering @ ASU · Building intelligent systems at the
          intersection of AI, backend, and product.
        </p>
        <div
          className="flex gap-4"
          style={{ animation: "fadeUp 0.6s 0.3s ease both" }}
        >
          <a
            href="https://github.com/Aniket6262"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#e2e8f0",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.borderColor = "#64748b")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.borderColor = "#2a2a2a")
            }
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/aniketyadav12"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#e2e8f0",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.borderColor = "#64748b")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.borderColor = "#2a2a2a")
            }
          >
            LinkedIn
          </a>
          <a
            href="mailto:ayada121@asu.edu"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "#e2e8f0",
              color: "#0f172a",
            }}
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="font-mono text-xs text-slate-500 tracking-widest">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

// ── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section
      id="about"
      className="py-32 px-6"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-4">
            About
          </p>
          <h2 className="text-4xl font-light text-white mb-6 leading-snug">
            Building things that
            <br />
            <span className="text-slate-500">actually work.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            I'm a Software Engineering MS student at Arizona State University
            (GPA 3.56), graduating May 2026. I love working at the intersection
            of AI and systems — building products that are fast, reliable, and
            actually useful.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Outside of tech I play cricket, football, and chess (ELO 900). Big
            anime fan — Death Note is my all-time favourite. Born and raised in
            Mumbai, now based in Tempe, AZ.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "GPA", value: "3.56", sub: "Arizona State University" },
            { label: "GPA", value: "8.77", sub: "Mumbai University" },
            { label: "Chess ELO", value: "900", sub: "Competitive player" },
            { label: "Projects", value: "4+", sub: "Shipped & deployed" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{ background: "#121212", border: "1px solid #1e1e1e" }}
            >
              <p className="text-3xl font-light text-white mb-1">{s.value}</p>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-xs text-slate-600 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── EXPERIENCE ───────────────────────────────────────────────────────────────
function Experience() {
  const items = [
    {
      role: "Software Developer Intern",
      company: "Jio Platforms Ltd",
      location: "Mumbai, India",
      period: "Feb 2023 – Apr 2023",
      bullets: [
        "Optimized video playback using ExoPlayer in a multimedia Android app",
        "Implemented JSON parsing and SQLite for offline access",
        "Improved app performance by 5% through memory optimization",
      ],
    },
    {
      role: "Unity Game Developer",
      company: "Tank Fest (Independent)",
      location: "Mumbai, India",
      period: "Jan 2023 – May 2023",
      bullets: [
        "Built a 3D Unity/Blender game published on Google Play",
        "100+ downloads with a 4.7 rating",
        "Led scripting, asset management and performance tuning",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="py-32 px-6"
      style={{ background: "#080808" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-4">
          Experience
        </p>
        <h2 className="text-4xl font-light text-white mb-16">
          Where I've worked.
        </h2>
        <div className="space-y-6">
          {items.map((exp, i) => (
            <div
              key={i}
              className="rounded-xl p-8 transition-all"
              style={{ background: "#0e0e0e", border: "1px solid #1e1e1e" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-white text-lg font-medium">{exp.role}</h3>
                  <p className="text-slate-400 text-sm">
                    {exp.company} · {exp.location}
                  </p>
                </div>
                <span
                  className="font-mono text-xs px-3 py-1 rounded-full"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#94a3b8",
                  }}
                >
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-2">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-slate-400 text-sm">
                    <span className="text-slate-600 mt-1">—</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      title: "LLM Red-Teaming Platform",
      period: "Aug 2025 – Dec 2025",
      stack: ["Python", "FastAPI", "MongoDB", "DistilBERT"],
      bullets: [
        "Tested 1,000+ adversarial prompts, raised jailbreak bypass rates from 22% to 35%",
        "3-layer Prompt Firewall achieving <5% false positives",
        "Reduced visual prompt-injection success from 42% to <9%",
      ],
      link: "https://github.com/sudhersankv/LLM_Red_Teaming_Platform_for_Prompt_Security---CSE543",
    },
    {
      title: "Semantic Sports Analytics",
      period: "Jul 2024 – Nov 2024",
      stack: ["Python", "Apache Jena Fuseki", "Flask", "React"],
      bullets: [
        "REST APIs with sub-2s latency over 200K+ records",
        "Optimized 20+ SPARQL queries to 1.2s average latency",
        "10+ analytics insights with 100% query accuracy",
      ],
      link: "https://github.com/Aniket6262/SER531-Group-7-Data-Integration-Project",
    },
    {
      title: "Fine-tuning LLMs",
      period: "Jul 2023 – May 2024",
      stack: ["Python", "PyTorch", "FLAN-T5", "Llama 2"],
      bullets: [
        "Fine-tuned FLAN-T5 for dialogue summarization — 18% quality improvement",
        "Enhanced Llama 2 for Python code gen — 5% accuracy improvement",
      ],
      link: "https://huggingface.co/dudleymax/ludwig-llama2python",
    },
  ];

  return (
    <section
      id="projects"
      className="py-32 px-6"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-4">
          Projects
        </p>
        <h2 className="text-4xl font-light text-white mb-16">
          Things I've built.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col transition-all hover:-translate-y-1"
              style={{
                background: "#0e0e0e",
                border: "1px solid #1e1e1e",
                transitionDuration: "200ms",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-white font-medium leading-snug">{p.title}</h3>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-300 transition-colors ml-2 flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
              <p className="font-mono text-xs text-slate-600 mb-3">{p.period}</p>
              <ul className="space-y-2 mb-4 flex-1">
                {p.bullets.map((b, j) => (
                  <li key={j} className="text-slate-400 text-sm flex gap-2">
                    <span className="text-slate-700 flex-shrink-0">—</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-auto pt-4" style={{ borderTop: "1px solid #1e1e1e" }}>
                {p.stack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-2 py-0.5 rounded"
                    style={{ background: "#1a1a1a", color: "#64748b" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SKILLS ───────────────────────────────────────────────────────────────────
function Skills() {
  const categories = [
    {
      name: "Languages",
      items: ["Python", "Java", "Go", "C++", "C#", "JavaScript", "TypeScript"],
    },
    {
      name: "Frameworks",
      items: ["React", "Next.js", "Flask", "FastAPI", "Angular", "NodeJS"],
    },
    {
      name: "AI / ML",
      items: ["LLMs", "RAG", "Fine-tuning", "DistilBERT", "PyTorch", "Hugging Face"],
    },
    {
      name: "Databases",
      items: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite", "Spark"],
    },
    {
      name: "DevOps & Cloud",
      items: ["Docker", "Kubernetes", "AWS", "Azure", "Linux"],
    },
    {
      name: "Tools",
      items: ["Git", "Android Studio", "Unity 3D", "Selenium", "Pytest"],
    },
  ];

  return (
    <section
      id="skills"
      className="py-32 px-6"
      style={{ background: "#080808" }}
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-4">
          Skills
        </p>
        <h2 className="text-4xl font-light text-white mb-16">
          What I work with.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{ background: "#0e0e0e", border: "1px solid #1e1e1e" }}
            >
              <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">
                {cat.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 rounded-full transition-all hover:border-slate-600"
                    style={{
                      background: "#141414",
                      border: "1px solid #2a2a2a",
                      color: "#cbd5e1",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-12 px-6"
      style={{ background: "#080808", borderTop: "1px solid #141414" }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">
          Aniket Yadav © 2026
        </p>
        <div className="flex gap-6">
          {[
            { label: "GitHub", href: "https://github.com/Aniket6262" },
            { label: "LinkedIn", href: "https://linkedin.com/in/aniketyadav12" },
            { label: "Email", href: "mailto:ayada121@asu.edu" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors tracking-wider uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main style={{ background: "#080808", fontFamily: "var(--font-sans)" }}>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Footer />
    </main>
  );
}