import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// simple memory per session (in-memory; resets when server restarts)
const memoryStore: Record<
  string,
  { role: "user" | "assistant"; content: string }[]
> = {};

export async function POST(req: Request) {
  const { message, sessionId = "default" } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY in .env.local", { status: 500 });
  }

  if (!memoryStore[sessionId]) memoryStore[sessionId] = [];

  const messages = [
    {
      role: "system" as const,
      content:
        "You are Aniket's AI Resume Assistant. Answer recruiter questions about Aniket’s resume/projects. " +
        "Be concise and professional. If you don't know something from the resume/projects, say so.",
    },
    ...memoryStore[sessionId],
    { role: "user" as const, content: message },
  ];

  // Balanced GPT-5 choice (you asked for GPT-5)
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

        for await (const chunk of stream) {
          const token = chunk.choices?.[0]?.delta?.content ?? "";
          full += token;
          controller.enqueue(encoder.encode(token));
        }

        // Save memory
        memoryStore[sessionId].push({ role: "user", content: message });
        memoryStore[sessionId].push({ role: "assistant", content: full });

        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
