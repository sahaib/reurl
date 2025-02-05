import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  className = '',
  ...props
}) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}; 