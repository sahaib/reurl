import { useState } from 'react';
import { Input } from '@/once-ui/components/Input';
import { Button } from '@/once-ui/components/Button';
import { Card } from '@/once-ui/components/Card';
import { DOMAIN } from '@/config/domain';

interface UrlShortenerFormProps {
  onSubmit: (data: {
    url: string;
    customSlug?: string;
    password?: string;
    expiresAt?: string;
  }) => Promise<void>;
}

interface CreatedLink {
  id: string;
  short_url: string;
  original_url: string;
  password?: string;
}

export function UrlShortenerForm({ onSubmit }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreatedLink(null);

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
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedUrl,
          customSlug: customSlug || undefined,
          password: password || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to shorten URL');
      }

      const link = await response.json();
      setCreatedLink({
        ...link,
        password: password || undefined
      });
      
      // Reset form
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

  const getShortUrl = (shortUrl: string) => {
    const baseUrl = DOMAIN.production;
    return `${baseUrl}/${shortUrl}`;
  };

  return (
    <div className="space-y-6">
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

      {createdLink && (
        <Card>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">URL Shortened Successfully!</h3>
              <p className="text-sm text-neutral-400 break-all">{createdLink.original_url}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-emerald-400 break-all">
                  {getShortUrl(createdLink.short_url)}
                </p>
                {createdLink.password && (
                  <p className="text-sm text-neutral-400 mt-1">
                    This URL is password protected. Users will need to enter the password to access it.
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => navigator.clipboard.writeText(getShortUrl(createdLink.short_url))}
              >
                Copy
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 