import type { ReactNode } from 'react';
import { clamp } from '../utils/helpers';

interface Props {
  /** Andel fylld, 0–1. */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: ReactNode;
}

export default function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = 'var(--primary)',
  trackColor = 'var(--ring-track)',
  children,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference * clamp(value, 0, 1);

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ring__fill"
        />
      </svg>
      <div className="ring__content">{children}</div>
    </div>
  );
}
