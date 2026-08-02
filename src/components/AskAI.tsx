import { useState } from "react";
import { api, ApiError } from "../api/client";
import { AskResult } from "../api/types";
import { useToast } from "../context/ToastContext";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<AskResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const result = await api.post<AskResult>("/ai/ask", { question });
      setHistory((h) => [...h, { ...result, question }]);
      setQuestion("");
    } catch (err) {
      show(err instanceof ApiError ? err.message : "Couldn't reach the assistant", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card card-pad">
      <div className="flex-between mb-16">
        <div>
          <h3 style={{ fontSize: 17 }}>Ask the assistant</h3>
          <p className="text-sm">Answers are grounded in the knowledge base your care team has provided.</p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="flex-col gap-16 mb-16" style={{ maxHeight: 280, overflowY: "auto" }}>
          {history.map((h, i) => (
            <div key={i}>
              <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{h.question}</p>
              <p style={{ fontSize: 14 }}>{h.answer}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={ask} className="flex gap-8">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What should I do if a dose is missed?"
          aria-label="Ask a question"
        />
        <button className="btn btn-accent" disabled={loading} type="submit">
          {loading ? <span className="spinner" /> : "Ask"}
        </button>
      </form>
    </div>
  );
}
