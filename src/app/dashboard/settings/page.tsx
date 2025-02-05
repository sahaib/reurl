'use client';

import { useState } from 'react';
import { Card } from '@/once-ui/components/Card';
import { Button } from '@/once-ui/components/Button';
import { Input } from '@/once-ui/components/Input';

export default function SettingsPage() {
  const [defaultDomain, setDefaultDomain] = useState('reurl.dev');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultDomain,
          webhookUrl,
        }),
      });
      if (!response.ok) throw new Error('Failed to save settings');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateApiKey = async () => {
    try {
      const response = await fetch('/api/settings/api-key', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to regenerate API key');
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      console.error('Error regenerating API key:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <form onSubmit={saveSettings} className="space-y-6">
        <Card>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Domain
                  </label>
                  <Input
                    type="text"
                    value={defaultDomain}
                    readOnly
                    className="font-mono"
                  />
                  <p className="mt-1 text-sm text-neutral-400">
                    Your URL shortener domain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">API Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    API Key
                  </label>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      value={apiKey}
                      readOnly
                      className="flex-1 font-mono"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={regenerateApiKey}
                    >
                      Regenerate
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    Use this key to access the URL Shortener API
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Webhook URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://your-app.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-neutral-400">
                    Receive notifications when links are clicked
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 