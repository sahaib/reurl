'use client';

import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { Card } from '../once-ui/components/Card';
import { Button } from '../once-ui/components/Button';
import { UrlShortenerForm } from '@/components/UrlShortenerForm';
import { Toast, useToast } from '@/once-ui/components/Toast';
import { DOMAIN } from '@/config/domain';
import { Logo } from '@/components/Logo';

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);
  const { toast, showToast } = useToast();

  const getShortUrl = (shortId: string) => {
    const baseUrl = DOMAIN.production;
    return `${baseUrl}/${shortId}`;
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!');
  };

  const handleSubmit = async (data: {
    url: string;
    customSlug?: string;
    password?: string;
    expiresAt?: string;
  }) => {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to shorten URL');
    }

    setShortenedUrls([{
      id: responseData.id,
      originalUrl: responseData.original_url,
      shortUrl: responseData.short_url
    }, ...shortenedUrls]);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="flex justify-between items-center mb-12">
          <Logo />
          <div>
            <SignedIn>
              <Button variant="ghost" onClick={() => window.location.href = '/dashboard'}>
                Dashboard
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold">URL Shortener</h1>
          <p className="text-neutral-400 text-lg">
            {isSignedIn 
              ? "Create and manage your shortened URLs"
              : "Sign in to create and manage your shortened URLs"}
          </p>
        </div>

        <SignedIn>
          <div className="mb-12">
            <UrlShortenerForm onSubmit={handleSubmit} />
          </div>

          <div className="space-y-4">
            {shortenedUrls.map((item) => (
              <Card key={item.id}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1 flex-1 min-w-0 mr-4">
                    <p className="text-sm text-neutral-400 truncate">
                      {item.originalUrl}
                    </p>
                    <p className="font-medium text-emerald-400">
                      {getShortUrl(item.shortUrl)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopy(getShortUrl(item.shortUrl))}
                  >
                    Copy
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </SignedIn>

        <SignedOut>
          <div className="text-center">
            <SignInButton mode="modal">
              <Button variant="primary" size="lg">
                Sign in to get started
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>

      {toast && <Toast message={toast.message} />}
    </main>
  );
}
