import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, MapPin, Camera } from 'lucide-react';

export interface LightboxImage {
  src: string;
  title: string;
  subtitle?: string;
  location?: string;
  category?: string;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (image) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#11100E]/95 backdrop-blur-xl"
        >
          {/* Top Bar with close button */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C8A978]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#C8A978]">
                {image.category || 'RAFFIA LEGACY ARCHIVE'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              aria-label="Close image inspection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image & Caption Wrapper */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl max-h-[85vh] w-full flex flex-col items-center justify-center"
          >
            <div className="relative overflow-hidden shadow-2xl border border-white/15 max-h-[72vh] w-auto">
              <img
                src={image.src}
                alt={image.title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Bottom Caption */}
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <h3 className="text-lg sm:text-xl font-bold font-sans tracking-tight">
                {image.title}
              </h3>
              {image.subtitle && (
                <p className="text-xs sm:text-sm text-white/75 mt-1 font-sans">
                  {image.subtitle}
                </p>
              )}
              {image.location && (
                <div className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-mono tracking-widest uppercase text-[#C8A978]">
                  <MapPin className="w-3 h-3 text-[#B65332]" />
                  <span>{image.location}</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
