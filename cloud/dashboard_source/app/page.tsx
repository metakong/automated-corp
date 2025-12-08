"use client";

import { useState, useEffect } from "react";
import { Inbox as InboxIcon, Users } from 'lucide-react';
import { TelemetryBeacon } from "../components/TelemetryBeacon";
import { KillSwitch } from "../components/KillSwitch";
import { FinancialTicker } from "../components/FinancialTicker";
import { DashboardTabs } from "../components/DashboardTabs";
import { ExecutiveBoardroom } from "../components/ExecutiveBoardroom";

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const [isBoardroomOpen, setIsBoardroomOpen] = useState(false);

  // 1. Fetch Inbox (Polling for V1, Realtime Stream V2)
  const fetchInbox = async () => {
    try {
      const res = await fetch('/api/inbox');
      const data = await res.json();
      if (data.items) setInboxItems(data.items);
    } catch (e) {
      console.error("Failed to fetch inbox", e);
    }
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 font-sans text-slate-200 flex flex-col">

      {/* FINANCIAL COMMAND TICKER */}
      <FinancialTicker />

      {/* Header Layer */}
      <header className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 md:relative z-30">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              AUTOMATED CORP <span className="text-emerald-500">//</span> HQ
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Version 6.0.0 (Unified Panopticon)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsBoardroomOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Users className="w-4 h-4" />
            Summon Board
          </button>
          <div className="h-8 w-px bg-slate-800 mx-2" />
          <TelemetryBeacon />
          <div className="h-8 w-px bg-slate-800 mx-2" />
          <KillSwitch />
        </div>
      </header>

      {/* Main Content Area - Tabs */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <DashboardTabs
          inboxItems={inboxItems}
          onDecision={handleDecision}
          requestTask={requestTask}
          loadingTask={loading}
        />
      </main>

      {/* Executive Boardroom Overlay */}
      <ExecutiveBoardroom isOpen={isBoardroomOpen} onClose={() => setIsBoardroomOpen(false)} />
    </div>
  );
}
