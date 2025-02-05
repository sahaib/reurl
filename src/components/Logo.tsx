'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Logo() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = 'reur/.com';
  const prefix = 'https:// ';
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2000;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const animateText = () => {
      if (!isDeleting) {
        // Typing
        if (text.length < fullText.length) {
          timeout = setTimeout(() => {
            setText(fullText.slice(0, text.length + 1));
          }, typingSpeed);
        } else {
          // Pause before deleting
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else {
        // Deleting
        if (text.length > 0) {
          timeout = setTimeout(() => {
            setText(text.slice(0, -1));
          }, deletingSpeed);
        } else {
          // Start typing again
          setIsDeleting(false);
        }
      }
    };

    animateText();

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  return (
    <Link href="/" className="font-mono text-xl font-bold">
      <span className="text-neutral-500">{prefix}</span>
      <span className="text-emerald-500">{text}</span>
      <span className="animate-pulse">_</span>
    </Link>
  );
} 