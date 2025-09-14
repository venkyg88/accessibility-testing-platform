'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScanResult, getScoreColor } from '@a11y-scanner/shared';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { ExternalLink, Smartphone, Globe, Monitor } from 'lucide-react';

export function RecentScans() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentScans = async () => {
      try {
        const data = await api.getScanResults({ limit: 10 });
        setScans(data.results);
      } catch (error) {
        console.error('Failed to fetch recent scans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScans();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return Smartphone;
      case 'web':
        return Globe;
      default:
        return Monitor;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
        <Link 
          href="/scans"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {scans.map((scan) => {
          const PlatformIcon = getPlatformIcon(scan.platform);
          const scoreColor = getScoreColor(scan.score?.overall || 0);
          
          return (
            <div key={scan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <PlatformIcon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {scan.appName} - {scan.screenName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(scan.createdAt)} • {scan.platform} • {scan.scanType}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: scoreColor }}
                  >
                    {scan.score?.overall || 0}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {scan.issues?.length || 0} issues
                  </div>
                </div>
                <Link 
                  href={`/scans/${scan.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      
      {scans.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No scans found</p>
        </div>
      )}
    </div>
  );
}