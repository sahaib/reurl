import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}; 