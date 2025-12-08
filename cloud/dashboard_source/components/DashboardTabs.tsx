"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    ListTodo,
    Server,
    Bot,
    DollarSign,
    Target,
    Globe2,
    TrendingUp,
    Heart,
    Telescope,
    Users,
    Globe,
    Award,
    MessageSquare // For Boardroom if needed
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll define it or use standard class strings

// TAB 0: THE BOARDROOM (New V7)
import { BoardroomTab } from "./BoardroomTab";

// TAB 1: THE NEXUS (Executive HUD)
import { MissionCard } from "./MissionCard";

// TAB 2: DECISION QUEUE (The Workflow)
import { InboxItem } from "./InboxItem";

// TAB 3: THE EDGE (Data Ingestion Department)
import { HardwareTelemetry } from "./HardwareTelemetry";

interface DashboardTabsProps {
    inboxItems: any[];
    onDecision: (id: string, decision: "APPROVED" | "REJECTED") => void;
    requestTask: (taskId: string, type: string, payload: any) => void;
    loadingTask: string | null;
}

export function DashboardTabs({ inboxItems, onDecision, requestTask, loadingTask }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: "BOARDROOM", icon: Users, color: "text-[#3E91FF]" }, // New Tab 0
        { id: 1, label: "THE NEXUS", icon: LayoutDashboard, color: "text-emerald-400" },
        { id: 2, label: "DECISION QUEUE", icon: ListTodo, color: "text-amber-400" },
        { id: 3, label: "THE EDGE", icon: Server, color: "text-blue-400" },
        { id: 4, label: "THE SWARM", icon: Bot, color: "text-purple-400" },
        { id: 5, label: "TREASURY", icon: DollarSign, color: "text-green-400" },
        { id: 6, label: "WATCHTOWER", icon: Target, color: "text-red-400" },
        { id: 7, label: "MACRO STRATEGY", icon: Globe2, color: "text-indigo-400" },
        { id: 8, label: "FINANCIALS", icon: TrendingUp, color: "text-emerald-500" },
        { id: 9, label: "AUDIENCE", icon: Heart, color: "text-pink-400" },
        { id: 10, label: "FORESIGHT", icon: Telescope, color: "text-violet-400" },
        { id: 11, label: "CULTURE", icon: Users, color: "text-cyan-400" },
        { id: 12, label: "GLOBAL RISK", icon: Globe, color: "text-orange-400" },
        { id: 13, label: "VALUE", icon: Award, color: "text-yellow-400" },
    ];

    return (
        <div className="flex flex-col h-full bg-[#000000]">
            {/* Scrollable Tab Navigation */}
            <div className="w-full overflow-x-auto border-b border-white/5 bg-[#000000] sticky top-0 z-20 no-scrollbar">
                <div className="flex items-center min-w-max px-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        // One UI Active State: #3E91FF Text + Bottom Border
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                  relative flex items-center gap-2 px-6 py-5 text-xs font-bold tracking-widest transition-all uppercase
                                  ${isActive ? "text-[#3E91FF]" : "text-[#9FA0A5] hover:text-white"}
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-[#3E91FF]" : "text-[#9FA0A5]"}`} />
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3E91FF] rounded-t-full shadow-[0_-2px_10px_rgba(62,145,255,0.5)]" />
                                )}

                                {/* Badge for Decision Queue */}
                                {tab.id === 2 && inboxItems.length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded-full text-[10px]">
                                        {inboxItems.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative">

                {/* TAB 0: BOARDROOM (New V7) */}
                {activeTab === 0 && (
                    <div className="animate-in fade-in duration-300 h-full">
                        <BoardroomTab />
                    </div>
                )}

                {/* TAB 1: THE NEXUS */}
                {activeTab === 1 && (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* High Level Metrics (Placeholder for now, moving existing widgets here) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-6 bg-[#1C1C1E] rounded-[26px]">
                                <div className="text-[#9FA0A5] text-xs font-bold mb-2 uppercase tracking-wider">Daily Net Profit</div>
                                <div className="text-3xl font-mono text-emerald-400">+$154.20</div>
                            </div>
                            <div className="p-6 bg-[#1C1C1E] rounded-[26px]">
                                <div className="text-[#9FA0A5] text-xs font-bold mb-2 uppercase tracking-wider">System Health</div>
                                <div className="text-3xl font-mono text-[#3E91FF]">98%</div>
                            </div>
                            <div className="p-6 bg-[#1C1C1E] rounded-[26px]">
                                <div className="text-[#9FA0A5] text-xs font-bold mb-2 uppercase tracking-wider">Pending Tasks</div>
                                <div className="text-3xl font-mono text-amber-400">{inboxItems.length}</div>
                            </div>
                            <div className="p-6 bg-[#1C1C1E] rounded-[26px]">
                                <div className="text-[#9FA0A5] text-xs font-bold mb-2 uppercase tracking-wider">Active Agents</div>
                                <div className="text-3xl font-mono text-purple-400">2</div>
                            </div>
                        </div>

                        {/* Existing Mission Cards - Updated to One UI Colors */}
                        <div>
                            <h3 className="text-lg font-bold text-[#FFFFFF] mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5" /> Quick Actions
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MissionCard
                                    title="System Diagnostics"
                                    description="Request Telemetry Update"
                                    icon={Server} // Cpu renamed to Server for consistency if needed, or import Cpu
                                    color="text-emerald-400"
                                    onClick={() => requestTask("sys", "SYSTEM_CHECK", { msg: "Manual Override" })}
                                    loading={loadingTask === "sys"}
                                />
                                <MissionCard
                                    title="Deep Research"
                                    description="Request Market Analysis"
                                    icon={Globe2} // Send renamed to Globa2 roughly or import Send
                                    color="text-[#3E91FF]"
                                    onClick={() => requestTask("res", "RESEARCH", { query: "Manual Research Request" })}
                                    loading={loadingTask === "res"}
                                />
                                {/* Re-using Terminal icon from MissionCard imports if available, otherwise fallback */}
                                <MissionCard
                                    title="Code Mutation"
                                    description="Request Self-Optimizaton"
                                    icon={Bot} // Terminal roughly Bot
                                    color="text-amber-400"
                                    onClick={() => requestTask("code", "CODE_MOD", { target: "logs/manual.log", operation: "write", content: "Manual Entry" })}
                                    loading={loadingTask === "code"}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: DECISION QUEUE */}
                {activeTab === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Decision Inbox</h2>
                            <div className="text-slate-500 font-mono text-sm">
                                {inboxItems.length} PENDING
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {inboxItems.length === 0 ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-xl">
                                    <ListTodo className="w-12 h-12 mb-4 opacity-20" />
                                    <p>No decisions pending authorization.</p>
                                </div>
                            ) : (
                                inboxItems.map(item => (
                                    <InboxItem
                                        key={item.id}
                                        {...item}
                                        type={item.task_type}
                                        payload={JSON.parse(item.payload)}
                                        onAction={onDecision}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: THE EDGE */}
                {activeTab === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <HardwareTelemetry />
                    </div>
                )}

                {/* TAB 4: THE SWARM (Placeholder) */}
                {activeTab === 3 && (
                    <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl animate-in fade-in">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-bold">The Swarm</h3>
                        <p>Agent Status Matrix - Coming Soon</p>
                    </div>
                )}

                {/* ... Other tabs placeholders ... */}
                {activeTab > 3 && (
                    <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl animate-in fade-in">
                        <div className="text-4xl font-bold opacity-10 mb-2">{activeTab}</div>
                        <h3 className="text-lg font-bold">Module Offline</h3>
                        <p>This department is currently under construction.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
