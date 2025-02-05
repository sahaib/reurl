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
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'custom-urls',
      title: 'Custom URLs',
      description: 'Create memorable links with your own custom slugs',
      example: 'reurl.dev/my-brand',
      tip: 'Great for branding and marketing campaigns'
    },
    {
      id: 'password-protection',
      title: 'Password Protection',
      description: 'Secure your links with password protection',
      example: 'Only authorized users can access your links',
      tip: 'Perfect for sharing sensitive content'
    },
    {
      id: 'expiry-dates',
      title: 'Expiry Dates',
      description: 'Set expiration dates for temporary links',
      example: 'Links automatically expire when you want',
      tip: 'Ideal for time-sensitive promotions'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Track clicks, locations, and devices',
      example: 'Get insights about your audience',
      tip: 'Make data-driven decisions'
    }
  ];

  const usageTips = [
    {
      icon: '🎯',
      title: 'Marketing',
      tips: [
        'Use custom URLs for brand recognition',
        'Track campaign performance with analytics',
        'Set expiry dates for promotional offers'
      ]
    },
    {
      icon: '🔒',
      title: 'Security',
      tips: [
        'Password protect sensitive links',
        'Monitor access with detailed analytics',
        'Temporary links for limited-time access'
      ]
    },
    {
      icon: '📊',
      title: 'Analytics',
      tips: [
        'Track visitor locations and devices',
        'Monitor peak usage times',
        'Analyze click patterns'
      ]
    }
  ];

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!');
  };

  const getShortUrl = (shortId: string) => {
    const baseUrl = DOMAIN.production;
    return `${baseUrl}/${shortId}`;
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="w-[200px] flex-shrink-0">
              <Logo />
            </div>

            <div className="w-[200px] flex-shrink-0 flex justify-end">
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
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold">URL Shortener</h1>
          <p className="text-neutral-400 text-lg">
            {isSignedIn 
              ? "Create and manage your shortened URLs"
              : "Create short, memorable links in seconds"}
          </p>
        </div>

        <SignedIn>
          <div className="mb-12">
            <UrlShortenerForm onSubmit={async (data) => {
              const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              
              if (!response.ok) {
                throw new Error('Failed to shorten URL');
              }

              const responseData = await response.json();
              setShortenedUrls([{
                id: responseData.id,
                originalUrl: responseData.original_url,
                shortUrl: responseData.short_url
              }, ...shortenedUrls]);
            }} />
          </div>

          <div className="space-y-4">
            {shortenedUrls.map((item) => (
              <Card key={item.id}>
                <div className="flex justify-between items-center p-6">
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
          <div className="text-center mb-12">
            <SignInButton mode="modal">
              <Button variant="primary" size="lg">
                Sign in to get started
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* Features Section */}
        <section className="mt-24 space-y-12">
          <h2 className="text-3xl font-bold text-center">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-neutral-400">{feature.description}</p>
                  {activeFeature === feature.id && (
                    <div className="mt-4 p-4 bg-neutral-800/50 rounded-lg">
                      <p className="text-sm text-emerald-400 mb-2">{feature.example}</p>
                      <p className="text-sm text-neutral-400">{feature.tip}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Usage Tips Section */}
        <section className="mt-24 space-y-12">
          <h2 className="text-3xl font-bold text-center">Usage Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usageTips.map((section) => (
              <Card key={section.title}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="text-xl font-semibold">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.tips.map((tip, index) => (
                      <li key={index} className="text-neutral-400 text-sm flex items-start gap-2">
                        <span className="text-emerald-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-24 text-center">
          <Card>
            <div className="p-12 space-y-6">
              <h2 className="text-3xl font-bold">Ready to get started?</h2>
              <p className="text-neutral-400">
                Join thousands of users who trust our URL shortener for their link management needs.
              </p>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="primary" size="lg">
                    Create your first link
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Shorten a URL
                </Button>
              </SignedIn>
            </div>
          </Card>
        </section>
      </main>

      {toast && <Toast message={toast.message} />}
    </div>
  );
}
