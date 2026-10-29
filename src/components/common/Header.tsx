import React, { useState } from 'react';
import { Menu, GraduationCap, ShieldCheck, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { useApp, PublicRoute } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';
import { MobileMenu } from './MobileMenu.tsx';
import { Logo } from './Logo.tsx';

export const Header: React.FC = () => {
  const {
    publicRoute,
    setPublicRoute,
    activeSection,
    setActiveSection,
    setIsAuthModalOpen,
    setAuthModalTab,
    currentUser,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);

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
  };

  const handleOpenAuth = (tab: 'student-login' | 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
    setIsAccessDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
        {/* Top Institutional Notification Bar */}
        <div className="bg-[#10385F] text-white text-[11px] py-1.5 px-4 hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Matrículas abertas para a 10.ª e 11.ª classes
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">
                Bairro Social, Luena - Moxico (Zona Militar)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`tel:${INSTITUTION_INFO.phone1Raw}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#F28C28]" />
                <span>{INSTITUTION_INFO.phone1}</span>
              </a>
              <span className="text-slate-500">•</span>
              <a
                href={`https://wa.me/${INSTITUTION_INFO.phone1Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              <span className="text-slate-500">•</span>
              <span className="bg-[#1456A0] text-white px-2 py-0.5 rounded font-medium">
                Licença: {INSTITUTION_INFO.license}
              </span>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with official circular emblem */}
            <button
              onClick={() => handleNavClick('home')}
              className="group cursor-pointer text-left"
              aria-label="Ir para a página inicial do ITPSS"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === 'public' && publicRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer relative ${
                      isActive
                        ? 'text-[#1456A0] font-semibold'
                        : 'text-slate-600 hover:text-[#10385F] hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#1456A0] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Access dropdown (Student / Admin) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccessDropdownOpen(!isAccessDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#10385F] bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer border border-slate-200"
                  aria-expanded={isAccessDropdownOpen}
                  aria-haspopup="true"
                >
                  <GraduationCap className="w-4 h-4 text-[#1456A0]" />
                  <span>Áreas Restritas</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isAccessDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Acesso aos Portais
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAuth('student-login')}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#1456A0] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-[#1456A0]" />
                      <div>
                        <div className="font-semibold">Portal do Aluno</div>
                        <div className="text-[10px] text-slate-400">Consultar notas e horários</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleOpenAuth('admin')}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-[#F28C28] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
                      <div>
                        <div className="font-semibold">Painel Administrativo</div>
                        <div className="text-[10px] text-slate-400">Gestão e secretaria</div>
                      </div>
                    </button>

                    {currentUser && (
                      <div className="pt-2 mt-1 border-t border-slate-100 px-4 py-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccessDropdownOpen(false);
                          }}
                          className="text-[11px] text-rose-600 hover:underline cursor-pointer w-full text-left"
                        >
                          Terminar Sessão ({currentUser.name})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Matrículas Orange CTA Button */}
              <button
                onClick={() => handleNavClick('matriculas')}
                className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#e07b16] text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Matrículas</span>
              </button>
            </div>

            {/* Mobile Controls (Strictly identity and hamburger menu) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 text-slate-700 hover:text-[#10385F] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Abrir menu de navegação"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Hamburger Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
