import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs"; // fs needs Node runtime

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type Msg = { role: "user" | "assistant"; content: string };
const memoryStore: Record<string, Msg[]> = {};

// --- helpers ---
async function loadResumeText() {
  const resumePath = path.join(process.cwd(), "data", "resume.txt");
  return await fs.readFile(resumePath, "utf-8");
}

function extractUrls(text: string) {
  // Grabs http/https links; trims trailing punctuation sometimes copied in PDFs
  const raw = Array.from(text.matchAll(/https?:\/\/\S+/g)).map((m) => m[0]);
  return raw.map((u) => u.replace(/[)\],.]+$/g, ""));
}

const SYSTEM_PROMPT = `
You are Aniket's AI Resume Assistant.
Answer naturally like a human explaining his resume.
Use ONLY the resume context (resume.txt). If info is missing, say you don’t have that info.

IMPORTANT FORMATTING RULES:
1) If the user asks about "projects" or "tell me about your project(s)", you MUST format like this:

<Project Name> (<dates if available>)
- 2–4 bullet points describing ONLY this project (what it is, what you built, impact/metrics)
GitHub/Link: <clickable URL if it exists in resume; otherwise omit this line entirely>

Then repeat the same block for the next project.
Do NOT list all project names first.
Do NOT print "GitHub/Link: Not provided".
Do NOT add a Sources section unless the resume contains an actual project URL, and ONLY include Sources for that project.

2) For non-project questions (phone, LinkedIn, education, experience, skills, etc.), do NOT include Sources.

3) Keep tone human and concise. Bullets only when helpful.

When you include a URL, always print it as plain text (https://...) so the UI makes it clickable.
`;

export async function POST(req: Request) {
  try {
    const { message, sessionId = "default" } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY", { status: 500 });
    }

    const resumeText = await loadResumeText();
    const urls = extractUrls(resumeText);

    if (!memoryStore[sessionId]) memoryStore[sessionId] = [];

    const messages = [
      {
        role: "system" as const,
        content:
          SYSTEM_PROMPT +
          "\n\nRESUME TEXT:\n" +
          resumeText +
          "\n\nURLS FOUND IN RESUME (Only these may appear in Sources):\n" +
          (urls.length ? urls.join("\n") : "NONE"),
      },
      ...memoryStore[sessionId],
      { role: "user" as const, content: message },
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2-chat-latest",
      stream: true,
      messages,
    });

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          let full = "";
          try {
            for await (const chunk of stream) {
              const token = chunk.choices?.[0]?.delta?.content ?? "";
              if (!token) continue;

              full += token;
              controller.enqueue(encoder.encode(token));
            }

            memoryStore[sessionId].push({ role: "user", content: message });
            memoryStore[sessionId].push({ role: "assistant", content: full });
          } catch (e) {
            console.error("Streaming error:", e);
            controller.enqueue(encoder.encode("\n\n[Error streaming response]\n"));
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (err) {
    console.error("API error:", err);
    return new Response("Server error", { status: 500 });
  }
}
