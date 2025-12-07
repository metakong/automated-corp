import { LucideIcon, ArrowRight } from "lucide-react";

interface MissionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    onClick: () => void;
    loading?: boolean;
}

export function MissionCard({ title, description, icon: Icon, color, onClick, loading }: MissionCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="group relative flex flex-col items-start p-6 bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl transition-all hover:bg-slate-900 text-left disabled:opacity-50"
        >
            <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800 mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>

            <h3 className="text-lg font-bold text-slate-200 mb-1 group-hover:text-white">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>

            <div className="mt-auto flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-slate-400 uppercase tracking-wider">
                Execute Mission <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className={`absolute inset-0 rounded-xl border-2 border-transparent ${loading ? "border-emerald-500/20 animate-pulse bg-emerald-500/5" : "group-hover:border-slate-700/50"}`} />
        </button>
    );
}
