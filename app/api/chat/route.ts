import OpenAI from "openai";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ─────────────────────────────────────────────
// SQLITE PERSISTENT MEMORY
// ─────────────────────────────────────────────
const DB_PATH = path.join(process.cwd(), "data", "memory.db");

// Ensure data directory exists
fsSync.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });

const db = new Database(DB_PATH);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionId TEXT    NOT NULL,
    role      TEXT    NOT NULL,
    content   TEXT    NOT NULL,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );
  CREATE INDEX IF NOT EXISTS idx_session ON messages(sessionId);
`);

type Msg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20; // cap per session to avoid token overflow

function getMessages(sessionId: string): Msg[] {
  const rows = db
    .prepare(
      `SELECT role, content FROM messages
       WHERE sessionId = ?
       ORDER BY id DESC
       LIMIT ?`
    )
    .all(sessionId, MAX_MESSAGES) as Msg[];
  return rows.reverse(); // oldest first
}

function saveMessage(sessionId: string, role: "user" | "assistant", content: string) {
  db.prepare(
    `INSERT INTO messages (sessionId, role, content) VALUES (?, ?, ?)`
  ).run(sessionId, role, content);

  // Keep only last MAX_MESSAGES per session — prune older ones
  db.prepare(
    `DELETE FROM messages WHERE sessionId = ? AND id NOT IN (
       SELECT id FROM messages WHERE sessionId = ? ORDER BY id DESC LIMIT ?
     )`
  ).run(sessionId, sessionId, MAX_MESSAGES);
}

// ─────────────────────────────────────────────
// FILE LOADING
// ─────────────────────────────────────────────
async function loadResumeText(): Promise<string> {
  const resumePath = path.join(process.cwd(), "data", "resume.txt");
  return await fs.readFile(resumePath, "utf-8");
}

// ─────────────────────────────────────────────
// WEB SEARCH via Tavily
// ─────────────────────────────────────────────
async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "Web search is unavailable (missing TAVILY_API_KEY).";

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: 3,
        search_depth: "basic",
        include_answer: true,
      }),
    });

    if (!res.ok) return `Web search failed (status ${res.status}).`;

    const data = await res.json();
    if (data.answer) return data.answer;

    const snippets = (data.results ?? [])
      .slice(0, 3)
      .map((r: { title: string; content: string }) => `${r.title}: ${r.content}`)
      .join("\n\n");

    return snippets || "No results found.";
  } catch (e) {
    console.error("Tavily error:", e);
    return "Web search encountered an error.";
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function normalizeLine(s: string): string {
  return s.replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim();
}

function isProjectQuestion(q: string): boolean {
  const s = q.toLowerCase().trim();
  return (
    s === "projects" ||
    s === "project" ||
    s.includes("projects") ||
    s.includes("project") ||
    s.includes("portfolio") ||
    s.includes("show project") ||
    s.includes("list project") ||
    s.includes("list all project") ||
    s.includes("list all projects") ||
    s.includes("tell me about your projects") ||
    s.includes("tell me about your project")
  );
}

// ─────────────────────────────────────────────
// PROJECT PARSER
// ─────────────────────────────────────────────
interface Project {
  title: string;
  tech: string;
  dates: string;
  bullets: string[];
}

function extractProjects(resumeText: string): Project[] {
  const lines = resumeText
    .split("\n")
    .map(normalizeLine)
    .filter((l) => l.length > 0);

  const startIdx = lines.findIndex((l) => l.toUpperCase() === "PROJECTS");
  if (startIdx === -1) return [];

  const sectionHeaderRegex = /^[A-Z][A-Z\s&]+$/;
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (sectionHeaderRegex.test(lines[i]) && !lines[i].includes("|")) {
      endIdx = i;
      break;
    }
  }

  const projectLines = lines.slice(startIdx + 1, endIdx);
  const dateRegex =
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}\b/i;

  const isHeader = (line: string) =>
    line.includes("|") && dateRegex.test(line) && !line.startsWith("-");

  const projects: Project[] = [];
  let current: Project | null = null;

  for (const line of projectLines) {
    if (isHeader(line)) {
      if (current) projects.push(current);
      const parts = line.split("|").map((p) => p.trim());
      const title = parts[0] ?? "";
      const tech = parts[1] ?? "";
      const dateMatch = line.match(dateRegex);
      const dates = dateMatch ? dateMatch[0] : parts[2] ?? "";
      current = { title, tech, dates, bullets: [] };
      continue;
    }
    if (current && line.startsWith("-")) {
      current.bullets.push(line.replace(/^-+\s*/, "").trim());
      continue;
    }
    if (current && current.bullets.length > 0) {
      current.bullets[current.bullets.length - 1] += " " + line;
    }
  }

  if (current) projects.push(current);
  return projects;
}

// ─────────────────────────────────────────────
// FORMAT PROJECTS
// ─────────────────────────────────────────────
function formatProjects(projects: Project[]): string {
  if (!projects.length) return "No projects found in the resume.";

  const isLinkBullet = (b: string) =>
    /^(github|hugging face|link)\s*:/i.test(b);

  return projects
    .map((p) => {
      const header = `${p.title} (${p.dates})`;
      const descBullets = p.bullets.filter((b) => !isLinkBullet(b)).slice(0, 4);
      const linkBullets = p.bullets.filter((b) => isLinkBullet(b));
      const desc = descBullets.map((b) => `- ${b}`).join("\n");
      const links = linkBullets.map((b) => `- ${b}`).join("\n");
      return [header, desc, links].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

// ─────────────────────────────────────────────
// STREAMING SANITIZER
// ─────────────────────────────────────────────
function createSanitizer() {
  let pendingStar = false;
  let suppressSources = false;

  return (chunk: string): string => {
    if (!suppressSources && /(^|\n)\s*Sources\s*:/i.test(chunk)) {
      suppressSources = true;
    }
    if (suppressSources) return "";

    let out = "";
    for (const ch of chunk) {
      if (ch === "*") { pendingStar = !pendingStar; continue; }
      if (pendingStar) pendingStar = false;
      out += ch;
    }

    out = out.replace(/(^|\n)\s*#{1,6}\s*/g, "$1");
    out = out.replace(/[ \t]{2,}/g, " ");
    return out;
  };
}

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are GOJO, Aniket's AI Assistant for recruiters.

You have THREE sources of truth:
A) PROFILE CONTEXT (personal info below)
B) RESUME TEXT (provided after this prompt)
C) WEB SEARCH TOOL (use for anything that needs live/latest data)

Tone: friendly, confident, concise — like a human talking about a colleague.

RULES:
1. Do NOT invent anything beyond PROFILE CONTEXT + RESUME TEXT + web search results.
2. If something is not in any source, say: "GOJO doesn't have that info."
3. Output plain text only. No markdown, no bold, no asterisks. Use "-" bullets only for lists (like projects).
4. You may share links if they exist in the resume text or are returned by web search. Do not invent links.
5. Do NOT include a "Sources" section.
6. Keep answers focused (2-5 sentences for simple questions; longer only if asked).
7. GPA and CGPA mean the same thing. Masters GPA: 3.56/4.0 (ASU), Bachelors: 8.77/10.0 (Mumbai University).
8. You have full memory of the conversation history. Use prior context for follow-up questions. Never treat a follow-up as isolated.
9. If asked for a hiring opinion (e.g. "should I hire him", "yes or no"), answer confidently based on his resume.
10. If someone greets you or asks how you are, respond warmly and briefly as GOJO, then invite them to ask about Aniket.

WHEN TO USE WEB SEARCH:
- Questions about latest trends, technologies, or industry context related to Aniket's skills
- Verifying or expanding on something mentioned in the resume (e.g. a framework, a tool)
- Any question that requires current/real-time information
- When you don't know something, search immediately — do NOT ask the user if they want you to search
- Do NOT search for things already answered by the resume or profile context

PROFILE CONTEXT:
- Born in Mumbai in 2001.
- Current year is 2026, so he is 24 years old (turning 25 in 2026).
- Likes cricket, football, and chess (ELO 900).
- Enjoys anime; favorite is Death Note.
`.trim();

// ─────────────────────────────────────────────
// OPENAI TOOL DEFINITION
// ─────────────────────────────────────────────
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the internet for current information about technologies, frameworks, industry trends, or anything that requires live data.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to look up",
          },
        },
        required: ["query"],
      },
    },
  },
];

// ─────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { message, sessionId = "default" } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const resumeText = await loadResumeText();

    // ── Project questions: deterministic path ──
    if (isProjectQuestion(message)) {
      const projects = extractProjects(resumeText);
      const output = formatProjects(projects);
      saveMessage(sessionId, "user", message);
      saveMessage(sessionId, "assistant", output);
      return new Response(output, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // ── Load persistent memory from SQLite ──
    const history = getMessages(sessionId);
    saveMessage(sessionId, "user", message);

    const systemMessage = {
      role: "system" as const,
      content: `${SYSTEM_PROMPT}\n\nRESUME TEXT:\n${resumeText}`,
    };

    const allMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      systemMessage,
      ...history,
      { role: "user", content: message },
    ];

    // Step 1: Check if GPT wants to use web search
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: false,
      temperature: 0.4,
      max_tokens: 500,
      tools,
      tool_choice: "auto",
      messages: allMessages,
    });

    const choice = initialResponse.choices[0];
    const encoder = new TextEncoder();
    const sanitize = createSanitizer();

    // Step 2: Tool call → web search → stream final answer
    if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0] as any;
      const args = JSON.parse(toolCall.function.arguments);
      const searchResult = await tavilySearch(args.query);

      const messagesWithTool: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        systemMessage,
        ...history,
        { role: "user", content: message },
        choice.message,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: searchResult,
        },
      ];

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        stream: true,
        temperature: 0.4,
        max_tokens: 500,
        messages: messagesWithTool,
      });

      return new Response(
        new ReadableStream({
          async start(controller) {
            // ✅ Verify mode: prefix so user knows this answer came from web search
            const prefix = "Verified from web:\n";
            controller.enqueue(encoder.encode(prefix));
            let full = prefix;
            try {
              for await (const chunk of stream) {
                const token = chunk.choices?.[0]?.delta?.content ?? "";
                if (!token) continue;
                const safe = sanitize(token);
                if (!safe) continue;
                full += safe;
                controller.enqueue(encoder.encode(safe));
              }
              saveMessage(sessionId, "assistant", full);
            } catch (e) {
              console.error("Streaming error:", e);
              controller.enqueue(encoder.encode("\n\n[Error generating response. Please try again.]"));
            } finally {
              controller.close();
            }
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } }
      );
    }

    // Step 3: No tool call — stream direct answer
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      temperature: 0.4,
      max_tokens: 500,
      messages: allMessages,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          let full = "";
          try {
            for await (const chunk of stream) {
              const token = chunk.choices?.[0]?.delta?.content ?? "";
              if (!token) continue;
              const safe = sanitize(token);
              if (!safe) continue;
              full += safe;
              controller.enqueue(encoder.encode(safe));
            }
            saveMessage(sessionId, "assistant", full);
          } catch (e) {
            console.error("Streaming error:", e);
            controller.enqueue(encoder.encode("\n\n[Error generating response. Please try again.]"));
          } finally {
            controller.close();
          }
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } }
    );

  } catch (err) {
    console.error("API route error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}