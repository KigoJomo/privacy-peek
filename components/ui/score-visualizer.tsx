import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface ScoreVisualizerProps {
  value: number; // Between 0 and 1
  size?: number;
  displayNumber?: string | number;
  strokeWidth?: number;
  className?: string;
}

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({
  value,
  size = 64,
  displayNumber,
  strokeWidth,
  className = '',
}) => {
  // Validate input value
  const clampedValue = Math.max(0, Math.min(1, value));
  const score = Number.isFinite(clampedValue) ? clampedValue : 0;

  // Calculate color: red (0) → amber (0.5) → green (1)
  const hue = Math.round(120 * score);
  const scoreColor = `hsl(${hue}, 80%, ${score < 0.3 ? 45 : 40}%)`;

  // SVG circle parameters
  const sw = strokeWidth ? strokeWidth : size / 10;
  const radius = (size - sw) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score);

  // Dynamic font size for the center label
  const fontSizePx = Math.max(10, Math.round(size * 0.275));

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute inset-0"
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background track — more visible */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-border"
            strokeWidth={sw * 0.6}
          />

          {/* Score track */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
          />
        </svg>
      </motion.div>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-semibold"
          style={{ color: scoreColor, fontSize: fontSizePx }}
        >
          {displayNumber !== undefined ? displayNumber : <>{Math.round(score * 100)}%</>}
        </span>
      </div>
    </div>
  );
};

export default ScoreVisualizer;
