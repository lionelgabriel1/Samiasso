import React, { useState } from 'react';
import { Camera, Maximize2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { GalleryPhoto } from '../../types/index.ts';

export const GaleriaPage: React.FC = () => {
  const { gallery, setPublicRoute, setLightboxPhoto } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Instalações', 'Alunos', 'Laboratórios', 'Eventos'];

  const filteredPhotos = gallery.filter((photo) => {
    if (activeCategory === 'Todas') return true;
    return photo.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Foto da escola feita com drone.jpg"
            alt="Galeria ITPSS"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/90 to-[#10385F]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <button
              onClick={() => setPublicRoute('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <span>&gt;</span>
            <span className="text-[#F28C28] font-semibold">Galeria</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Galeria
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Momentos que mostram a nossa essência.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Category Filter Tabs matching mockup */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all btn-tactile cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#F28C28] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-[#10385F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" key={activeCategory}>
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden shadow-xs img-card-interactive bg-white border border-slate-200/80 cursor-pointer"
            >
              <div className="h-60 img-zoom-container bg-slate-100">
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10385F]/95 via-[#10385F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28] bg-black/40 px-2 py-0.5 rounded w-fit mb-1">
                  {photo.category}
                </span>
                <h4 className="font-bold text-sm leading-tight text-white font-heading">{photo.title}</h4>
                {photo.caption && (
                  <p className="text-[11px] text-slate-200 mt-1 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-2 font-medium">
                  <Maximize2 className="w-3 h-3 text-[#F28C28]" />
                  <span>Clique para ampliar</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Quote Section matching mockup */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1456A0]">
                <Sparkles className="w-4 h-4 text-[#F28C28]" />
                <span>Nossa Trajetória</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F]">
                Mais do que fotos, mostramos histórias de superação e dedicação.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                Conheça o dia a dia dos nossos alunos, as nossas instalações e as atividades que fazem do ITPSS uma referência na formação técnica em saúde no Moxico.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={() => {
                  setPublicRoute('matriculas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                Fazer parte desta comunidade →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
