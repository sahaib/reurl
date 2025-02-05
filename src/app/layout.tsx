import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeSwitcher } from "@/once-ui/components/ThemeSwitcher";
import "./globals.scss";
import "@/once-ui/styles/index.scss";
import { style } from "../once-ui/resources/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A modern URL shortening platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
