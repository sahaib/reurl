import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Appearance } from '@clerk/types';
import "./globals.scss";
import "@/once-ui/styles/index.scss";
import { style } from "../once-ui/resources/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.reurl.dev'),
  title: {
    default: "Reurl - Modern URL Shortener",
    template: "%s | Reurl"
  },
  description: "Transform long URLs into short, memorable links. Reurl offers custom URLs, analytics, and password protection for your shortened links.",
  keywords: ["URL shortener", "link management", "custom URLs", "link analytics", "password protected links", "short links", "URL management", "link tracking"],
  authors: [{ 
    name: "Sahaib",
    url: "https://github.com/sahaib"
  }],
  creator: "Sahaib",
  publisher: "Reurl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.reurl.dev',
    siteName: 'Reurl',
    title: 'Reurl - Modern URL Shortener',
    description: 'Transform long URLs into short, memorable links. Custom URLs, analytics, and password protection for your shortened links.',
    images: [
      {
        url: 'https://www.reurl.dev/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reurl - Modern URL Shortener',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code'
  },
};

const appearance: Appearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: 'rgb(34 197 94)',
    colorBackground: '#000',
    colorText: '#fff',
    colorInputBackground: 'rgba(255, 255, 255, 0.1)',
    colorInputText: '#fff',
    borderRadius: '0.5rem',
  },
  elements: {
    card: 'bg-black shadow-xl border border-neutral-800',
    formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-600',
    socialButtonsIconButton: 'border-neutral-800 hover:bg-neutral-800',
    formField: 'border-neutral-800',
    footer: 'text-neutral-400',
    modalBackdrop: 'bg-black/80 backdrop-blur-sm',
    modalContent: 'bg-black border border-neutral-800 shadow-2xl'
  },
  layout: {
    socialButtonsPlacement: "top" as const
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={appearance}
    >
      <html lang="en"
            data-neutral={style.neutral}
            data-brand={style.brand}
            data-accent={style.accent}
            data-solid={style.solid}
            data-solid-style={style.solidStyle}
            data-border={style.border}
            data-surface={style.surface}
            data-transition="all"
            data-scaling={style.scaling}>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <meta name="description" content="A modern URL shortening platform" />
          <meta name="keywords" content="URL shortener, link management, branding" />
          <meta name="author" content="Reurl" />
          <meta property="og:title" content="URL Shortener" />
          <meta property="og:description" content="A modern URL shortening platform" />
          <meta property="og:image" content="/path-to-image.jpg" />
          <meta property="og:url" content="https://www.reurl.dev" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className={`${inter.className} min-h-screen transition-colors`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
