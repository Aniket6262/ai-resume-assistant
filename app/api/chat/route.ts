import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Simple in-memory session memory (resets if server restarts)
const memoryStore: Record<
  string,
  { role: "user" | "assistant"; content: string }[]
> = {};

// ✅ Your resume/project context (edit anytime to match your real resume)
const RESUME_CONTEXT = `
Name: Aniket Yadav

Projects:

1) Semantic Sports Analytics Platform
- Built a semantic ontology system using OWL/RDF/SPARQL to query 200K+ records across 5+ datasets.
- Developed 20+ optimized SPARQL queries on Apache Jena Fuseki with ~1.2s average query latency.
- Implemented full-stack platform with Flask + React delivering 10+ analytical insights with 100% query accuracy.

Tech Stack:
- OWL, RDF, SPARQL, Apache Jena Fuseki, Flask, React, Python

2) LLM Red-Teaming Platform
- Built an automated red-teaming framework evaluating 1,000+ adversarial prompts for jailbreaks and prompt injection.
- Identified semantic vector-drift attacks increasing jailbreak bypass from 22% → 35%.
- Implemented a DistilBERT-based classifier and multi-layer prompt firewall.

Tech Stack:
- Python, PyTorch, DistilBERT, Flask, React
`;

export async function POST(req: Request) {
  // Expect: { message: string, sessionId?: string }
  const { message, sessionId = "default" } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY in .env.local", { status: 500 });
  }

  if (!message || typeof message !== "string") {
    return new Response("Invalid request. Expected { message: string }", {
      status: 400,
    });
  }

  if (!memoryStore[sessionId]) memoryStore[sessionId] = [];

  const messages = [
    {
      role: "system" as const,
      content:
        "You are Aniket's AI Resume Assistant. Use ONLY the context below to answer recruiter questions. " +
        "Be concise, professional, and include metrics + tech stack when available. " +
        "Output plain text bullets (no markdown like ** or ##). " +
        "At the end of each answer, add a short 'Sources:' line referencing the project name used. " +
        "If something is not in the context, say you don't have that info.\n\n" +
        RESUME_CONTEXT,
    },
    ...memoryStore[sessionId],
    { role: "user" as const, content: message },
  ];

  // Streaming response
  const stream = await openai.chat.completions.create({
    model: "gpt-5.2-chat-latest",
    stream: true,
    messages,
  });

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        let fullAnswer = "";

        try {
          for await (const chunk of stream) {
            const token = chunk.choices?.[0]?.delta?.content ?? "";
            fullAnswer += token;
            controller.enqueue(encoder.encode(token));
          }

          // Save conversation to memory
          memoryStore[sessionId].push({ role: "user", content: message });
          memoryStore[sessionId].push({ role: "assistant", content: fullAnswer });

          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode("\n\n[Error while streaming response]")
          );
          controller.close();
        }
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
