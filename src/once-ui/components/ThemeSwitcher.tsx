'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Update the theme
  const updateTheme = (newTheme: string) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'dark';
    updateTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </Button>
  );
}