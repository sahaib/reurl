'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';
import { Toast, useToast } from '@/once-ui/components/Toast';
import { DOMAIN } from '@/config/domain';

interface Link {
  id: string;
  original_url: string;
  short_url: string;
  created_at: string;
  clicks: number;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast } = useToast();

  const fetchLinks = useCallback(async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
      showToast('Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      setLinks(links.filter(link => link.id !== id));
      showToast('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      showToast('Failed to delete link');
    }
  };

  const getShortUrl = (shortId: string) => {
    const baseUrl = DOMAIN.production;
    return `${baseUrl}/${shortId}`;
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="h-24 bg-neutral-800/50"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <Button onClick={() => window.location.href = '/'}>
          Create New Link
        </Button>
      </div>

      <div className="space-y-4">
        {links.length === 0 ? (
          <Card>
            <div className="p-6 text-center">
              <p className="text-neutral-400">No links yet. Create your first shortened URL!</p>
            </div>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id}>
              <div className="p-6 space-y-4">
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
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(getShortUrl(link.short_url))}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {toast && <Toast message={toast.message} />}
    </div>
  );
} 