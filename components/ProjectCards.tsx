type Props = {
  onAsk: (question: string) => void;
};

const projects = [
  {
    title: "Semantic Sports Analytics Platform",
    subtitle: "OWL/RDF/SPARQL • Apache Jena Fuseki • Flask + React",
    prompts: [
      "Summarize this project in 20 seconds.",
      "What was my role and impact (metrics)?",
      "What were the hardest technical challenges and how did I solve them?",
    ],
  },
  {
    title: "LLM Red-Teaming Platform",
    subtitle: "Prompt security • adversarial testing • evaluation metrics",
    prompts: [
      "What problem does this project solve?",
      "What metrics/results did I achieve?",
      "How does this relate to an SDE role?",
    ],
  },
];

export default function ProjectCards({ onAsk }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((p) => (
        <div key={p.title} className="rounded-xl border p-4 bg-white">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{p.subtitle}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {p.prompts.map((q) => (
              <button
                key={q}
                onClick={() => onAsk(`${p.title}: ${q}`)}
                className="text-sm rounded-full border px-3 py-1 hover:bg-gray-100"
                type="button"
              >
                Ask AI
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
