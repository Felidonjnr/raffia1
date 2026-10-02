import React, { useState } from 'react';

interface ArchivalImageProps {
  src?: string | null;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | '2:3' | 'custom';
  caption?: string;
  className?: string;
  priority?: boolean;
}

export const ArchivalImage: React.FC<ArchivalImageProps> = ({
  src,
  alt,
  aspectRatio = '4:3',
  caption,
  className = '',
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : aspectRatio === '2:3'
      ? 'aspect-[2/3]'
      : '';

  return (
    <div className={`relative overflow-hidden bg-[#ECE5DC] group ${aspectClass} ${className}`}>
      {/* If source exists and hasn't errored */}
      {src && !hasError && (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] ${
            isLoaded ? 'opacity-100 filter-none' : 'opacity-0 scale-95'
          }`}
        />
      )}

      {/* Styled Fallback Container */}
      {(hasError || !src) && (
        <div className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 bg-[#EBE4D8] border border-[#DDD4C5]">
          {/* Subtle geometric weave watermark lines */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none overflow-hidden">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="raffia-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 L 40 20 M 20 0 L 20 40 M 0 0 L 40 40 M 40 0 L 0 40" fill="none" stroke="#181513" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#raffia-grid)" />
            </svg>
          </div>

          {/* Top tag */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-[#8C7355]">
            <span>RAFFIA LEGACY</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#B84A28]" />
          </div>

          {/* Center tactile craft motif */}
          <div className="relative z-10 my-auto text-center px-4">
            <div className="w-12 h-12 mx-auto mb-3 border border-[#8C7355]/30 flex items-center justify-center rotate-45 group-hover:rotate-90 transition-transform duration-500">
              <div className="w-4 h-4 bg-[#B84A28]/20 -rotate-45" />
            </div>
            <p className="font-editorial text-xl italic text-[#241D19] leading-snug line-clamp-2">
              {alt}
            </p>
            <p className="text-xs tracking-widest uppercase text-[#8C7355] mt-1 font-mono">
              Craft Object
            </p>
          </div>

          {/* Bottom attribution */}
          <div className="relative z-10 pt-2 border-t border-[#DDD4C5] flex items-center justify-between text-xs text-[#57524E]">
            <span className="uppercase tracking-widest font-mono">Raffia Heritage</span>
            <span className="font-sans">Handcrafted</span>
          </div>
        </div>
      )}

      {/* Optional Editorial Caption Bar */}
      {caption && (
        <div className="absolute bottom-0 inset-x-0 bg-[#181513]/75 backdrop-blur-[2px] p-2.5 text-center">
          <p className="text-xs text-[#FAF7F2] font-sans tracking-wide">{caption}</p>
        </div>
      )}
    </div>
  );
};
