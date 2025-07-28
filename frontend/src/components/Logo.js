import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Logo({ size = 'md' }) {
  const { isDark } = useTheme();
  
  const sizes = {
    sm: { width: 24, height: 24, fontSize: '1rem' },
    md: { width: 32, height: 32, fontSize: '1.25rem' },
    lg: { width: 40, height: 40, fontSize: '1.5rem' }
  };

  const currentSize = sizes[size];

  return (
    <div className="d-flex align-items-center">
      <div 
        className="logo-icon me-2"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          background: 'var(--bg-gradient)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          fontSize: currentSize.fontSize,
          fontWeight: '800'
        }}
      >
        <span style={{ color: 'white' }}>KB</span>
      </div>
      <span 
        className="logo-text"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          fontSize: currentSize.fontSize,
          color: isDark ? '#34d399' : '#059669',
          letterSpacing: '-0.025em'
        }}
      >
        Knowledge Base
      </span>
    </div>
  );
}

export default Logo;