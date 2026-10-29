import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  light = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Circular Emblem */}
      <img
        src="/images/itpss-logo.svg"
        alt="Logotipo oficial ITPSS - Instituto Técnico Privado de Saúde Samiasso"
        className={`${sizeMap[size]} object-contain shrink-0 drop-shadow-sm hover:scale-105 transition-transform duration-200`}
      />

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-black tracking-tight leading-none ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : size === 'xl' ? 'text-2xl' : 'text-base'
            } ${light ? 'text-white' : 'text-[#10385F]'}`}
          >
            ITPSS
          </span>
          <span
            className={`font-medium tracking-tight mt-0.5 leading-tight ${
              size === 'sm'
                ? 'text-[10px]'
                : size === 'lg'
                ? 'text-xs'
                : 'text-[11px]'
            } ${light ? 'text-slate-300' : 'text-slate-500'}`}
          >
            Instituto Técnico Privado de Saúde Samiasso
          </span>
        </div>
      )}
    </div>
  );
};
