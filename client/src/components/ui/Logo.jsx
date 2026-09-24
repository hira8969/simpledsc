import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', showTagline = true, variant = 'dark', className = '' }) => {
  // variant: 'dark' (for white/light background), 'light' (for dark navy footer)
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-8',
    md: 'w-9 h-10',
    lg: 'w-11 h-12',
    xl: 'w-14 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-[7.5px] tracking-[0.16em]',
    md: 'text-[9.5px] tracking-[0.2em]',
    lg: 'text-[11px] tracking-[0.22em]',
    xl: 'text-[13px] tracking-[0.24em]'
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Hexagonal Origami Ribbon Icon with Document Lines */}
      <svg
        viewBox="0 0 100 115"
        className={`${iconSizes[size] || iconSizes.md} shrink-0 drop-shadow-sm`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hexGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#703BFF" />
            <stop offset="100%" stopColor="#5B2EFF" />
          </linearGradient>
          <linearGradient id="hexGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A22DE" />
            <stop offset="100%" stopColor="#25145F" />
          </linearGradient>
          <linearGradient id="hexGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#703BFF" />
            <stop offset="100%" stopColor="#8A5BFF" />
          </linearGradient>
        </defs>

        {/* Outer Ribbon Hexagon Structure */}
        {/* Top/Front Facet */}
        <path
          d="M50 4 L88 26 C94 29 96 36 96 42 L96 72 C96 79 92 86 86 89 L50 110 L50 90 L80 72 L80 44 L50 26 Z"
          fill="url(#hexGradTop)"
        />
        {/* Left/Bottom Fold */}
        <path
          d="M50 4 L14 25 C7 29 4 36 4 43 L4 73 C4 80 8 86 14 89 L50 110 L50 90 L20 72 L20 44 L50 26 Z"
          fill="url(#hexGradLeft)"
        />
        {/* Central folded card / sheet */}
        <rect
          x="35"
          y="35"
          width="30"
          height="45"
          rx="5"
          fill="#FFFFFF"
          fillOpacity={isLight ? '0.95' : '1'}
        />
        {/* Document horizontal signature lines */}
        <line x1="42" y1="46" x2="58" y2="46" stroke="#5B2EFF" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="42" y1="56" x2="58" y2="56" stroke="#5B2EFF" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="42" y1="66" x2="52" y2="66" stroke="#703BFF" strokeWidth="3.2" strokeLinecap="round" />
      </svg>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span className={`font-black tracking-tight ${textSizes[size] || textSizes.md} ${isLight ? 'text-white' : 'text-[#11112F]'}`}>
            Simpl
          </span>
          <span className={`font-black tracking-tight ${textSizes[size] || textSizes.md} text-[#5B2EFF]`}>
            DSC
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[#5B2EFF] ml-0.5 -top-1 relative">
            ™
          </span>
        </div>
        {showTagline && (
          <span className={`font-semibold uppercase ${taglineSizes[size] || taglineSizes.md} ${isLight ? 'text-slate-300' : 'text-[#70708A]'} mt-1`}>
            Digital Signatures, Made Simple.
          </span>
        )}
      </div>
    </div>
  );
};
