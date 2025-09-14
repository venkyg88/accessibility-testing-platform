'use client';

import { ScanMetrics, IssueSeverity } from '@a11y-scanner/shared';
import { BarChart3, AlertTriangle, CheckCircle, Scan } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: ScanMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const cards = [
    {
      title: 'Total Scans',
      value: metrics.totalScreensScanned,
      icon: Scan,
      color: 'bg-blue-500',
    },
    {
      title: 'Average Score',
      value: `${metrics.averageScore}%`,
      icon: BarChart3,
      color: metrics.averageScore >= 80 ? 'bg-green-500' : metrics.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500',
    },
    {
      title: 'Total Issues',
      value: metrics.totalIssues,
      icon: AlertTriangle,
      color: 'bg-orange-500',
    },
    {
      title: 'Critical Issues',
      value: metrics.issuesBySeverity[IssueSeverity.CRITICAL],
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}