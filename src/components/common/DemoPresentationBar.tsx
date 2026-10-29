import React, { useState } from 'react';
import { Globe, ShieldCheck, GraduationCap, RotateCcw, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const DemoPresentationBar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    setAdminRoute,
    setStudentRoute,
    resetDemoData,
    isDemoBarVisible,
    setIsDemoBarVisible,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDemoBarVisible) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#10385F] text-white shadow-xl border border-white/20 text-xs font-bold hover:bg-[#1456A0] transition-all cursor-pointer"
          title="Abrir barra de controlo de apresentação"
        >
          <Layers className="w-4 h-4 text-[#F28C28]" />
          <span>Apresentação ITPSS</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-[#0b2743]/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg text-xs py-1.5 px-4 animate-in slide-in-from-top-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Presentation Badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[#F28C28] uppercase tracking-wider text-[10px]">
              Apresentação à Direção
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">
              Ambiente de Demonstração Interativo
            </span>
          </div>
        </div>

        {/* Center: 1-Click View Switchers for Smooth Live Demo */}
        <div className="flex items-center gap-1.5 bg-[#10385F] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveSection('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSection === 'public'
                ? 'bg-[#1456A0] text-white shadow-sm ring-1 ring-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Website Público</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection('admin');
              setAdminRoute('dashboard');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSection === 'admin'
                ? 'bg-[#F28C28] text-white shadow-sm ring-1 ring-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel de Gestão (Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection('student');
              setStudentRoute('visao-geral');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              activeSection === 'student'
                ? 'bg-[#1456A0] text-white shadow-sm ring-1 ring-white/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-300" />
            <span>Portal do Estudante</span>
          </button>
        </div>

        {/* Right: Quick Reset and Minimize */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Repor mensalidades, notas e notícias para os valores de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#F28C28]" />
            <span className="hidden md:inline">Repor Dados</span>
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Minimizar barra"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
