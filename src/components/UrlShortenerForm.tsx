import { useState } from 'react';
import { Input } from '@/once-ui/components/Input';
import { Button } from '@/once-ui/components/Button';
import { Card } from '@/once-ui/components/Card';

interface UrlShortenerFormProps {
  onSubmit: (data: {
    url: string;
    customSlug?: string;
    password?: string;
    expiresAt?: string;
  }) => Promise<void>;
}

export function UrlShortenerForm({ onSubmit }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let formattedUrl = url.trim();
    if (!formattedUrl) {
      setError('Please enter a URL');
      return;
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        url: formattedUrl,
        customSlug: customSlug || undefined,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
      });
      
      // Reset form on success
      setUrl('');
      setCustomSlug('');
      setPassword('');
      setExpiresAt('');
      setShowAdvanced(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={error}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-[128px] min-w-[128px] flex items-center justify-center"
        >
          <span className="whitespace-nowrap">
            {isLoading ? 'Shortening...' : 'Shorten'}
          </span>
        </Button>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="whitespace-nowrap"
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </Button>
      </div>

      {showAdvanced && (
        <Card>
          <div className="space-y-4">
            <div>
              <Input
                label="Custom Slug (optional)"
                placeholder="e.g., my-custom-url"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
              />
              <p className="mt-1 text-sm text-neutral-400">
                Leave empty for auto-generated slug
              </p>
            </div>

            <div>
              <Input
                label="Password Protection (optional)"
                type="password"
                placeholder="Enter password to protect the URL"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Expiration Date (optional)"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}
    </form>
  );
} 