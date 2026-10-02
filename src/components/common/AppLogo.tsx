import React from 'react';
import Image from 'next/image';

export interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  iconClassName?: string;
  priority?: boolean;
  showText?: boolean;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'indigo' | 'purple';
}

const SIZE_MAP = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56,
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  iconClassName = '',
  priority = true,
  showText = false,
  subtitle,
  badgeText,
  badgeVariant = 'indigo',
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 36;

  const badgeStyles =
    badgeVariant === 'purple'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0 drop-shadow-sm select-none"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src="/assets/images/agra-icon.png"
          alt="AGRA Logo"
          width={pixelSize}
          height={pixelSize}
          priority={priority}
          className={`object-contain transition-transform duration-200 ${iconClassName}`}
        />
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xl font-bold tracking-tight text-white">AGRA</span>
            {badgeText && (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${badgeStyles}`}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AppLogo;
