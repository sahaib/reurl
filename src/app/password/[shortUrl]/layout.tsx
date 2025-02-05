import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Protected URL',
  description: 'Enter password to access the protected URL',
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 