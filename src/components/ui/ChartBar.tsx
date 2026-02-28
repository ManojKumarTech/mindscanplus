import React from 'react';

interface ChartBarProps {
  height: number;
  label?: string;
}

export const ChartBar: React.FC<ChartBarProps> = ({ height, label }) => (
  <div className="flex-1 flex flex-col items-center gap-2">
    <div className="w-full flex flex-col items-center">
      <div
        className="w-full rounded-t-lg bg-gradient-to-t from-mint-500 to-sky-500 transition-all duration-300 hover:shadow-soft"
        style={{ height: `${height}px` }}
      ></div>
    </div>
    {label && <p className="text-xs text-gray-600 font-medium">{label}</p>}
  </div>
);
