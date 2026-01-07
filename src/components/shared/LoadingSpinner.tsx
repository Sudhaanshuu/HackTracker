import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text 
}) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48
  };

  const spinnerSize = sizeMap[size];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div 
        className="loading-spinner"
        style={{ 
          width: spinnerSize, 
          height: spinnerSize 
        }}
      />
      {text && (
        <p style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.875rem', 
          color: '#666' 
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
