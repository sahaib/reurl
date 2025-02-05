'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';
import { DOMAIN } from '@/config/domain';

interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  topPerformingLink: {
    shortUrl: string;
    clicks: number;
  } | null;
}

interface RecentLink {
  id: string;
  original_url: string;
  short_url: string;
  created_at: string;
  clicks: number;
}

export default function Dashboard() {
  const { isLoaded } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    topPerformingLink: null
  });
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);

        // Fetch recent links
        const linksResponse = await fetch('/api/links?limit=5');
        const linksData = await linksResponse.json();
        setRecentLinks(linksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchDashboardData();
    }
  }, [isLoaded]);

  const getShortUrl = (shortId: string) => {
    const baseUrl = DOMAIN.production;
    return `${baseUrl}/${shortId}`;
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="animate-pulse space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-neutral-800/50 rounded-lg"></div>
            ))}
          </div>
          {/* Recent Links */}
          <div className="h-64 bg-neutral-800/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button onClick={() => window.location.href = '/'}>
          Create New Link
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Total Links</h3>
            <p className="mt-2 text-3xl font-semibold">{stats.totalLinks}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Total Clicks</h3>
            <p className="mt-2 text-3xl font-semibold">{stats.totalClicks}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Active Links</h3>
            <p className="mt-2 text-3xl font-semibold">{stats.activeLinks}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-medium text-neutral-400">Top Performing Link</h3>
            {stats.topPerformingLink ? (
              <div className="mt-2">
                <p className="text-3xl font-semibold">{stats.topPerformingLink.clicks}</p>
                <p className="text-sm text-emerald-400 truncate mt-1">
                  {getShortUrl(stats.topPerformingLink.shortUrl)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">No links yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Links */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Recent Links</h2>
          <Button variant="ghost" onClick={() => window.location.href = '/dashboard/links'}>
            View All Links
          </Button>
        </div>

        <div className="space-y-4">
          {recentLinks.length === 0 ? (
            <Card>
              <div className="p-6 text-center">
                <p className="text-neutral-400">No links created yet. Create your first shortened URL!</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => window.location.href = '/'}
                >
                  Create New Link
                </Button>
              </div>
            </Card>
          ) : (
            recentLinks.map((link) => (
              <Card key={link.id}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1 min-w-0 mr-4">
                      <p className="text-sm text-neutral-400 truncate">
                        {link.original_url}
                      </p>
                      <p className="font-medium text-emerald-400">
                        {getShortUrl(link.short_url)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-400">
                        <span>{new Date(link.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{link.clicks} clicks</span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(getShortUrl(link.short_url))}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}