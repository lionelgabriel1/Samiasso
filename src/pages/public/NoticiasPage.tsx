import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Tag, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NewsItem } from '../../types/index.ts';

export const NoticiasPage: React.FC = () => {
  const { news, setPublicRoute, selectedNewsArticle, setSelectedNewsArticle } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todas');

  const categories = ['Todas', 'Matrículas', 'Académico', 'Institucional'];

  const filteredNews = news.filter((item) => {
    if (!item.published) return false;
    const matchCat = activeCategory === 'Todas' || item.category === activeCategory;
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-drone-source.jpg"
            alt="Notícias ITPSS"
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
            <span className="text-[#F28C28] font-semibold">Notícias</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Notícias e Comunicados
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Acompanhe as atualizações institucionais, avisos e atividades escolares do ITPSS.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1456A0] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar comunicados..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
            />
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
            Nenhuma notícia encontrada para esta pesquisa.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedNewsArticle(item)}
                className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/80 flex flex-col group cursor-pointer"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#10385F]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F28C28]" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#10385F] group-hover:text-[#1456A0] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-2">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1456A0]">
                    <span>Ler comunicado completo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F28C28]" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reader Modal */}
      {selectedNewsArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelectedNewsArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-slate-100 shrink-0">
              <img
                src={selectedNewsArticle.image}
                alt={selectedNewsArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-[#1456A0] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                {selectedNewsArticle.category}
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F28C28]" />
                  {selectedNewsArticle.date}
                </span>
                <span>•</span>
                <span>{selectedNewsArticle.readTime}</span>
              </div>

              <h2 className="text-2xl font-black text-[#10385F] leading-snug">
                {selectedNewsArticle.title}
              </h2>

              <div className="pt-2 text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100">
                {selectedNewsArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedNewsArticle(null)}
                  className="px-5 py-2.5 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Fechar Leitura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
