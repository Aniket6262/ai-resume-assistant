"use client";

import { useEffect, useState } from "react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,5,20,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.3)" : "none",
      }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-mono font-bold text-sm tracking-widest uppercase"
          style={{ background: "linear-gradient(90deg,#f472b6,#818cf8,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          AY
        </span>
        <div className="flex gap-8 text-sm">
          {["About","Experience","Projects","Skills"].map((s,i) => (
            <a key={s} href={`#${s.toLowerCase()}`}
              className="transition-all hover:scale-105"
              style={{ color: ["#f472b6","#818cf8","#38bdf8","#34d399"][i] }}>
              {s}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050514 0%, #0a0a2e 50%, #050514 100%)" }}>

      {/* Animated colorful blobs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #818cf8, #6366f1, transparent)" }} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, #f472b6, #ec4899, transparent)" }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #34d399, #10b981, transparent)" }} />
      <div className="absolute bottom-1/3 right-1/6 w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #38bdf8, #0ea5e9, transparent)" }} />



      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.3)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#34d399" }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#a5b4fc" }}>
            Open to work · MS @ ASU 2026
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl font-bold leading-none tracking-tight mb-6"
          style={{ animation: "fadeUp 0.6s ease both" }}>
          <span style={{ color: "#f1f5f9" }}>Aniket</span>
          <br />
          <span style={{
            background: "linear-gradient(90deg, #f472b6 0%, #818cf8 35%, #38bdf8 65%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% auto",
          }}>
            Yadav
          </span>
        </h1>

        <p className="text-xl max-w-xl leading-relaxed mb-10" style={{ color: "#94a3b8", animation: "fadeUp 0.6s 0.15s ease both" }}>
          Building intelligent systems at the intersection of
          <span style={{ color: "#818cf8" }}> AI</span>,
          <span style={{ color: "#38bdf8" }}> backend</span>, and
          <span style={{ color: "#34d399" }}> product</span>.
        </p>

        <div className="flex flex-wrap gap-4" style={{ animation: "fadeUp 0.6s 0.3s ease both" }}>
          <a href="https://github.com/Aniket6262" target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)", color:"white", boxShadow:"0 0 20px rgba(99,102,241,0.4)" }}>
            GitHub
          </a>
          <a href="https://linkedin.com/in/aniketyadav12" target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color:"white", boxShadow:"0 0 20px rgba(56,189,248,0.4)" }}>
            LinkedIn
          </a>
          <a href="mailto:ayada121@asu.edu"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#f472b6,#ec4899)", color:"white", boxShadow:"0 0 20px rgba(244,114,182,0.4)" }}>
            Get in touch ✉️
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-mono text-xs tracking-widest" style={{ color: "#818cf8" }}>SCROLL</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, #818cf8, transparent)" }} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </section>
  );
}

function About() {
  const stats = [
    { label:"Masters GPA", value:"3.56", sub:"Arizona State University", color:"#818cf8" },
    { label:"Bachelors GPA", value:"8.77", sub:"Mumbai University", color:"#f472b6" },
    { label:"Chess ELO", value:"900", sub:"Competitive player", color:"#38bdf8" },
    { label:"Projects", value:"4+", sub:"Shipped & deployed", color:"#34d399" },
  ];
  return (
    <section id="about" className="py-32 px-6" style={{ background: "#07071c" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-6"
            style={{ background:"rgba(244,114,182,0.1)", border:"1px solid rgba(244,114,182,0.3)", color:"#f472b6" }}>
            About Me
          </span>
          <h2 className="text-4xl font-bold mb-6 leading-snug" style={{ color:"#f1f5f9" }}>
            Building things that<br />
            <span style={{ background:"linear-gradient(90deg,#818cf8,#38bdf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              actually work.
            </span>
          </h2>
          <p className="leading-relaxed mb-4 text-base" style={{ color:"#94a3b8" }}>
            I'm a Software Engineer and MS student at ASU specializing in AI systems and full stack development.
            I build end-to-end products — from LLM security platforms to real-time analytics systems —
            with a focus on performance and real-world impact.
          </p>
          <p className="leading-relaxed mb-4 text-base" style={{ color:"#94a3b8" }}>
            Currently looking for Software Engineer or AI Engineer roles where I can ship things that matter.
            I care deeply about clean architecture, scalable systems, and products that actually solve problems.
          </p>
          <p className="leading-relaxed text-base" style={{ color:"#64748b" }}>
            Outside of tech: cricket, football, chess (ELO 900), and anime — Death Note is my all-time favourite.
            Born in Mumbai, now based in Tempe, AZ.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s,i) => (
            <div key={i} className="rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background:"#0d0d2e", border:`1px solid ${s.color}44`, boxShadow:`0 0 20px ${s.color}11` }}>
              <p className="text-4xl font-bold mb-2"
                style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color:s.color }}>{s.label}</p>
              <p className="text-xs" style={{ color:"#475569" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const items = [
    {
      role:"Software Developer Intern", company:"Jio Platforms Ltd",
      location:"Mumbai, India", period:"Feb 2023 – Apr 2023", color:"#818cf8",
      bullets:[
        "Optimized video playback using ExoPlayer in a multimedia Android app",
        "Implemented JSON parsing and SQLite for offline access",
        "Improved app performance by 5% through memory optimization",
      ],
    },
    {
      role:"Unity Game Developer", company:"Tank Fest (Independent)",
      location:"Mumbai, India", period:"Jan 2023 – May 2023", color:"#34d399",
      bullets:[
        "Built a 3D Unity/Blender game published on Google Play",
        "100+ downloads with a 4.7 ⭐ rating",
        "Led scripting, asset management and performance tuning",
      ],
    },
  ];
  return (
    <section id="experience" className="py-32 px-6" style={{ background:"#050514" }}>
      <div className="max-w-6xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-6"
          style={{ background:"rgba(129,140,248,0.1)", border:"1px solid rgba(129,140,248,0.3)", color:"#818cf8" }}>
          Experience
        </span>
        <h2 className="text-4xl font-bold mb-16" style={{ color:"#f1f5f9" }}>Where I've worked.</h2>
        <div className="space-y-6">
          {items.map((exp,i) => (
            <div key={i} className="rounded-2xl p-8 transition-all hover:-translate-y-0.5"
              style={{ background:"#0d0d2e", border:`1px solid ${exp.color}33`, boxShadow:`0 0 30px ${exp.color}08` }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="w-10 h-1 rounded mb-3" style={{ background:exp.color }} />
                  <h3 className="text-lg font-bold" style={{ color:"#f1f5f9" }}>{exp.role}</h3>
                  <p className="text-sm mt-1" style={{ color:exp.color }}>{exp.company} · {exp.location}</p>
                </div>
                <span className="font-mono text-xs px-3 py-1.5 rounded-full"
                  style={{ background:`${exp.color}15`, border:`1px solid ${exp.color}44`, color:exp.color }}>
                  {exp.period}
                </span>
              </div>
              <ul className="space-y-2">
                {exp.bullets.map((b,j) => (
                  <li key={j} className="flex gap-3 text-sm" style={{ color:"#94a3b8" }}>
                    <span style={{ color:exp.color }}>▸</span>{b}
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

function Projects() {
  const projects = [
    {
      title:"LLM Red-Teaming Platform", period:"Aug 2025 – Dec 2025",
      stack:["Python","FastAPI","MongoDB","DistilBERT"],
      color:"#f472b6", emoji:"🔴",
      bullets:[
        "Tested 1,000+ adversarial prompts, raised jailbreak bypass from 22%→35%",
        "3-layer Prompt Firewall with <5% false positives",
        "Reduced visual prompt-injection from 42%→<9%",
      ],
      link:"https://github.com/sudhersankv/LLM_Red_Teaming_Platform_for_Prompt_Security---CSE543",
    },
    {
      title:"Semantic Sports Analytics", period:"Jul 2024 – Nov 2024",
      stack:["Python","Apache Jena Fuseki","Flask","React"],
      color:"#38bdf8", emoji:"⚽",
      bullets:[
        "REST APIs with sub-2s latency over 200K+ records",
        "Optimized 20+ SPARQL queries to 1.2s average latency",
        "100% query accuracy across 10+ analytics insights",
      ],
      link:"https://github.com/Aniket6262/SER531-Group-7-Data-Integration-Project",
    },
    {
      title:"Fine-tuning LLMs (FLAN-T5 & Llama 2)", period:"Jul 2023 – May 2024",
      stack:["Python","PyTorch","FLAN-T5","Llama 2"],
      color:"#34d399", emoji:"🤖",
      bullets:[
        "Fine-tuned FLAN-T5 — 18% quality improvement in summarization",
        "Enhanced Llama 2 for Python code gen — 5% accuracy boost",
      ],
      link:"https://huggingface.co/dudleymax/ludwig-llama2python",
    },
  ];

  return (
    <section id="projects" className="py-32 px-6" style={{ background:"#07071c" }}>
      <div className="max-w-6xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-6"
          style={{ background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.3)", color:"#38bdf8" }}>
          Projects
        </span>
        <h2 className="text-4xl font-bold mb-16" style={{ color:"#f1f5f9" }}>Things I've built.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p,i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-2 hover:scale-[1.02]"
              style={{ background:"#0d0d2e", border:`1px solid ${p.color}44`, boxShadow:`0 0 30px ${p.color}15`, transitionDuration:"200ms" }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{p.emoji}</span>
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="transition-all hover:scale-110"
                  style={{ color:p.color }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
              <h3 className="font-bold text-base mb-1" style={{ color:"#f1f5f9" }}>{p.title}</h3>
              <p className="font-mono text-xs mb-4" style={{ color:p.color }}>{p.period}</p>
              <ul className="space-y-2 mb-5 flex-1">
                {p.bullets.map((b,j) => (
                  <li key={j} className="text-sm flex gap-2" style={{ color:"#94a3b8" }}>
                    <span style={{ color:p.color, flexShrink:0 }}>▸</span>{b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop:`1px solid ${p.color}22` }}>
                {p.stack.map((t) => (
                  <span key={t} className="font-mono text-xs px-2 py-1 rounded-lg"
                    style={{ background:`${p.color}15`, color:p.color, border:`1px solid ${p.color}33` }}>
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

function Skills() {
  const categories = [
    { name:"Languages", color:"#818cf8", items:["Python","Java","Go","C++","C#","JavaScript","TypeScript"] },
    { name:"Frameworks", color:"#f472b6", items:["React","Next.js","Flask","FastAPI","Angular","NodeJS"] },
    { name:"AI / ML", color:"#34d399", items:["LLMs","RAG","Fine-tuning","DistilBERT","PyTorch","Hugging Face"] },
    { name:"Databases", color:"#38bdf8", items:["PostgreSQL","MongoDB","Redis","MySQL","SQLite","Spark"] },
    { name:"DevOps & Cloud", color:"#fb923c", items:["Docker","Kubernetes","AWS","Azure","Linux"] },
    { name:"Tools", color:"#a78bfa", items:["Git","Android Studio","Unity 3D","Selenium","Pytest"] },
  ];

  return (
    <section id="skills" className="py-32 px-6" style={{ background:"#050514" }}>
      <div className="max-w-6xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-6"
          style={{ background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", color:"#34d399" }}>
          Skills
        </span>
        <h2 className="text-4xl font-bold mb-16" style={{ color:"#f1f5f9" }}>What I work with.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {categories.map((cat,i) => (
            <div key={i} className="rounded-2xl p-6 transition-all hover:-translate-y-1"
              style={{ background:"#0d0d2e", border:`1px solid ${cat.color}33`, boxShadow:`0 0 20px ${cat.color}0a` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background:cat.color, boxShadow:`0 0 8px ${cat.color}` }} />
                <p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color:cat.color }}>{cat.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{ background:`${cat.color}12`, border:`1px solid ${cat.color}33`, color:"#cbd5e1" }}>
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

function Footer() {
  return (
    <footer className="py-12 px-6"
      style={{ background:"#050514", borderTop:"1px solid rgba(129,140,248,0.2)" }}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs tracking-widest uppercase"
          style={{ background:"linear-gradient(90deg,#f472b6,#818cf8,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          Aniket Yadav © 2026
        </p>
        <div className="flex gap-6">
          {[
            { label:"GitHub", href:"https://github.com/Aniket6262", color:"#818cf8" },
            { label:"LinkedIn", href:"https://linkedin.com/in/aniketyadav12", color:"#38bdf8" },
            { label:"Email", href:"mailto:ayada121@asu.edu", color:"#f472b6" },
          ].map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs tracking-wider uppercase transition-all hover:scale-110"
              style={{ color:l.color }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main style={{ background:"#050514" }}>
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