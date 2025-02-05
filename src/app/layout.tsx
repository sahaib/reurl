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
  title: "URL Shortener",
  description: "A modern URL shortening platform",
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
        <body className={`${inter.className} min-h-screen transition-colors`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
