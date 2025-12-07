import { FileText, Search, Activity, Code } from 'lucide-react';

interface PayloadRendererProps {
    type: string;
    payload: any;
}

export function PayloadRenderer({ type, payload }: PayloadRendererProps) {

    if (type === "SYSTEM_CHECK") {
        return (
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Objective</label>
                <div className="text-sm text-slate-200 font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    {payload.msg || "Routine Diagnostics"}
                </div>
            </div>
        );
    }

    if (type === "RESEARCH") {
        return (
            <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Research Topic</label>
                <div className="text-sm text-slate-200 font-medium flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    {payload.query || "No query specified"}
                </div>
            </div>
        );
    }

    if (type === "CODE_MOD") {
        return (
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Target File</label>
                        <div className="text-sm text-slate-200 font-mono flex items-center gap-2 bg-slate-950 p-1 rounded border border-slate-800 mt-1">
                            <FileText className="w-3 h-3 text-amber-500" />
                            {payload.target}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Operation</label>
                        <div className="text-sm text-slate-200 font-mono flex items-center gap-2 bg-slate-950 p-1 rounded border border-slate-800 mt-1">
                            <Code className="w-3 h-3 text-amber-500" />
                            {payload.operation}
                        </div>
                    </div>
                </div>
                {payload.content && (
                    <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Content Preview</label>
                        <div className="text-xs text-slate-400 font-mono bg-black p-2 rounded border border-slate-800/50 mt-1 truncate max-w-full">
                            {payload.content}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Fallback for Unknown Types
    return (
        <pre className="text-xs text-slate-500 font-mono overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
        </pre>
    );
}
