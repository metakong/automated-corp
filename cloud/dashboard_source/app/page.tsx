"use client";

import { useState } from 'react';
import { Terminal, Send, Activity, Shield, Cpu } from 'lucide-react';

export default function Home() {
  const [status, setStatus] = useState<string>("Ready");
  const [lastId, setLastId] = useState<string | null>(null);

  const dispatchTask = async (type: string, payload: any) => {
    setStatus("Dispatching...");
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: payload })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`Sent: ${data.messageId}`);
        setLastId(data.messageId);
      } else {
        setStatus("Failed");
      }
    } catch (e) {
      console.error(e);
      setStatus("Error");
    }
  };

  return (
    <main className="min-h-screen p-8 font-sans">
      {/* Header */}
      <header className="mb-12 border-b border-slate-800 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AUTOMATED CORP <span className="text-emerald-500">//</span> CLOUD HQ
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Activity className="w-4 h-4" />
          <span>SYSTEM ONLINE</span>
        </div>
      </header>

      {/* Status Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="text-slate-400 text-sm mb-2">OPERATIONAL STATUS</h2>
          <div className="text-2xl font-bold text-emerald-400">{status}</div>
          {lastId && <div className="text-xs text-slate-500 mt-2 font-mono">ID: {lastId}</div>}
        </div>
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="text-slate-400 text-sm mb-2">CONNECTED AGENTS</h2>
          <div className="text-2xl font-bold text-white">1</div>
          <div className="text-xs text-slate-500 mt-2">AKUMA (EDGE) via Pub/Sub</div>
        </div>
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800">
          <h2 className="text-slate-400 text-sm mb-2">SECURITY LEVEL</h2>
          <div className="text-2xl font-bold text-amber-500">IRON DOME</div>
          <div className="text-xs text-slate-500 mt-2">Authenticated Only</div>
        </div>
      </div>

      {/* Dispatch Console */}
      <div className="border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-white">DISPATCH CONSOLE</h3>
        </div>

        <div className="p-6 bg-slate-950 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => dispatchTask("SYSTEM_CHECK", { msg: "Ping" })}
            className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded flex flex-col items-center gap-3 transition-all group"
          >
            <Cpu className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
            <span className="text-sm font-medium">System Check</span>
          </button>

          <button
            onClick={() => dispatchTask("RESEARCH", { topic: "Latest AI Trends" })}
            className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded flex flex-col items-center gap-3 transition-all group"
          >
            <Send className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
            <span className="text-sm font-medium">Dispatch Research</span>
          </button>

          <button
            onClick={() => dispatchTask("CODE_MOD", { target: "self", operation: "optimize" })}
            className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded flex flex-col items-center gap-3 transition-all group"
          >
            <Terminal className="w-6 h-6 text-slate-400 group-hover:text-purple-400" />
            <span className="text-sm font-medium">Code Modification</span>
          </button>
        </div>
      </div>
    </main>
  );
}
