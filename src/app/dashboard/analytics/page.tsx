'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';

interface AnalyticsSummary {
  totalClicks: number;
  uniqueVisitors: number;
  topCountries: Array<{ country: string; visits: number }>;
  topDevices: Array<{ device: string; visits: number }>;
  clicksByDay: Array<{ date: string; clicks: number }>;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalClicks: 0,
    uniqueVisitors: 0,
    topCountries: [],
    topDevices: [],
    clicksByDay: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/analytics?range=${dateRange}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Overview</h1>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <div key={range} className="w-24 h-10 bg-neutral-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6 h-32 animate-pulse bg-neutral-800/50" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <div className="p-6 h-64 animate-pulse bg-neutral-800/50" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <div className="flex gap-2">
          {[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: '90 Days', value: '90d' }
          ].map((range) => (
            <Button
              key={range.value}
              variant={dateRange === range.value ? 'primary' : 'ghost'}
              onClick={() => setDateRange(range.value as '7d' | '30d' | '90d')}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Total Clicks</h3>
            <p className="mt-2 text-3xl font-semibold">
              {formatNumber(analytics.totalClicks)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Unique Visitors</h3>
            <p className="mt-2 text-3xl font-semibold">
              {formatNumber(analytics.uniqueVisitors)}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Top Country</h3>
            <p className="mt-2 text-3xl font-semibold">
              {analytics.topCountries[0]?.country || 'N/A'}
            </p>
            {analytics.topCountries[0] && (
              <p className="text-sm text-neutral-400 mt-1">
                {formatNumber(analytics.topCountries[0].visits)} visits
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Top Device</h3>
            <p className="mt-2 text-3xl font-semibold">
              {analytics.topDevices[0]?.device || 'N/A'}
            </p>
            {analytics.topDevices[0] && (
              <p className="text-sm text-neutral-400 mt-1">
                {formatNumber(analytics.topDevices[0].visits)} visits
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Countries</h3>
            <div className="space-y-4">
              {analytics.topCountries.length === 0 ? (
                <p className="text-neutral-400">No data available</p>
              ) : (
                analytics.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center gap-4">
                    <div className="w-8 text-neutral-400">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{country.country}</span>
                        <span className="text-neutral-400">{formatNumber(country.visits)} visits</span>
                      </div>
                      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${(country.visits / analytics.topCountries[0].visits) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Device Types</h3>
            <div className="space-y-4">
              {analytics.topDevices.length === 0 ? (
                <p className="text-neutral-400">No data available</p>
              ) : (
                analytics.topDevices.map((device, index) => (
                  <div key={device.device} className="flex items-center gap-4">
                    <div className="w-8 text-neutral-400">{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{device.device}</span>
                        <span className="text-neutral-400">{formatNumber(device.visits)} visits</span>
                      </div>
                      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${(device.visits / analytics.topDevices[0].visits) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 