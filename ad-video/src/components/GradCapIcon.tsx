import React from 'react';

export const GradCapIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#F0B429',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill={color}
      opacity={0.14}
      d="M12 3.6 2.8 8.2 12 13l9.2-4.8z"
    />
    <path d="M2.8 8.2 12 13l9.2-4.8L12 3.6 2.8 8.2Z" />
    <path d="M6.5 11.6v3.1c0 2.2 2.5 4 5.5 4s5.5-1.8 5.5-4v-3.1" />
    <path d="M21.2 8.5v5.4" />
    <circle cx="21.2" cy="15.7" r="1" fill={color} opacity={0.78} stroke="none" />
  </svg>
);

export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#F0B429',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path fill={color} opacity={0.16} d="m12 4.5 1.6 4 4 .8-4 1.6-.8 4-1.6-4-4-.8 4-1.6z" stroke="none" />
    <path d="m12 3.5 1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z" />
    <path d="M18.2 3.8v2.3M19.3 4.9H17" />
    <path d="M19 15.8v4.2M21.1 17.9h-4.2" />
    <path d="M4.1 15.2v2.8M5.5 16.6H2.7" />
  </svg>
);

export const FigurineIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#F0B429',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path fill={color} opacity={0.14} d="M9.4 9.6h5.2l1.1 6.3H8.3z" stroke="none" />
    <circle cx="12" cy="4.8" r="2.4" />
    <path d="M9.4 10.1h5.2l1.2 5.8H8.2z" />
    <path d="M10.5 15.9v3.3M13.5 15.9v3.3" />
    <path d="M7.6 19.5h8.8" />
    <rect x="7.3" y="19" width="9.4" height="2.2" rx="1.1" fill={color} opacity={0.16} stroke="none" />
  </svg>
);

export const LightningIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#F0B429',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path fill={color} opacity={0.14} d="M13.7 2.8 4.4 13.9h5.1l-1 7.3 11-11.1h-5.1z" stroke="none" />
    <path d="M13.7 2.8 4.4 13.9h5.1l-1 7.3 11-11.1h-5.1z" />
    <path d="M10.8 13.9h3.8" />
  </svg>
);

export const BookIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = '#F0B429',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path fill={color} opacity={0.12} d="M4 5.7h4.8A3.2 3.2 0 0 1 12 8.9v10.8a3 3 0 0 0-3-3H4zM20 5.7h-4.8A3.2 3.2 0 0 0 12 8.9v10.8a3 3 0 0 1 3-3H20z" stroke="none" />
    <path d="M4 5.7h4.8A3.2 3.2 0 0 1 12 8.9v10.8a3 3 0 0 0-3-3H4z" />
    <path d="M20 5.7h-4.8A3.2 3.2 0 0 0 12 8.9v10.8a3 3 0 0 1 3-3H20z" />
    <path d="M8 9.2h1.9M14.1 9.2H16" />
  </svg>
);
