"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, HardDrive, Wifi, Activity } from "lucide-react";
// Imports removed as we are using the /api/telemetry route

// For V5 we will fetch from an API route to keep secrets server-side if needed, 
// or use direct firestore if we have public config. 
// For now, let's use the /api/telemetry route we will create.

export function HardwareTelemetry() {
    const [data, setData] = useState<any[]>([]);
    const [latest, setLatest] = useState<any>(null);

    useEffect(() => {
        // Poll for real data
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/telemetry'); // We need to create this
                const json = await res.json();
                if (json.stats) {
                    setLatest(json.stats);
                    setData(prev => {
                        const newData = [...prev, { ...json.stats, time: new Date().toLocaleTimeString() }];
                        return newData.slice(-20); // Keep last 20 points
                    });
                }
            } catch (e) {
                console.error("Telemetry Fetch Error", e);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000); // 2s polling
        return () => clearInterval(interval);
    }, []);

    if (!latest) return (
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center h-64 text-slate-500 animate-pulse">
            <Activity className="w-6 h-6 mr-2" /> Connecting to Akuma Neural Link...
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CPU GRAPH */}
            <div className="p-6 bg-slate-950/50 border border-slate-800/80 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/10 rounded">
                            <Cpu className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">CPU Load</div>
                            <div className="text-2xl font-mono text-white">{latest.cpu_usage}%</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Core Temp</div>
                        {/* Placeholder for temp if we add it later */}
                        <div className="text-sm font-mono text-emerald-400">42°C</div>
                    </div>
                </div>

                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area type="monotone" dataKey="cpu_usage" stroke="#10b981" fillOpacity={1} fill="url(#colorCpu)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* MEMORY GRAPH */}
            <div className="p-6 bg-slate-950/50 border border-slate-800/80 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded">
                            <HardDrive className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Memory</div>
                            <div className="text-2xl font-mono text-white">{latest.ram_usage}%</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Used</div>
                        <div className="text-sm font-mono text-blue-400">{latest.ram_used_gb} GB</div>
                    </div>
                </div>

                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Area type="monotone" dataKey="ram_usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRam)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
