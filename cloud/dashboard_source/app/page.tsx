"use client";

import { useState } from "react";
import { Terminal, Send, Cpu, Activity, Zap } from 'lucide-react';
import { TelemetryBeacon } from "../components/TelemetryBeacon";
import { KillSwitch } from "../components/KillSwitch";
import { MissionCard } from "../components/MissionCard";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const dispatchTask = async (taskId: string, type: string, payload: any) => {
    setLoading(taskId);
    setLastResult(null);
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: payload })
      });
      const data = await res.json();
      if (data.success) {
        // Mock result for now, Phase 7 widget will pull real data later
        setLastResult({ id: data.messageId, status: "DISPATCHED", time: new Date().toLocaleTimeString() });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(null), 1000); // UI feedback delay
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-6 md:p-12 font-sans text-slate-200">

      {/* Header Layer */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
            AUTOMATED CORP <span className="text-emerald-500">//</span> HQ
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SYSTEM VERSION 2.0.1 (YOLO-BUILD)
          </div>
        </div>
        <TelemetryBeacon />
      </header>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Col: Mission Control */}
        <div className="lg:col-span-3 space-y-8">

          {/* North Star Metrics (Day 2 Placeholder Implementation) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Estimated burn</div>
              <div className="text-2xl font-mono text-white">$0.04</div>
            </div>
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Agents Active</div>
              <div className="text-2xl font-mono text-emerald-400">2</div>
            </div>
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Tasks Today</div>
              <div className="text-2xl font-mono text-blue-400">14</div>
            </div>
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Next Briefing</div>
              <div className="text-2xl font-mono text-slate-400">08:00</div>
            </div>
          </div>

          {/* Mission Deck */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> ACTIVE MISSIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MissionCard
                title="System Diagnostics"
                description="Query Akuma Edge Node for CPU, Memory, and Disk telemetry."
                icon={Cpu}
                color="text-emerald-400"
                onClick={() => dispatchTask("sys", "SYSTEM_CHECK", { msg: "Manual Override" })}
                loading={loading === "sys"}
              />

              <MissionCard
                title="Deep Research"
                description="Dispatch Morning Briefing Agent to scan external sources using Playwright."
                icon={Send}
                color="text-blue-400"
                onClick={() => dispatchTask("res", "RESEARCH", { query: "Manual Research Request" })}
                loading={loading === "res"}
              />

              <MissionCard
                title="Code Mutation"
                description="Authorize Akuma to perform self-modification on the local filesystem."
                icon={Terminal}
                color="text-amber-400"
                onClick={() => dispatchTask("code", "CODE_MOD", { target: "logs/manual.log", operation: "write", content: "Manual Entry" })}
                loading={loading === "code"}
              />
            </div>
          </div>

          {/* Terminal Output / Result Preview */}
          {lastResult && (
            <div className="mt-8 p-6 bg-black border border-slate-800 rounded-lg font-mono text-sm text-green-400">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Zap className="w-4 h-4" /> DISPATCH LOG
              </div>
              <pre>{JSON.stringify(lastResult, null, 2)}</pre>
            </div>
          )}

        </div>

        {/* Right Col: Safety & Governance */}
        <div className="space-y-6">
          <KillSwitch />

          <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl">
            <h3 className="text-slate-400 font-bold text-sm mb-4">SWARM TOPOLOGY</h3>
            <div className="flex gap-4 items-center mb-4">
              <div className="w-2 h-16 bg-gradient-to-b from-blue-500/50 to-emerald-500/50 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded">CLOUD HQ (You)</div>
                <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded">AKUMA (Edge)</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-600">
              1 Node Connected. Swarm Expansion Pending.
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
