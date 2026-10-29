import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, FileText, CreditCard, Shirt } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { formatKwanza } from '../../utils/academic.ts';

export const CursosPage: React.FC = () => {
  const { courses, paymentItems, setPublicRoute, setSelectedCourseForEnrollment } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header Banner */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/practical-banner.jpg"
            alt="Cursos técnicos de saúde"
            className="w-full h-full object-cover opacity-25"
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
            <span className="text-[#F28C28] font-semibold">Cursos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Cursos
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Formação técnica e especializada na área da saúde.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 3 Main Course Cards */}
        <div>
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F] tracking-tight">
              Oferta Formativa Oficial
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Matrículas abertas para a 10.ª e 11.ª classes com certificação técnica média oficial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xs img-card-interactive border border-slate-200/80 flex flex-col group"
              >
                <div className="relative h-56 bg-slate-100 img-zoom-container">
                  <img
                    src={course.image}
                    alt={course.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#1456A0] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    Técnico Médio de Saúde
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#10385F] mb-3 group-hover:text-[#1456A0] transition-colors font-heading">
                      {course.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {course.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Foco Prático e Laboratorial
                      </h4>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {course.practicalFocus}
                      </p>
                    </div>

                    <div className="space-y-2 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Saídas Profissionais
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {course.careerOpportunities.map((op, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{op}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Mensalidade Oficial
                      </span>
                      <span className="text-2xl font-black text-[#1456A0]">
                        {formatKwanza(course.monthlyFee)}
                        <span className="text-xs font-normal text-slate-500">/mês</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCourseForEnrollment(course.id);
                        setPublicRoute('matriculas');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow btn-tactile cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Fazer Pré-Inscrição</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outros Pagamentos Section matching mockup */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-slate-200/80">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1456A0] block mb-1">
              Transparência de Custos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F]">
              Outros pagamentos
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Valores únicos de ingresso e identificação escolar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentItems.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-center gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1456A0] shrink-0 border border-slate-200/60">
                  {item.icon === 'shirt' && <Shirt className="w-6 h-6" />}
                  {item.icon === 'card' && <CreditCard className="w-6 h-6" />}
                  {item.icon === 'file' && <FileText className="w-6 h-6" />}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#10385F]">{item.name}</h3>
                  <div className="text-lg font-black text-[#1456A0] mt-0.5">
                    {formatKwanza(item.price)}
                  </div>
                  <span className="text-[11px] text-slate-500">{item.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Callout */}
        <div className="bg-[#10385F] text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs text-[#F28C28] font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Apoio ao Estudante e Encarregados</span>
            </div>
            <h3 className="text-2xl font-extrabold">
              Tire as suas dúvidas sobre os cursos e mensalidades
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              A nossa equipa de secretaria pedagógica está disponível para prestar todos os esclarecimentos presenciais ou por telefone.
            </p>
          </div>

          <button
            onClick={() => setPublicRoute('contactos')}
            className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer shrink-0 flex items-center gap-2"
          >
            <span>Entrar em contacto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
