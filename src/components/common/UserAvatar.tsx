import React, { useState } from 'react';

export interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  rounded?: 'full' | 'xl' | '2xl' | '3xl';
  className?: string;
  imageClassName?: string;
  alt?: string;
  fallbackGradient?: string;
}

const SIZE_STYLES: Record<string, { container: string; text: string; px: number }> = {
  xs: { container: 'h-6 w-6', text: 'text-[10px]', px: 24 },
  sm: { container: 'h-7 w-7', text: 'text-xs', px: 28 },
  md: { container: 'h-10 w-10', text: 'text-sm', px: 40 },
  lg: { container: 'h-14 w-14', text: 'text-lg', px: 56 },
  xl: { container: 'h-24 w-24', text: 'text-3xl', px: 96 },
};

const ROUNDED_STYLES: Record<string, string> = {
  full: 'rounded-full',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  rounded = 'full',
  className = '',
  imageClassName = '',
  alt = 'Avatar Pengguna',
  fallbackGradient = 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500',
}) => {
  const [imageError, setImageError] = useState(false);

  const initial = (name?.trim()?.[0] || 'U').toUpperCase();

  const isPresetSize = typeof size === 'string' && size in SIZE_STYLES;
  const sizeConfig = isPresetSize ? SIZE_STYLES[size as string] : null;
  const customPx = typeof size === 'number' ? size : sizeConfig?.px || 40;

  const roundedClass = ROUNDED_STYLES[rounded] || 'rounded-full';

  // If src changes, reset error state
  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  const hasValidImage = Boolean(src && src.trim() !== '' && !imageError);

  const containerSizeClass = isPresetSize ? sizeConfig?.container : '';
  const textClass = isPresetSize ? sizeConfig?.text : 'text-sm';

  return (
    <div
      style={!isPresetSize ? { width: customPx, height: customPx } : undefined}
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none transition-all ${containerSizeClass} ${roundedClass} ${className}`}
    >
      {hasValidImage ? (
        <img
          src={src!}
          alt={alt}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover object-center ${imageClassName}`}
          loading="lazy"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center font-extrabold text-white shadow-inner ${fallbackGradient} ${textClass}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
