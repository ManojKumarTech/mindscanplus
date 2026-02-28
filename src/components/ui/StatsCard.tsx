import React from 'react';
import { Card } from './Card';

interface StatsCardProps {
  title: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  icon,
  value,
  subtitle,
  loading,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        {icon && <div className="w-5 h-5 text-gray-500">{icon}</div>}
      </div>
      <p className="text-4xl font-bold text-gray-900 mb-2">
        {loading ? '—' : value}
      </p>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </Card>
  );
};
