import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface ScoreGaugeProps {
  score: string | number;
  category?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, category }) => {
  const numericScore = typeof score === 'number' ? score : parseInt(String(score).replace(/[^0-9]/g, ''), 10);
  const isValidScore = !isNaN(numericScore) && numericScore >= 300 && numericScore <= 900;

  // Percentage from 300 to 900
  const percentage = isValidScore ? Math.min(100, Math.max(0, ((numericScore - 300) / 600) * 100)) : 0;

  // Determine tier
  let tierColor = 'text-gray-600 bg-gray-100 border-gray-200';
  let tierLabel = category || 'No Score / NA';
  let Icon = ShieldCheck;
  let trackGradient = 'from-emerald-500 to-green-600';

  if (isValidScore) {
    if (numericScore >= 750) {
      tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      tierLabel = 'Excellent (750 - 900)';
      Icon = CheckCircle2;
      trackGradient = 'from-emerald-400 via-teal-500 to-emerald-600';
    } else if (numericScore >= 700) {
      tierColor = 'text-blue-700 bg-blue-50 border-blue-200';
      tierLabel = 'Good (700 - 749)';
      Icon = ShieldCheck;
      trackGradient = 'from-blue-400 to-indigo-600';
    } else if (numericScore >= 650) {
      tierColor = 'text-amber-700 bg-amber-50 border-amber-200';
      tierLabel = 'Fair / Average (650 - 699)';
      Icon = AlertTriangle;
      trackGradient = 'from-amber-400 to-amber-600';
    } else {
      tierColor = 'text-red-700 bg-red-50 border-red-200';
      tierLabel = 'Poor / High Risk (< 650)';
      Icon = AlertOctagon;
      trackGradient = 'from-red-500 to-rose-600';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">TransUnion CIBIL</span>
          <h3 className="text-sm font-bold text-slate-800">Credit Score Rating</h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${tierColor}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{tierLabel}</span>
        </div>
      </div>

      <div className="my-4 flex items-baseline justify-center gap-2">
        <span className="text-5xl font-black tracking-tight text-slate-900 font-mono">
          {isValidScore ? numericScore : score || 'N/A'}
        </span>
        <span className="text-sm font-semibold text-slate-400">/ 900</span>
      </div>

      {/* Score Track Gauge */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 relative flex">
          <div className="w-[33%] h-full bg-red-400/80 rounded-l-full" title="300-599: Poor"></div>
          <div className="w-[20%] h-full bg-amber-400/80" title="600-699: Fair"></div>
          <div className="w-[17%] h-full bg-blue-400/80" title="700-749: Good"></div>
          <div className="w-[30%] h-full bg-emerald-500/90 rounded-r-full" title="750-900: Excellent"></div>
          {isValidScore && (
            <div
              className="absolute top-0 bottom-0 w-2.5 bg-slate-950 border-2 border-white rounded-full shadow-md -translate-x-1/2 transition-all duration-700"
              style={{ left: `${percentage}%` }}
              title={`CIBIL Score: ${numericScore}`}
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-400">
          <span>300 (Poor)</span>
          <span>650</span>
          <span>750</span>
          <span>900 (Excellent)</span>
        </div>
      </div>
    </div>
  );
};
