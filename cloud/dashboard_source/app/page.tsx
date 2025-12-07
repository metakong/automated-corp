"use client";

import { useState, useEffect } from "react";
import { Terminal, Send, Cpu, Activity, Inbox as InboxIcon } from 'lucide-react';
import { TelemetryBeacon } from "../components/TelemetryBeacon";
import { KillSwitch } from "../components/KillSwitch";
import { MissionCard } from "../components/MissionCard";
import { InboxItem } from "../components/InboxItem";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [inboxItems, setInboxItems] = useState<any[]>([]);

  // 1. Fetch Inbox (Polling for V1, Realtime Stream V2)
  const fetchInbox = async () => {
    const res = await fetch('/api/inbox');
    const data = await res.json();
    if (data.items) setInboxItems(data.items);
  };

  useEffect(() => {
    fetchInbox();
    const interval = setInterval(fetchInbox, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. Request Task (Creates Pending Item)
  const requestTask = async (taskId: string, type: string, payload: any) => {
    setLoading(taskId);
    try {
      await fetch('/api/inbox', {
        method: 'POST',
        body: JSON.stringify({ action: "CREATE", type, payload })
      });
      fetchInbox(); // Refresh immediately
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  // 3. Approve/Reject Task
  const handleDecision = async (id: string, decision: "APPROVED" | "REJECTED") => {
    await fetch('/api/inbox', {
      method: 'POST',
      body: JSON.stringify({ action: "UPDATE", docId: id, status: decision })
    });
    // Optimistic update
    setInboxItems(prev => prev.filter(item => item.id !== id));
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
            SYSTEM VERSION 3.0.0 (COMMAND CENTER)
          </div>
        </div>
        <TelemetryBeacon />
      </header>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Col: Mission Control & Inbox */}
        <div className="lg:col-span-3 space-y-8">

          {/* North Star Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* ... Kept same metrics for now ... */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">Pending Decisions</div>
              <div className="text-2xl font-mono text-amber-500">{inboxItems.length}</div>
            </div>
            {/* ... others ... */}
          </div>

          {/* THE DECISION INBOX */}
          <div className="bg-slate-900/20 border border-slate-800 rounded-xl overflow-hidden min-h-[300px]">
            <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <InboxIcon className="w-5 h-5 text-amber-500" /> DECISION INBOX
              </h2>
              <div className="text-xs font-mono text-slate-500">
                Waiting for CEO authorization...
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inboxItems.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-600 gap-2">
                  <InboxIcon className="w-8 h-8 opacity-20" />
                  <p className="text-sm">No pending requests.</p>
                </div>
              ) : (
                inboxItems.map(item => (
                  <InboxItem
                    key={item.id}
                    {...item}
                    payload={JSON.parse(item.payload)}
                    onAction={handleDecision}
                  />
                ))
              )}
            </div>
          </div>

          {/* Mission Deck (Standard Requests) */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> REQUEST MISSIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MissionCard
                title="System Diagnostics"
                description="Request Telemetry Update"
                icon={Cpu}
                color="text-emerald-400"
                onClick={() => requestTask("sys", "SYSTEM_CHECK", { msg: "Manual Override" })}
                loading={loading === "sys"}
              />
              <MissionCard
                title="Deep Research"
                description="Request Market Analysis"
                icon={Send}
                color="text-blue-400"
                onClick={() => requestTask("res", "RESEARCH", { query: "Manual Research Request" })}
                loading={loading === "res"}
              />
              <MissionCard
                title="Code Mutation"
                description="Request Self-Optimizaton"
                icon={Terminal}
                color="text-amber-400"
                onClick={() => requestTask("code", "CODE_MOD", { target: "logs/manual.log", operation: "write", content: "Manual Entry" })}
                loading={loading === "code"}
              />
            </div>
          </div>

        </div>

        {/* Right Col: Safety & Governance */}
        <div className="space-y-6">
          <KillSwitch />
          {/* Legacy Swarm Topology ... */}
        </div>

      </div>
    </main>
  );
}
