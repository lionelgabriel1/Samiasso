import React from 'react';
import { Shield, MapPin, Award, ArrowRight, Sparkles, Building, Compass, Eye, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';

export const SobrePage: React.FC = () => {
  const { setPublicRoute, setLightboxPhoto } = useApp();

  const navigate = (route: any) => {
    setPublicRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Page Hero Header */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/medical-staff.jpg"
            alt="Profissionais de saúde Samiasso"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/90 to-[#10385F]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <button
              onClick={() => navigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <span>&gt;</span>
            <span className="text-[#F28C28] font-semibold">Sobre</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Sobre o ITPSS
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Compromisso com a formação de profissionais de saúde.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Quem Somos */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1456A0] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Identidade Institucional</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F]">
                Quem somos
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                O Instituto Técnico Privado de Saúde Samiasso (ITPSS) é uma instituição de ensino técnico que oferece formação de qualidade na área da saúde, preparando profissionais competentes, éticos e preparados para os desafios do mercado de trabalho.
              </p>

              <p className="text-slate-600 text-sm leading-relaxed">
                Localizada no Bairro Social, na cidade do Luena, província do Moxico, a instituição nasceu para responder à crescente necessidade de técnicos médios qualificados e humanizados nas diversas unidades hospitalares e centros de diagnóstico clínico da região leste de Angola.
              </p>

              {/* Badges Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F4F6F9] border border-slate-200/80">
                  <div className="p-2 rounded-xl bg-blue-100 text-[#1456A0] shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Licença
                    </span>
                    <span className="text-sm font-extrabold text-[#10385F]">
                      {INSTITUTION_INFO.license}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F4F6F9] border border-slate-200/80">
                  <div className="p-2 rounded-xl bg-orange-100 text-[#F28C28] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Localização
                    </span>
                    <span className="text-sm font-extrabold text-[#10385F]">
                      Luena • Moxico
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F4F6F9] border border-slate-200/80">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Tipo
                    </span>
                    <span className="text-sm font-extrabold text-[#10385F]">
                      Ensino Técnico
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aerial Campus Image */}
            <div className="lg:col-span-5">
              <div
                onClick={() =>
                  setLightboxPhoto({
                    id: 'sobre-drone',
                    title: 'Instalações do ITPSS no Luena, Moxico',
                    category: 'Instalações',
                    url: '/images/campus-aerial-sobre.jpg',
                    caption: 'Vista aérea oficial do campus escolar no Bairro Social.',
                    date: '2026',
                  })
                }
                className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 img-card-interactive img-zoom-container group cursor-pointer"
              >
                <img
                  src="/images/campus-aerial-sobre.jpg"
                  alt="Campus escolar ITPSS no Luena"
                  loading="lazy"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300">
                  <span className="text-xs text-white font-medium">
                    Campus escolar no Bairro Social, atrás do antigo Baúca
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estrutura e Instalações */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1456A0]">
                <Building className="w-4 h-4 text-[#F28C28]" />
                <span>Espaço de Aprendizagem</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F] font-heading">
                Estrutura e Instalações
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Contamos com salas de aula, laboratórios e espaços adequados para uma formação prática e de qualidade, proporcionando o ambiente certo para o desenvolvimento de competências clínicas.
              </p>

              <div>
                <button
                  onClick={() => navigate('cursos')}
                  className="px-6 py-3 bg-[#10385F] hover:bg-[#1456A0] text-white text-xs font-bold rounded-xl shadow btn-tactile cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Conheça os cursos</span>
                  <ArrowRight className="w-4 h-4 text-[#F28C28] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Grid of 3 Campus Photos */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div
                onClick={() =>
                  setLightboxPhoto({
                    id: 'dt-1',
                    title: 'Pátio e Fachada Principal',
                    category: 'Instalações',
                    url: '/images/campus-detail-1.jpg',
                    caption: 'Entrada do Instituto Técnico Privado de Saúde Samiasso.',
                    date: '2026',
                  })
                }
                className="rounded-2xl overflow-hidden shadow-xs img-card-interactive img-zoom-container group cursor-pointer border border-slate-100"
              >
                <img
                  src="/images/campus-detail-1.jpg"
                  alt="Instalações ITPSS"
                  loading="lazy"
                  className="w-full h-44 object-cover"
                />
              </div>

              <div
                onClick={() =>
                  setLightboxPhoto({
                    id: 'dt-2',
                    title: 'Laboratórios de Saúde',
                    category: 'Laboratórios',
                    url: '/images/lab-students.jpg',
                    caption: 'Salas com bancadas e instrumentos para aulas práticas.',
                    date: '2026',
                  })
                }
                className="rounded-2xl overflow-hidden shadow-xs img-card-interactive img-zoom-container group cursor-pointer border border-slate-100"
              >
                <img
                  src="/images/lab-students.jpg"
                  alt="Laboratórios ITPSS"
                  loading="lazy"
                  className="w-full h-44 object-cover"
                />
              </div>

              <div
                onClick={() =>
                  setLightboxPhoto({
                    id: 'dt-3',
                    title: 'Bloco de Salas e Convivência',
                    category: 'Instalações',
                    url: '/images/campus-detail-2.jpg',
                    caption: 'Espaços dedicados ao estudo e formação cívica.',
                    date: '2026',
                  })
                }
                className="col-span-2 rounded-2xl overflow-hidden shadow-xs img-card-interactive img-zoom-container group cursor-pointer border border-slate-100"
              >
                <img
                  src="/images/campus-detail-2.jpg"
                  alt="Estrutura e bloco ITPSS"
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Pillars - Explicitly 'Em construção' matching mockup & instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] mx-auto flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#10385F] text-base mb-1">Missão</h3>
            <p className="text-xs text-slate-400 font-medium italic">Em construção</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] mx-auto flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#10385F] text-base mb-1">Visão</h3>
            <p className="text-xs text-slate-400 font-medium italic">Em construção</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] mx-auto flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#10385F] text-base mb-1">Valores</h3>
            <p className="text-xs text-slate-400 font-medium italic">Em construção</p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#10385F] text-white p-8 sm:p-12 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Juntos construímos um futuro na saúde</h3>
            <p className="text-slate-300 text-sm max-w-lg">
              Conheça os nossos cursos para a 10.ª e 11.ª classes e inscreva-se hoje mesmo.
            </p>
          </div>
          <button
            onClick={() => navigate('cursos')}
            className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer shrink-0"
          >
            Ver cursos →
          </button>
        </div>
      </div>
    </div>
  );
};
