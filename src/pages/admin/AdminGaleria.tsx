import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { GalleryPhoto } from '../../types/index.ts';

export const AdminGaleria: React.FC = () => {
  const { gallery, addGalleryPhoto, deleteGalleryPhoto } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Instalações' | 'Alunos' | 'Laboratórios' | 'Eventos'>('Instalações');
  const [url, setUrl] = useState('/images/campus-drone.jpg');
  const [caption, setCaption] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addGalleryPhoto({
      title,
      category,
      url,
      caption,
      date: 'Outubro 2026',
    });

    setIsAdding(false);
    setTitle('');
    setCaption('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão de Fotografias e Galeria</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Adicione e organize as fotografias oficiais que alimentam o website público
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Fotografia</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#10385F]">Adicionar Fotografia</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Imagem *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Treino prático de enfermaria"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Instalações">Instalações</option>
                  <option value="Alunos">Alunos</option>
                  <option value="Laboratórios">Laboratórios</option>
                  <option value="Eventos">Eventos</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ficheiro / Imagem Selecionada</label>
                <select
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="/images/campus-drone.jpg">Vista Aérea Drone do Edifício</option>
                  <option value="/images/lab-students.jpg">Laboratório com Alunos</option>
                  <option value="/images/students-group-1.jpg">Alunos Uniformizados no Pátio</option>
                  <option value="/images/students-group-2.jpg">Grupo de Alunos de Enfermagem</option>
                  <option value="/images/practical-banner.jpg">Demonstração Prática</option>
                  <option value="/images/campus-detail-1.jpg">Fachada e Entrada</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Legenda (Opcional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Descrição informativa da fotografia..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1456A0] text-white font-bold rounded-xl"
                >
                  Adicionar à Galeria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group relative"
          >
            <div className="h-36 overflow-hidden bg-slate-100">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-3">
              <span className="text-[9px] font-bold uppercase text-[#F28C28] block">
                {photo.category}
              </span>
              <h4 className="font-bold text-xs text-[#10385F] truncate mt-0.5">{photo.title}</h4>
            </div>

            <button
              onClick={() => deleteGalleryPhoto(photo.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
              title="Remover fotografia"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
