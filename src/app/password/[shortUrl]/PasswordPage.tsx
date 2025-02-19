'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/once-ui/components/Card';
import { Input } from '@/once-ui/components/Input';
import { Button } from '@/once-ui/components/Button';
import { DOMAIN } from '@/config/domain';

interface Props {
  shortUrl: string;
}

export default function PasswordPage({ shortUrl }: Props) {
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get('error') === 'incorrect' ? 'Incorrect password' : '');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    // Redirect to the short URL with the password
    const baseUrl = DOMAIN.production;
    const url = new URL(`${baseUrl}/${shortUrl}`);
    url.searchParams.set('password', password);
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Password Protected URL</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              label="Enter Password"
              placeholder="Enter the URL password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
} 