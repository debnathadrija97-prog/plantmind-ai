"use client";
import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api";
import { HeartPulse, AlertTriangle, ShieldAlert, Wrench, FileWarning, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-violet-100">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-violet-100">Operations Dashboard</h1>
        <p className="text-violet-400 mt-1">Live intelligence from {data.total_documents_indexed} indexed documents</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-gradient-to-br from-violet-900/40 to-[#2a2340] border border-violet-500/40 rounded-2xl p-6 relative overflow-hidden">
          <HeartPulse className="absolute -right-2 -top-2 text-violet-500/20" size={80} />
          <p className="text-sm text-violet-300 mb-1">Plant Health Score</p>
          <p className="text-4xl font-bold text-violet-300">{data.plant_health_score}%</p>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-900/40 to-[#2a2340] border border-fuchsia-500/40 rounded-2xl p-6 relative overflow-hidden">
          <AlertTriangle className="absolute -right-2 -top-2 text-fuchsia-500/20" size={80} />
          <p className="text-sm text-fuchsia-300 mb-1">Active Risks</p>
          <p className="text-4xl font-bold text-fuchsia-400">{data.active_risks.length}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-900/40 to-[#2a2340] border border-indigo-500/40 rounded-2xl p-6 relative overflow-hidden">
          <ShieldAlert className="absolute -right-2 -top-2 text-indigo-500/20" size={80} />
          <p className="text-sm text-indigo-300 mb-1">Compliance Alerts</p>
          <p className="text-4xl font-bold text-indigo-300">{data.compliance_alerts}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 text-violet-100 flex items-center gap-2">
        <Wrench size={18} className="text-violet-400" /> Equipment at Risk
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {data.active_risks.map((eq) => (
          <div key={eq} className="bg-[#2a2340] border border-violet-700/40 rounded-xl p-4 flex items-center justify-between hover:border-violet-500 transition">
            <span className="text-violet-100 font-medium">{eq}</span>
            <span className="text-xs bg-fuchsia-500/20 text-fuchsia-300 px-2 py-1 rounded-full">Flagged</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3 text-violet-100 flex items-center gap-2">
        <FileWarning size={18} className="text-violet-400" /> Recent Incidents
      </h2>
      <div className="space-y-2 mb-10">
        {data.recent_incidents.map((inc) => (
          <div key={inc.filename} className="bg-[#2a2340] border border-violet-700/40 rounded-xl p-4 flex justify-between items-center">
            <span className="text-violet-200 text-sm">{inc.filename}</span>
            <span className="text-violet-500 text-xs">{inc.uploaded_at.split(".")[0]}</span>
          </div>
        ))}
      </div>

      <a href="/copilot" className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-6 py-3 rounded-xl transition">
        Ask the Copilot <ArrowRight size={16} />
      </a>
    </div>
  );
}