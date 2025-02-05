import { Metadata } from 'next';
import PasswordPage from './PasswordPage';

export const metadata: Metadata = {
  title: 'Password Protected URL',
  description: 'Enter password to access the protected URL',
};

interface PageProps {
  params: Promise<{ shortUrl: string }>;
}

export default async function Page({ params }: PageProps) {
  const { shortUrl } = await params;
  return <PasswordPage shortUrl={shortUrl} />;
} 