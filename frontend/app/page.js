import Link from "next/link";
import { Factory, Network, MessageSquareText, LayoutDashboard, ArrowRight, FileText, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-500 rounded-xl p-2.5">
          <Factory size={24} className="text-white" />
        </div>
        <span className="text-violet-300 font-medium tracking-wide">PLANTMIND AI</span>
      </div>

      <h1 className="text-5xl font-bold text-violet-100 leading-tight mb-6">
        One AI. Every document.<br />Every asset. Every decision.
      </h1>
      <p className="text-lg text-violet-300 max-w-2xl mb-10">
        PlantMind AI turns a plant's scattered documents — maintenance logs, inspection
        reports, incident records, vendor files — into a living knowledge graph and an
        AI analyst that answers real operational questions with evidence, not guesses.
      </p>

      <div className="flex gap-4 mb-20">
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition">
          Open Dashboard <ArrowRight size={18} />
        </Link>
        <Link href="/copilot" className="inline-flex items-center gap-2 bg-[#2a2340] border border-violet-600 text-violet-100 px-6 py-3 rounded-xl">
          Try the Copilot
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-20">
        <div className="bg-[#2a2340] border border-violet-700/40 rounded-2xl p-6">
          <FileText className="text-violet-400 mb-3" size={28} />
          <h3 className="text-violet-100 font-semibold mb-2">Knowledge Engine</h3>
          <p className="text-violet-400 text-sm">
            Ingests PDFs, extracts equipment, vendors, and people, and builds a
            connected knowledge graph automatically.
          </p>
        </div>
        <div className="bg-[#2a2340] border border-violet-700/40 rounded-2xl p-6">
          <Sparkles className="text-fuchsia-400 mb-3" size={28} />
          <h3 className="text-violet-100 font-semibold mb-2">Intelligence Engine</h3>
          <p className="text-violet-400 text-sm">
            Answers "what happened, why, what's connected, and what to do next" —
            citing the exact source document for every claim.
          </p>
        </div>
        <div className="bg-[#2a2340] border border-violet-700/40 rounded-2xl p-6">
          <LayoutDashboard className="text-indigo-400 mb-3" size={28} />
          <h3 className="text-violet-100 font-semibold mb-2">Executive Dashboard</h3>
          <p className="text-violet-400 text-sm">
            Plant health score, active risks, and recent incidents — computed live
            from real ingested documents, not guesswork.
          </p>
        </div>
      </div>

      <div className="border-t border-violet-800/40 pt-10">
        <h2 className="text-violet-100 font-semibold mb-4">How it works</h2>
        <div className="flex items-center gap-3 text-violet-300 text-sm flex-wrap">
          <span className="bg-[#2a2340] px-4 py-2 rounded-full">Documents</span>
          <ArrowRight size={16} />
          <span className="bg-[#2a2340] px-4 py-2 rounded-full">Entity Extraction</span>
          <ArrowRight size={16} />
          <span className="bg-[#2a2340] px-4 py-2 rounded-full">Knowledge Graph</span>
          <ArrowRight size={16} />
          <span className="bg-[#2a2340] px-4 py-2 rounded-full">AI Reasoning</span>
          <ArrowRight size={16} />
          <span className="bg-violet-500 text-white px-4 py-2 rounded-full">Answers + Dashboard</span>
        </div>
      </div>
    </div>
  );
}