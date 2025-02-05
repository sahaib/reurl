'use client';

import { Button } from '@/once-ui/components/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-emerald-500">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Link Not Found</h2>
          <p className="text-neutral-400">
            This link may have expired or never existed.
          </p>
        </div>
        <Button onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    </div>
  );
} 