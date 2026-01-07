import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  label
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div style={{ width: '100%' }}>
      {(showLabel || label) && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '0.25rem',
          fontSize: '0.75rem'
        }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>
            {label || 'Progress'}
          </span>
          <span style={{ fontWeight: 600, color: '#6b7280' }}>
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
