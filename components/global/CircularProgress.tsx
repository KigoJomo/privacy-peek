import React from 'react';

interface CircularProgressProps {
  value: number; // Between 0 and 1
  size?: number;
  displayNumber?: string | number;
  strokeWidth?: number;
  trackColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 64,
  displayNumber,
  strokeWidth = 8,
  trackColor = '#e6e6e600',
}) => {
  // Validate input value
  const progress = Math.max(0, Math.min(1, value));

  // Calculate color interpolation (red to green)
  const red = Math.round(255 * (1 - progress));
  const green = Math.round(255 * progress);
  const progressColor = `rgb(${red}, ${green}, 50)`;

  // SVG circle parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="relative inline-block"
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
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      {/* Optional center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium" style={{ color: progressColor }}>
          {displayNumber ? displayNumber : <>{Math.round(progress * 100)}%</>}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
