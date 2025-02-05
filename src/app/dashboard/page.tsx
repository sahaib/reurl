'use client';

import { useAuth } from "@clerk/nextjs";
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';

export default function Dashboard() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Quick Stats</h2>
            <div className="space-y-4">
              <p className="text-neutral-400">Coming soon...</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}