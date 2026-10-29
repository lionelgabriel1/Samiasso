import React from 'react';
import { Phone, MessageSquare, MapPin, Shield, GraduationCap, Lock } from 'lucide-react';
import { useApp, PublicRoute } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';
import { Logo } from './Logo.tsx';

export const Footer: React.FC = () => {
  const { setPublicRoute, setActiveSection, setIsAuthModalOpen, setAuthModalTab } = useApp();

  const handleLink = (route: PublicRoute) => {
    setActiveSection('public');
    setPublicRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (tab: 'student-login' | 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <footer className="bg-[#10385F] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo size="md" light={true} />

            <p className="text-xs text-slate-300 leading-relaxed">
              Formando profissionais de excelência e compromisso ético para os desafios da saúde no Moxico e em Angola.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#0b2743] px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300">
              <Shield className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Licença Oficial N.º {INSTITUTION_INFO.license}</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C28] mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('sobre')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sobre o Instituto
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('cursos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cursos Disponíveis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('matriculas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Matrículas e Inscrições
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('noticias')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Notícias e Comunicados
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('galeria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Galeria de Fotografias
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contactos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contactos e Localização
                </button>
              </li>
            </ul>
          </div>

          {/* Contacts & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C28] mb-4">
              Contactos Oficiais
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {INSTITUTION_INFO.locationText}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F28C28] shrink-0" />
                <div className="space-y-0.5">
                  <a href={`tel:${INSTITUTION_INFO.phone1Raw}`} className="block hover:text-white">
                    {INSTITUTION_INFO.phone1}
                  </a>
                  <a href={`tel:${INSTITUTION_INFO.phone2Raw}`} className="block hover:text-white">
                    {INSTITUTION_INFO.phone2}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${INSTITUTION_INFO.phone1Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Oficial</span>
                </a>
              </div>
            </div>
          </div>

          {/* Portals Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28C28] mb-4">
              Áreas Restritas
            </h4>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              Acesso reservado aos alunos matriculados e corpo administrativo.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => openAuth('student-login')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer border border-white/10"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  Portal do Aluno
                </span>
                <span className="text-[10px] text-slate-400">Entrar →</span>
              </button>

              <button
                onClick={() => openAuth('admin')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors cursor-pointer border border-white/10"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#F28C28]" />
                  Painel Administrativo
                </span>
                <span className="text-[10px] text-slate-400">Gestão →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ITPSS — Instituto Técnico Privado de Saúde Samiasso. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Luena, Moxico — Angola</span>
            <span>•</span>
            <span>Licença 225/2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
