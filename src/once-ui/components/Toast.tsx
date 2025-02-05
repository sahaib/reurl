'use client';

import { useEffect, useState } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

  const showToast = (message: string, duration = 3000) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, duration);
  };

  return { toast, showToast };
} 