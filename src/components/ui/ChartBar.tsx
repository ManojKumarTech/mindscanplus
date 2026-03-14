import React from 'react';

interface ChartBarProps {
  height: number;
  label?: string;
  /** Tailwind bg class for the bar color, e.g. 'bg-emerald-400'. Defaults to mint-sky gradient. */
  colorClass?: string;
  /** Raw stress score (1–5) shown on hover */
  score?: number;
}

export const ChartBar: React.FC<ChartBarProps> = ({ height, label, colorClass, score }) => (
  <div className="flex-1 flex flex-col items-center gap-2 group relative">
    <div className="w-full flex flex-col items-center">
      <div
        className={`w-full rounded-t-lg transition-all duration-300 hover:shadow-soft ${colorClass ?? 'bg-gradient-to-t from-mint-500 to-sky-500'}`}
        style={{ height: `${height}px` }}
      ></div>
    </div>
    {score !== undefined && (
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
        {score.toFixed(1)}/5
      </div>
    )}
    {label && <p className="text-xs text-gray-600 font-medium">{label}</p>}
  </div>
);
