import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
  interactive = false,
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-13 h-13 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
  }[size];

  const svgSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Executive Geometric Knowledge Vector Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`${iconDimensions} bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/40 ${
            interactive ? 'group-hover:scale-105 group-hover:shadow-indigo-600/35 group-hover:ring-indigo-300' : ''
          } transition-all duration-200 relative overflow-hidden`}
        >
          {/* Subtle specular sheen overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/0 pointer-events-none" />

          {/* Premium Knowledge Lattice & Ray Vector Icon */}
          <svg
            className={`${svgSizes} text-white drop-shadow-sm`}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hexagonal Shield Node Network */}
            <path
              d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/80"
            />
            {/* Central Tri-Vector Tracing Lattice */}
            <path
              d="M16 16L27 9.5M16 16V29M16 16L5 9.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/90"
            />
            {/* Dynamic Inner Neural Diamond Trace */}
            <path
              d="M16 8L22 16L16 24L10 16L16 8Z"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="text-cyan-200"
            />
            {/* Precision Graph Nodes */}
            <circle cx="16" cy="16" r="2.5" fill="#38BDF8" className="animate-pulse" />
            <circle cx="16" cy="3" r="1.5" fill="white" />
            <circle cx="27" cy="9.5" r="1.5" fill="white" />
            <circle cx="27" cy="22.5" r="1.5" fill="white" />
            <circle cx="16" cy="29" r="1.5" fill="white" />
            <circle cx="5" cy="22.5" r="1.5" fill="white" />
            <circle cx="5" cy="9.5" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Real-Time Engine Active Status Indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
        </span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className={`font-extrabold ${textSizes} tracking-tight leading-none text-slate-900 font-sans flex items-center gap-1`}>
            <span>LEARN</span>
            <span className="text-indigo-600 bg-clip-text">TRACE</span>
          </div>
          {subtitle && (
            <p className={`${subtitleSizes} text-slate-500 font-medium tracking-tight mt-1 leading-tight`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
