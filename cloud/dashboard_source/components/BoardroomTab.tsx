"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Users, Disc, Shield, Settings, Activity } from "lucide-react";

// One UI Colors
const THEME = {
    bg: "bg-[#000000]",
    card: "bg-[#1C1C1E]",
    accent: "bg-[#3E91FF]",
    textMain: "text-[#FFFFFF]",
    textSec: "text-[#9FA0A5]",
    radius: "rounded-[26px]",
};

interface Message {
    id: number;
    sender: string;
    text: string;
    type: "user" | "agent" | "system";
    role?: string;
}

export function BoardroomTab() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: "System", text: "Secure Channel Established. Select agents to begin.", type: "system" }
    ]);
    const [input, setInput] = useState("");
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [mode, setMode] = useState<"SOLO" | "GROUP" | "BOARD">("SOLO");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const AGENTS = ["CFO", "CTO", "CMO", "CSO", "CLO", "CRO", "CHRO", "CIO", "CISO", "CDO", "CCO", "COS", "GC", "CAIO", "CEO"];

    const toggleAgent = (agent: string) => {
        if (mode === "SOLO") {
            setSelectedAgents([agent]);
        } else if (mode === "GROUP") {
            if (selectedAgents.includes(agent)) {
                setSelectedAgents(prev => prev.filter(a => a !== agent));
            } else {
                setSelectedAgents(prev => [...prev, agent]);
            }
        }
    };

    const setInteractionMode = (newMode: "SOLO" | "GROUP" | "BOARD") => {
        setMode(newMode);
        if (newMode === "BOARD") setSelectedAgents(AGENTS);
        if (newMode === "SOLO") setSelectedAgents([]); // Reset
        if (newMode === "GROUP") setSelectedAgents([]); // Reset
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Message Construction
        const userMsg: Message = { id: Date.now(), sender: "CEO", text: input, type: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Determine Target
        let target = "COS"; // Fallback
        if (mode === "SOLO" && selectedAgents.length === 1) target = selectedAgents[0];
        if (mode === "GROUP") target = "GROUP"; // Backend needs to handle this, or we send list
        if (mode === "BOARD") target = "BROADCAST";

        try {
            const res = await fetch('/api/boardroom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    target_agent: target,
                    selected_agents: selectedAgents // Pass explicit list for GROUP mode
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Handle V2 Schema: { messages: [...] }
                if (data.messages && Array.isArray(data.messages)) {
                    const newMsgs = data.messages.map((m: any, i: number) => ({
                        id: Date.now() + i + 1,
                        sender: m.sender || "Agent",
                        text: m.text,
                        type: "agent",
                        role: m.role
                    }));
                    setMessages(prev => [...prev, ...newMsgs]);
                }
                // Handle Legacy V1 Schema
                else if (data.text) {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        sender: data.sender || "System",
                        text: data.text,
                        type: "agent"
                    }]);
                }
            } else {
                throw new Error(data.error || "Unknown Error");
            }
        } catch (e: any) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "System",
                text: `Error: ${e.message}`,
                type: "system"
            }]);
        }
    };

    return (
        <div className={`flex h-[calc(100vh-140px)] gap-6 ${THEME.bg} p-6 overflow-hidden max-w-[1920px] mx-auto`}>

            {/* COLUMN 1: SIDEBAR (One UI Card) */}
            <div className={`w-80 flex-shrink-0 flex flex-col ${THEME.card} ${THEME.radius} p-6 border border-white/5`}>
                <h3 className={`text-xs font-bold ${THEME.textSec} uppercase tracking-widest mb-6`}>Summoning Console</h3>

                {/* Mode Selector */}
                <div className="flex bg-black/40 p-1 rounded-xl mb-6">
                    {(["SOLO", "GROUP", "BOARD"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => setInteractionMode(m)}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${mode === m ? "bg-[#3E91FF] text-white" : "text-[#9FA0A5] hover:text-white"}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Agent List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {AGENTS.map((agent) => {
                        const isSelected = selectedAgents.includes(agent);
                        return (
                            <div
                                key={agent}
                                onClick={() => toggleAgent(agent)}
                                className={`
                                    flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border
                                    ${isSelected
                                        ? "bg-[#3E91FF]/20 border-[#3E91FF] shadow-[0_0_15px_rgba(62,145,255,0.2)]"
                                        : "bg-white/5 border-transparent hover:bg-white/10"}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#3E91FF]" : "bg-[#9FA0A5]"}`} />
                                    <span className={`font-bold ${isSelected ? "text-white" : "text-[#9FA0A5]"}`}>{agent}</span>
                                </div>
                                {isSelected && <Activity className="w-3 h-3 text-[#3E91FF] animate-pulse" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* COLUMN 2: CHAT INTERFACE (One UI Card) */}
            <div className={`flex-1 flex flex-col ${THEME.card} ${THEME.radius} border border-white/5 overflow-hidden relative`}>

                {/* Chat Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-transparent">
                    <div>
                        <h2 className={`text-xl font-bold ${THEME.textMain}`}>Executive Session</h2>
                        <p className={`text-xs ${THEME.textSec} flex items-center gap-2 mt-1`}>
                            <Shield className="w-3 h-3" />
                            ENCRYPTED // {selectedAgents.length} Agents Active
                        </p>
                    </div>
                    <div className="flex -space-x-2">
                        {selectedAgents.slice(0, 5).map((a, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-[#3E91FF] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#1C1C1E]">
                                {a.substring(0, 1)}
                            </div>
                        ))}
                        {selectedAgents.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-[10px] text-white border-2 border-[#1C1C1E]">
                                +{selectedAgents.length - 5}
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] group relative`}>
                                {/* Agent Name Label */}
                                {msg.type === "agent" && (
                                    <div className={`text-[10px] font-bold mb-1 ml-4 ${THEME.textSec} uppercase tracking-wider`}>
                                        {msg.sender}
                                    </div>
                                )}

                                <div className={`
                                    p-5 text-sm leading-relaxed
                                    ${msg.type === "user"
                                        ? "bg-[#3E91FF] text-white rounded-[26px] rounded-br-none"
                                        : msg.type === "system"
                                            ? "bg-transparent text-[#9FA0A5] text-xs font-mono text-center w-full border border-dashed border-[#2C2C2E] py-2"
                                            : "bg-[#2C2C2E] text-[#E0E0E0] rounded-[26px] rounded-bl-none shadow-sm"
                                    }
                                `}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-6 pt-0 bg-transparent">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder={`Message ${mode === "BOARD" ? "the Board" : selectedAgents.join(", ") || "select agents"}...`}
                            className={`w-full bg-[#000000] border-none text-white p-5 pr-16 ${THEME.radius} focus:ring-2 focus:ring-[#3E91FF] placeholder-[#505055] transition-all cursor-text`}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="absolute right-2 top-2 p-3 bg-[#3E91FF] text-white rounded-[20px] hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* COLUMN 3: CONTEXT / HISTORY (One UI Card) - Placeholder for now */}
            <div className={`hidden xl:flex w-72 flex-col ${THEME.card} ${THEME.radius} p-6 border border-white/5 opacity-50`}>
                <h3 className={`text-xs font-bold ${THEME.textSec} uppercase tracking-widest mb-4`}>Context Memory</h3>
                <div className="flex-1 flex items-center justify-center text-[#2C2C2E] flex-col text-center">
                    <Disc className="w-12 h-12 mb-2" />
                    <p className="text-xs">History Archive<br />(Coming Soon)</p>
                </div>
            </div>

        </div>
    );
}
