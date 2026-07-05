"use client";
import { useState } from "react";
import { askQuestion } from "../lib/api";

export default function Copilot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const userMsg = { role: "user", text: question };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    const res = await askQuestion(question);
    setMessages((m) => [...m, { role: "ai", text: res.answer, sources: res.sources }]);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-violet-100">Expert Knowledge Copilot</h1>
      <div className="space-y-4 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div className={`inline-block p-3 rounded-lg max-w-lg whitespace-pre-wrap ${
              m.role === "user" ? "bg-violet-500 text-white font-medium" : "bg-[#2a2340] text-violet-100"
            }`}>
              {m.text}
            </div>
            {m.sources && (
              <p className="text-xs text-violet-400 mt-1">Sources: {m.sources.join(", ")}</p>
            )}
          </div>
        ))}
        {loading && <p className="text-violet-300">Thinking...</p>}
      </div>
      <div className="flex gap-2">
        <input
          className="border border-violet-700 bg-[#2a2340] text-violet-100 placeholder-violet-400 rounded-lg px-4 py-2 flex-1"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Ask about any equipment, e.g. What's going on with PX-102?"
        />
        <button onClick={handleAsk} className="bg-violet-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-violet-400">
          Ask
        </button>
      </div>
    </div>
  );
}