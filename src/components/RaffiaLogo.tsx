import React from 'react';

/**
 * Authentic Hand-Painted Brush Stroke SVG
 * Creates the organic, painterly texture under the Raffia Legacy mark.
 */
export const BrushStrokeUnderline: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'w-full h-2.5', color = 'var(--terracotta, #B94E2E)' }) => (
  <svg
    viewBox="0 0 280 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`brush-stroke-svg ${className}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    {/* Primary expressive brush body with subtle bristle variations */}
    <path
      d="M3.2 13.6C24.8 11.2 46.5 10.1 68.2 9.2C104.9 7.8 141.6 7.2 178.3 8.1C205.1 8.8 231.8 10.3 258.4 12.8C265.1 13.4 272.5 14.1 276.9 11.8C278.4 11.0 277.2 9.4 275.6 9.1C250.7 5.9 225.4 4.5 200.2 4.1C163.8 3.5 127.3 4.2 91.0 6.1C64.6 7.4 38.3 9.4 12.1 12.3C7.4 12.8 2.3 13.4 1.1 14.2C0.4 14.7 1.8 15.2 3.2 13.6Z"
      fill={color}
    />
    {/* Secondary layer simulating hand-painted wet edge and pigment density */}
    <path
      d="M14.5 16.2C52.1 14.8 89.7 13.9 127.4 13.5C163.2 13.1 199.1 13.4 234.8 15.1C248.5 15.8 262.2 16.7 274.5 14.9C275.6 14.7 274.9 13.5 273.7 13.4C248.9 10.7 223.8 9.8 198.8 9.5C158.4 9.1 117.9 9.6 77.5 11.4C53.8 12.4 30.1 14.1 6.5 16.7C5.2 16.8 5.7 18.2 7.1 18.2C22.6 18.2 38.0 17.5 53.5 17.0C93.4 15.7 133.4 15.1 173.4 15.8C203.2 16.3 233.0 17.6 262.7 19.4C265.2 19.6 265.8 17.6 263.4 17.3C235.1 14.7 206.6 13.5 178.1 13.1C138.8 12.6 99.4 13.0 60.1 14.6C42.8 15.3 25.6 16.4 8.3 17.4C7.0 17.5 13.2 16.3 14.5 16.2Z"
      fill={color}
      opacity="0.9"
    />
    {/* Subtle organic trailing splatter at end */}
    <circle cx="278.5" cy="12.5" r="1.2" fill={color} opacity="0.75" />
    <circle cx="272.2" cy="17.8" r="0.9" fill={color} opacity="0.6" />
    <circle cx="2.2" cy="14.8" r="0.9" fill={color} opacity="0.5" />
  </svg>
);

export interface RaffiaLogoProps {
  variant?: 'nav' | 'header' | 'hero' | 'full' | 'stacked' | 'inline';
  theme?: 'dark' | 'light';
  showProject?: boolean;
  showTagline?: boolean;
  showUnderline?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Raffia Legacy Logo Component
 * Implements the 4 distinct typographic elements + hand-painted brush stroke:
 * 1. "Raffia" — Bodoni Moda Display Serif (Regular/Display weight, elegant heritage high-contrast)
 * 2. "LEGACY" — Montserrat ExtraBold / Black (Heavy geometric sans)
 * 3. "PROJECT" — Montserrat Bold with wide tracking (+250 to +350 / 0.28em)
 * 4. Tagline / Description — Montserrat SemiBold/Bold (weight 600)
 * 5. Underline — Hand-painted brush stroke
 */
export const RaffiaLogo: React.FC<RaffiaLogoProps> = ({
  variant = 'nav',
  theme = 'dark',
  showProject = true,
  showTagline = false,
  showUnderline = true,
  className = '',
  onClick,
}) => {
  const isLight = theme === 'light';
  const textColor = isLight ? '#F5F0E8' : '#17130F';
  const legacyColor = isLight ? '#E59C6D' : '#B94E2E';
  const brushColor = isLight ? '#E59C6D' : '#B94E2E';

  // Nav brandmark (compact, sharp, authentic)
  if (variant === 'nav') {
    return (
      <div
        className={`raffia-logo-lockup select-none inline-flex flex-col items-start cursor-pointer group ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className="logo-elem-raffia"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 500,
              fontSize: 'clamp(21px, 2.3vw, 26px)',
              letterSpacing: '-0.02em',
              color: textColor,
              lineHeight: 1,
            }}
          >
            Raffia
          </span>
          <span
            className="logo-elem-legacy uppercase"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(18px, 2.0vw, 23px)',
              letterSpacing: '-0.03em',
              color: legacyColor,
              lineHeight: 1,
            }}
          >
            LEGACY
          </span>
          {showProject && (
            <span
              className="logo-elem-project hidden sm:inline-block uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(10px, 1.0vw, 11px)',
                letterSpacing: '0.28em',
                color: isLight ? 'rgba(245, 240, 232, 0.75)' : '#57524E',
                marginLeft: '3px',
                lineHeight: 1,
              }}
            >
              PROJECT
            </span>
          )}
        </div>

        {/* Hand-painted brush stroke underline */}
        {showUnderline && (
          <div className="w-full mt-1.5 overflow-visible">
            <BrushStrokeUnderline
              className="w-full h-[6px] transition-transform duration-300 ease-out group-hover:scale-x-105 origin-left"
              color={brushColor}
            />
          </div>
        )}
      </div>
    );
  }

  // Hero / Full / Stacked Variant
  return (
    <div
      className={`raffia-logo-lockup inline-flex flex-col ${
        variant === 'full' ? 'max-w-2xl' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 leading-none">
        <span
          className="logo-elem-raffia"
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontWeight: 500,
            fontSize:
              variant === 'hero'
                ? 'clamp(44px, 8vw, 88px)'
                : 'clamp(28px, 4vw, 42px)',
            letterSpacing: '-0.025em',
            color: textColor,
            lineHeight: 0.95,
          }}
        >
          Raffia
        </span>
        <span
          className="logo-elem-legacy uppercase"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize:
              variant === 'hero'
                ? 'clamp(40px, 7.5vw, 82px)'
                : 'clamp(25px, 3.6vw, 38px)',
            letterSpacing: '-0.035em',
            color: legacyColor,
            lineHeight: 0.95,
          }}
        >
          LEGACY
        </span>
        {showProject && (
          <span
            className="logo-elem-project uppercase block w-full sm:w-auto mt-1 sm:mt-0"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize:
                variant === 'hero'
                  ? 'clamp(14px, 1.8vw, 20px)'
                  : 'clamp(11px, 1.2vw, 13px)',
              letterSpacing: '0.3em',
              color: isLight ? 'rgba(245, 240, 232, 0.8)' : '#57524E',
              lineHeight: 1,
            }}
          >
            PROJECT
          </span>
        )}
      </div>

      {/* Hand-painted brush stroke underline */}
      {showUnderline && (
        <div className="w-full mt-2.5 mb-2 max-w-[420px]">
          <BrushStrokeUnderline
            className="w-full h-[9px] md:h-[12px]"
            color={brushColor}
          />
        </div>
      )}

      {/* Official Tagline / Description with high legibility */}
      {(showTagline || variant === 'full') && (
        <p
          className="logo-elem-tagline mt-2"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            fontSize:
              variant === 'hero'
                ? 'clamp(15px, 1.4vw, 18px)'
                : 'clamp(13px, 1.2vw, 15px)',
            lineHeight: 1.6,
            color: isLight ? 'rgba(245, 240, 232, 0.9)' : '#2E251F',
            letterSpacing: '-0.01em',
          }}
        >
          A year-round of activities celebrating raffia as a symbol of African
          heritage, sustainable creativity, innovation and economic opportunity.
        </p>
      )}
    </div>
  );
};
