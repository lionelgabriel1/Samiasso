import { ResponsiveImage } from './ResponsiveImage.tsx';
import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const Lightbox: React.FC = () => {
  const { lightboxPhoto, setLightboxPhoto, gallery } = useApp();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto]);

  if (!lightboxPhoto) return null;

  const currentIndex = gallery.findIndex((p) => p.id === lightboxPhoto.id);
  const canNavigateGallery = currentIndex >= 0 && gallery.length > 1;

  const handleNext = () => {
    if (!canNavigateGallery) return;
    if (currentIndex < gallery.length - 1) {
      setLightboxPhoto(gallery[currentIndex + 1]);
    } else {
      setLightboxPhoto(gallery[0]);
    }
  };

  const handlePrev = () => {
    if (gallery.length < 2) return;
    if (currentIndex > 0) {
      setLightboxPhoto(gallery[currentIndex - 1]);
    } else {
      setLightboxPhoto(gallery[gallery.length - 1]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de imagem ampliada"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 lightbox-enter"
      onClick={() => setLightboxPhoto(null)}
    >
      <div
        className="relative max-w-4xl w-full bg-[#10385F] rounded-xl overflow-hidden shadow-2xl border border-white/10 lightbox-panel-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#10385F]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F28C28] bg-[#F28C28]/10 px-2.5 py-1 rounded-md">
              {lightboxPhoto.category}
            </span>
            <h3 className="text-lg font-semibold text-white mt-1">{lightboxPhoto.title}</h3>
          </div>
          <button
            onClick={() => setLightboxPhoto(null)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar visualizador"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Frame */}
        <div
          className="relative bg-black flex items-center justify-center min-h-[240px] sm:min-h-[360px] max-h-[70vh] touch-pan-y"
          onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start === null || end === undefined) return;
            const distance = end - start;
            if (Math.abs(distance) < 48) return;
            if (distance < 0) handleNext();
            else handlePrev();
          }}
        >
          <ResponsiveImage
            src={lightboxPhoto.url}
            alt={lightboxPhoto.title}
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="max-h-[70vh] w-auto max-w-full object-contain mx-auto lightbox-image-enter"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-transform active:scale-95 cursor-pointer"
            aria-label="Imagem anterior"
            disabled={!canNavigateGallery}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-transform active:scale-95 cursor-pointer"
            aria-label="Próxima imagem"
            disabled={gallery.length < 2}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption */}
        {lightboxPhoto.caption && (
          <div className="px-6 py-3.5 bg-[#0b2743] text-sm text-slate-300 flex items-center justify-between">
            <p>{lightboxPhoto.caption}</p>
            {lightboxPhoto.date && (
              <span className="text-xs text-slate-400 shrink-0 ml-4">{lightboxPhoto.date}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
