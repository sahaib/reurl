'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';

interface AnalyticsSummary {
  totalClicks: number;
  uniqueVisitors: number;
  topCountries: { country: string; visits: number }[];
  topDevices: { device: string; visits: number }[];
  clicksByDay: { date: string; clicks: number }[];
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>({
    totalClicks: 0,
    uniqueVisitors: 0,
    topCountries: [],
    topDevices: [],
    clicksByDay: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'primary' : 'secondary'}
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Total Clicks</h3>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? '...' : analytics.totalClicks}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Unique Visitors</h3>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? '...' : analytics.uniqueVisitors}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Top Country</h3>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? '...' : (analytics.topCountries[0]?.country || 'N/A')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Top Device</h3>
            <p className="mt-2 text-3xl font-semibold">
              {isLoading ? '...' : (analytics.topDevices[0]?.device || 'N/A')}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Countries</h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-neutral-800/50 rounded"></div>
                  ))}
                </div>
              ) : (
                analytics.topCountries.map((country) => (
                  <div key={country.country} className="flex justify-between items-center">
                    <span className="text-neutral-400">{country.country}</span>
                    <span className="font-medium">{country.visits}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Device Types</h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 bg-neutral-800/50 rounded"></div>
                  ))}
                </div>
              ) : (
                analytics.topDevices.map((device) => (
                  <div key={device.device} className="flex justify-between items-center">
                    <span className="text-neutral-400">{device.device}</span>
                    <span className="font-medium">{device.visits}</span>
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