import { cn } from '@/lib/utils';
import React from 'react';

interface ScoreVisualizerProps {
  value: number; // Between 0 and 1
  size?: number;
  displayNumber?: string | number;
  strokeWidth?: number;
  className?: string
}

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({
  value,
  size = 64,
  displayNumber,
  strokeWidth,
  className= ''
}) => {
  // Validate input value
  const score = Math.max(0, Math.min(1, value));

  // Calculate color interpolation (red to green)
  const red = Math.round(255 * (1 - score));
  const green = Math.round(255 * score);
  const scoreColor = `rgb(${red}, ${green}, 0)`;

  // SVG circle parameters
  strokeWidth = strokeWidth ? strokeWidth : size / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score);

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className='stroke-muted-foreground stroke-1'
          // strokeWidth={strokeWidth / 4}
        />

        {/* Score track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Optional center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" style={{ color: scoreColor }}>
          {displayNumber ? displayNumber : <>{Math.round(score * 100)}%</>}
        </span>
      </div>
    </div>
  );
};

export default ScoreVisualizer;