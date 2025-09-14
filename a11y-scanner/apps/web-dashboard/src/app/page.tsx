'use client';

import { useEffect, useState } from 'react';
import { ScanMetrics } from '@a11y-scanner/shared';
import { api } from '@/lib/api';
import { MetricsOverview } from '@/components/MetricsOverview';
import { TrendsChart } from '@/components/TrendsChart';
import { RecentScans } from '@/components/RecentScans';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<ScanMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await api.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of accessibility scanning metrics and trends
        </p>
      </div>

      {metrics && (
        <>
          <MetricsOverview metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TrendsChart trends={metrics.trendsOverTime} />
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Issues by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(metrics.issuesByCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <RecentScans />
        </>
      )}
    </div>
  );
}