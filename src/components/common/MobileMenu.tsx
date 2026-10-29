import React, { useEffect } from 'react';
import { X, GraduationCap, ShieldCheck, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp, PublicRoute } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';
import { Logo } from './Logo.tsx';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const {
    publicRoute,
    setPublicRoute,
    setActiveSection,
    setIsAuthModalOpen,
    setAuthModalTab,
    currentUser,
    logout,
  } = useApp();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks: { label: string; route: PublicRoute }[] = [
    { label: 'Início', route: 'home' },
    { label: 'Sobre', route: 'sobre' },
    { label: 'Cursos', route: 'cursos' },
    { label: 'Matrículas', route: 'matriculas' },
    { label: 'Notícias', route: 'noticias' },
    { label: 'Galeria', route: 'galeria' },
    { label: 'Contactos', route: 'contactos' },
  ];

  const handleNavClick = (route: PublicRoute) => {
    setActiveSection('public');
    setPublicRoute(route);
    onClose();
  };

  const handleOpenAuth = (tab: 'student-login' | 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal de navegação"
      className="fixed inset-0 z-50 flex flex-col bg-[#10385F] text-white overflow-y-auto animate-in fade-in duration-200 lg:hidden"
    >
      {/* Header Inside Mobile Drawer */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <Logo size="sm" light={true} />

        <button
          onClick={onClose}
          className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Fechar menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Links */}
      <div className="flex-1 px-6 py-6 flex flex-col justify-between">
        <nav aria-label="Navegação móvel" className="space-y-1">
          {navLinks.map((link) => {
            const isActive = publicRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#1456A0] text-white shadow-md'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#F28C28]" />}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Access Area */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
          {/* Matrículas Orange CTA */}
          <button
            onClick={() => handleNavClick('matriculas')}
            className="w-full py-3.5 px-4 bg-[#F28C28] hover:bg-[#e07b16] active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Matrículas Abertas (10ª e 11ª)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Area Portals */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleOpenAuth('student-login')}
              className="py-3 px-3 bg-[#1456A0]/80 hover:bg-[#1456A0] rounded-xl text-xs font-semibold text-white flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <GraduationCap className="w-5 h-5 text-sky-300" />
              <span>Portal do Aluno</span>
            </button>

            <button
              onClick={() => handleOpenAuth('admin')}
              className="py-3 px-3 bg-[#0b2743] hover:bg-black/30 rounded-xl text-xs font-semibold text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <ShieldCheck className="w-5 h-5 text-[#F28C28]" />
              <span>Painel Admin</span>
            </button>
          </div>

          {/* Direct WhatsApp & Telephone contacts */}
          <div className="pt-4 flex flex-col gap-2">
            <a
              href={`https://wa.me/${INSTITUTION_INFO.phone1Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Fale connosco no WhatsApp</span>
            </a>

            <a
              href={`tel:${INSTITUTION_INFO.phone1Raw}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F28C28]" />
              <span>{INSTITUTION_INFO.phone1}</span>
            </a>
          </div>

          {currentUser && (
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="text-xs text-rose-300 hover:underline cursor-pointer"
              >
                Terminar Sessão ({currentUser.name})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
