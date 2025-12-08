"use client";

import { useState } from "react";
import { X, Send, Users, Bot } from "lucide-react";

interface ExecutiveBoardroomProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExecutiveBoardroom({ isOpen, onClose }: ExecutiveBoardroomProps) {
    const [messages, setMessages] = useState<any[]>([
        { id: 1, sender: "System", text: "Executive Session Initialized. 17 Agents on standby.", type: "system" }
    ]);
    const [input, setInput] = useState("");

    if (!isOpen) return null;

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: "CEO", text: input, type: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        try {
            const res = await fetch('/api/boardroom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text, target_agent: "COS" }) // Default to COS for now
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: data.sender || "System",
                    text: data.text,
                    type: "agent"
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: "System",
                    text: `Error: ${data.error}`,
                    type: "system"
                }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "System",
                text: "Communication Failure: Network Error",
                type: "system"
            }]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex justify-center items-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-6xl h-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Executive Boardroom</h2>
                            <p className="text-xs text-slate-500 font-mono">SECURE CHANNEL // ENCRYPTED</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Main Content: Chat + Agent Grid */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left: Agent Roster */}
                    <div className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:flex flex-col gap-2 overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Executives</h3>
                        {["CFO", "CTO", "CMO", "CSO", "CLO", "CRO", "CHRO", "CIO"].map((role, i) => (
                            <div key={role} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group">
                                <div className={`w-2 h-2 rounded-full ${i < 3 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                                <div>
                                    <div className="text-sm font-bold text-slate-300 group-hover:text-white">{role}</div>
                                    <div className="text-[10px] text-slate-500">Idle</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center: Chat Interface */}
                    <div className="flex-1 flex flex-col bg-slate-950">
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] p-4 rounded-xl ${msg.type === "user"
                                        ? "bg-emerald-600 text-white rounded-br-none"
                                        : msg.type === "system"
                                            ? "bg-slate-800/50 text-slate-400 text-xs font-mono w-full text-center border border-slate-800"
                                            : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                                        }`}>
                                        {msg.type === "agent" && (
                                            <div className="text-xs font-bold text-emerald-400 mb-1">{msg.sender}</div>
                                        )}
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Issue a command to the board..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 pr-12 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="absolute right-2 top-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
