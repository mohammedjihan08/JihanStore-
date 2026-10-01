import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'light' | 'icon-only';
  customLogoUrl?: string;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  customLogoUrl,
  className = '',
  showTagline = false
}) => {
  // If custom uploaded logo is provided, display without stretching, distorting or recoloring
  if (customLogoUrl && customLogoUrl.trim() !== '') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={customLogoUrl}
          alt="Jihan Store – জিহান স্টোর"
          className="max-h-12 w-auto object-contain shrink-0"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  const isLight = variant === 'light';

  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 drop-shadow-sm"
        >
          {/* Outer Royal Blue Shield */}
          <path
            d="M22 2L6 8V20C6 30 13 38.8 22 42C31 38.8 38 30 38 20V8L22 2Z"
            fill="#1E3A8A"
          />
          {/* Inner Gold Inset Border */}
          <path
            d="M22 5.5L9.5 10.2V20C9.5 28 15 35.5 22 38.2C29 35.5 34.5 28 34.5 20V10.2L22 5.5Z"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Stylized 'J' Monogram in Gold */}
          <path
            d="M26 14V25C26 28 23.5 30 20.5 30C18 30 16 28.5 15.5 26.5"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle Crown / Shopping Bag Gold handle */}
          <circle cx="22" cy="11.5" r="1.5" fill="#FBBF24" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 select-none shrink min-w-0 ${className}`}>
      {/* Brand Icon */}
      <div className="relative shrink-0">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 sm:w-10 sm:h-10"
        >
          {/* Royal Blue Protective Shield */}
          <path
            d="M22 2L6 8V20C6 30 13 38.8 22 42C31 38.8 38 30 38 20V8L22 2Z"
            fill="#1E3A8A"
          />
          {/* Gold Outline */}
          <path
            d="M22 5.5L9.5 10.2V20C9.5 28 15 35.5 22 38.2C29 35.5 34.5 28 34.5 20V10.2L22 5.5Z"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          {/* J Monogram */}
          <path
            d="M26 14V25C26 28 23.5 30 20.5 30C18 30 16 28.5 15.5 26.5"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="11.5" r="1.5" fill="#FBBF24" />
        </svg>
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap">
          <span
            className={`font-black tracking-tight text-base sm:text-lg md:text-xl font-sans whitespace-nowrap ${
              isLight ? 'text-white' : 'text-blue-950'
            }`}
          >
            JIHAN STORE
          </span>
          <span
            className={`font-semibold text-[11px] sm:text-xs md:text-sm font-sans whitespace-nowrap ${
              isLight ? 'text-amber-300' : 'text-amber-600'
            }`}
          >
            জিহান স্টোর
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-normal mt-0.5 truncate ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            বিশ্বাসের সাথে অনলাইন শপিং
          </span>
        )}
      </div>
    </div>
  );
};
