import React from 'react';

export const UsbTokenVisual = ({ type = 'epass2003', size = 'md', className = '' }) => {
  // Styles for different CA brands as shown in screenshots:
  // epass2003 (deep blue/purple), vsign (deep red/burgundy), capsigns (navy blue), ncode (royal blue), emudhra (vibrant purple)

  const configs = {
    epass2003: {
      bodyColor: '#1E1B4B',
      accentColor: '#312E81',
      brandText: 'ePass2003',
      textColor: '#FFFFFF',
      ledColor: '#38BDF8',
      shape: 'curved'
    },
    vsign: {
      bodyColor: '#5B0D18',
      accentColor: '#7F1D1D',
      brandText: 'V SIGN',
      textColor: '#FFFFFF',
      ledColor: '#F87171',
      shape: 'sleek'
    },
    capsigns: {
      bodyColor: '#0F2756',
      accentColor: '#1E3A8A',
      brandText: 'CAPSIGNS',
      textColor: '#FFFFFF',
      ledColor: '#60A5FA',
      shape: 'rectangular'
    },
    ncode: {
      bodyColor: '#1E3A8A',
      accentColor: '#2563EB',
      brandText: '(n)Code solutions',
      textColor: '#FFFFFF',
      ledColor: '#93C5FD',
      shape: 'curved'
    },
    emudhra: {
      bodyColor: '#3B0764',
      accentColor: '#581C87',
      brandText: 'eMudhra',
      textColor: '#FFFFFF',
      ledColor: '#C084FC',
      shape: 'pill'
    }
  };

  const selected = configs[type.toLowerCase()] || configs.epass2003;

  const sizeClasses = {
    sm: 'w-28 h-9',
    md: 'w-40 h-12',
    lg: 'w-52 h-16',
    hero: 'w-64 sm:w-72 h-20'
  };

  return (
    <div className={`relative inline-flex items-center justify-center filter drop-shadow-md hover:scale-105 transition-transform duration-300 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <svg
        viewBox="0 0 200 64"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bodyGrad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={selected.accentColor} />
            <stop offset="35%" stopColor={selected.bodyColor} />
            <stop offset="70%" stopColor={selected.bodyColor} />
            <stop offset="100%" stopColor="#0B091F" />
          </linearGradient>

          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="30%" stopColor="#94A3B8" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* USB Metallic Plug on Left */}
        <rect x="6" y="21" width="34" height="22" rx="2" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
        {/* Metal connector cutouts */}
        <rect x="14" y="25" width="8" height="5" rx="1" fill="#1E293B" />
        <rect x="14" y="34" width="8" height="5" rx="1" fill="#1E293B" />

        {/* Plastic Token Body */}
        <rect
          x="32"
          y="10"
          width="156"
          height="44"
          rx="12"
          fill={`url(#bodyGrad-${type})`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
        />

        {/* Top glossy specular highlight */}
        <path
          d="M 40 13 Q 110 17 180 13"
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* LED Indicator Light */}
        <circle cx="50" cy="32" r="3.5" fill={selected.ledColor} filter="url(#glowEffect)" />
        <circle cx="50" cy="32" r="1.5" fill="#FFFFFF" />

        {/* Brand Text */}
        <text
          x="115"
          y="36"
          textAnchor="middle"
          fill={selected.textColor}
          fontSize="13"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.5"
        >
          {selected.brandText}
        </text>

        {/* Keyhole / Lanyard hole on far right */}
        <ellipse cx="178" cy="32" rx="4" ry="6" fill="#0B091F" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>
    </div>
  );
};
