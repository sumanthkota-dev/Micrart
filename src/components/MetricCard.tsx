// components/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | null;
  loading?: boolean;
}

export default function MetricCard({ icon, title, value, loading }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition cursor-pointer">
      <div>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}
