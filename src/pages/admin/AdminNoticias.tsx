import React, { useState } from 'react';
import { Newspaper, Plus, Trash2, Edit2, CheckCircle2, Calendar, Eye, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NewsItem } from '../../types/index.ts';

export const AdminNoticias: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Académico' | 'Matrículas' | 'Institucional' | 'Eventos'>('Matrículas');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('/images/hero-drone-source.jpg');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary || !content) return;

    addNews({
      title,
      category,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      summary,
      content,
      image,
      readTime: '3 min de leitura',
      published: true,
    });

    setIsCreating(false);
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Notícias e Comunicados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publique informações oficiais que aparecem no portal público
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Notícia</span>
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-[#10385F]">Publicar Nova Notícia</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Comunicado *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Calendário de Avaliações Trimestrais"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Matrículas">Matrículas</option>
                    <option value="Académico">Académico</option>
                    <option value="Institucional">Institucional</option>
                    <option value="Eventos">Eventos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fotografia de Destaque</label>
                  <select
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="/images/hero-drone-source.jpg">Vista da Escola</option>
                    <option value="/images/lab-students.jpg">Laboratório de Saúde</option>
                    <option value="/images/students-group-1.jpg">Alunos no Campus</option>
                    <option value="/images/practical-banner.jpg">Formação Prática</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumo Curto *</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve resumo a exibir na listagem pública..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Conteúdo Completo *</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Texto completo do anúncio oficial..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold rounded-xl shadow"
                >
                  Publicar Imediatamente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#F28C28] bg-orange-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{item.date}</span>
                </div>
                <h4 className="font-extrabold text-sm text-[#10385F] line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">{item.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => deleteNews(item.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Remover notícia"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
