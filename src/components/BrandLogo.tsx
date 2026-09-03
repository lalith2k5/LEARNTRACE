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
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  const isCentered = className.includes('items-center') || className.includes('text-center');

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex flex-col select-none ${
        isCentered ? 'items-center text-center' : 'items-start text-left'
      } ${interactive ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Brand Typography (Logo icon removed, violet text replaced with Facebook Blue #1877F2) */}
      {showText && (
        <div className={`flex flex-col ${isCentered ? 'items-center text-center' : 'items-start text-left'}`}>
          <div className={`font-extrabold ${textSizes} tracking-tight leading-none text-slate-900 font-sans flex items-center gap-1.5`}>
            <span>LEARN</span>
            <span className="text-[#1877F2] font-black tracking-normal">TRACE</span>
          </div>
          {subtitle && (
            <p className={`${subtitleSizes} text-slate-500 font-medium tracking-tight mt-1.5 leading-tight`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

