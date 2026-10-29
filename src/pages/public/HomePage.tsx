import React from 'react';
import {
  GraduationCap,
  Users,
  Building2,
  Award,
  ArrowRight,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';
import { formatKwanza } from '../../utils/academic.ts';

export const HomePage: React.FC = () => {
  const { courses, setPublicRoute, setLightboxPhoto, setSelectedCourseForEnrollment } = useApp();

  const goTo = (route: any, courseId?: string) => {
    if (courseId) {
      setSelectedCourseForEnrollment(courseId);
    }
    setPublicRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* 1. HERO SECTION WITH REAL DRONE AERIAL PHOTOGRAPHY */}
      <section className="relative bg-[#10385F] text-white overflow-hidden">
        {/* Drone Image Background with subtle dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/campus-drone.jpg"
            alt="Fotografia aérea do Instituto Técnico Privado de Saúde Samiasso"
            className="w-full h-full object-cover object-center opacity-30 md:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/90 to-[#10385F]/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            {/* License Official Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-pulse" />
              <span>Licença Oficial N.º {INSTITUTION_INFO.license}</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-300">Luena, Moxico</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 animate-fade-in-up font-heading">
              Formamos profissionais de saúde para um{' '}
              <span className="text-[#F28C28]">futuro melhor</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl font-normal animate-fade-in-up stagger-1">
              No Instituto Técnico Privado de Saúde Samiasso (ITPSS), preparamos jovens para construírem carreiras sólidas na área da saúde, com formação técnica, prática e de qualidade.
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up stagger-2">
              <button
                onClick={() => goTo('matriculas')}
                className="px-6 py-3.5 bg-[#F28C28] hover:bg-[#e07b16] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 btn-tactile cursor-pointer flex items-center gap-2"
              >
                <span>Inscrições Abertas</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => goTo('cursos')}
                className="px-6 py-3.5 bg-[#1456A0] hover:bg-[#0f427c] text-white font-semibold text-sm rounded-xl border border-white/20 btn-tactile cursor-pointer flex items-center gap-2"
              >
                <span>Conheça os Cursos</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Feature Items Pill Bar Below Hero */}
        <div className="relative z-10 border-t border-white/10 bg-[#0b2743]/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1456A0] flex items-center justify-center shrink-0 text-[#F28C28]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span>Formação técnica e especializada</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1456A0] flex items-center justify-center shrink-0 text-[#F28C28]">
                  <Users className="w-5 h-5" />
                </div>
                <span>Corpo docente qualificado</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1456A0] flex items-center justify-center shrink-0 text-[#F28C28]">
                  <Building2 className="w-5 h-5" />
                </div>
                <span>Infraestrutura moderna</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1456A0] flex items-center justify-center shrink-0 text-[#F28C28]">
                  <Award className="w-5 h-5" />
                </div>
                <span>Compromisso com a excelência</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. O ITPSS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Real Lab Students Image Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 group">
              <img
                src="/images/lab-students.jpg"
                alt="Alunos do ITPSS em aula prática no laboratório"
                className="w-full h-[360px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10385F]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                Aulas práticas com microscopia e equipamentos clínicos no campus do Luena
              </div>
            </div>

            {/* Institution Description & Stats */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1456A0]">
                <Sparkles className="w-4 h-4 text-[#F28C28]" />
                <span>Sobre o Instituto</span>
              </div>

              <h2 className="text-3xl font-extrabold text-[#10385F] tracking-tight">
                O ITPSS
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                O Instituto Técnico Privado de Saúde Samiasso (ITPSS) é uma instituição de ensino técnico, comprometida com a formação de profissionais de saúde, com foco na qualidade, na ética e na prática.
              </p>

              {/* 3 Metrics Badge Bar */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200/80 text-center">
                  <div className="flex items-center justify-center text-[#1456A0] mb-1">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-[#10385F]">3</div>
                  <div className="text-xs font-medium text-slate-500">Cursos</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200/80 text-center">
                  <div className="flex items-center justify-center text-[#1456A0] mb-1">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-[#10385F]">10.ª e 11.ª</div>
                  <div className="text-xs font-medium text-slate-500">Classes</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200/80 text-center">
                  <div className="flex items-center justify-center text-[#1456A0] mb-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xl font-black text-[#10385F]">Luena</div>
                  <div className="text-xs font-medium text-slate-500">Moxico</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => goTo('sobre')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#1456A0] hover:text-[#10385F] group cursor-pointer"
                >
                  <span>Saiba mais sobre o Instituto</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F28C28]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOSSOS CURSOS SECTION */}
      <section className="py-20 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-[#10385F] tracking-tight mb-3">
              Nossos Cursos
            </h2>
            <p className="text-slate-600 text-base">
              Escolha a formação que vai construir o seu futuro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs img-card-interactive border border-slate-200/80 flex flex-col group cursor-pointer"
                onClick={() => goTo('matriculas', course.id)}
              >
                {/* Course Image */}
                <div className="relative h-48 img-zoom-container bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#10385F]/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    10ª e 11ª Classes
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#10385F] mb-2 group-hover:text-[#1456A0] transition-colors font-heading">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Mensalidade
                      </span>
                      <span className="text-lg font-black text-[#1456A0]">
                        {formatKwanza(course.monthlyFee)}
                        <span className="text-xs font-normal text-slate-500">/mês</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo('matriculas', course.id);
                      }}
                      className="text-xs font-bold text-[#1456A0] hover:text-[#F28C28] flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => goTo('cursos')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Ver detalhes completos e outros pagamentos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. APRENDIZAGEM PRÁTICA BANNER */}
      <section className="relative py-20 bg-[#10385F] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/practical-banner.jpg"
            alt="Aprendizagem prática no ITPSS"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] block mb-2">
              Formação de Excelência
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Aprendizagem prática
            </h2>
            <p className="text-base text-slate-200 leading-relaxed mb-6 font-normal">
              Aulas laboratoriais, simulações e contacto com a realidade da área da saúde. Os nossos estudantes adquirem segurança e capacidade técnica desde as primeiras semanas de curso.
            </p>
            <button
              onClick={() => goTo('sobre')}
              className="px-6 py-3 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Ver mais</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. VIDA ACADÉMICA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1456A0] block mb-1">
                Comunidade Estudantil
              </span>
              <h2 className="text-3xl font-extrabold text-[#10385F] tracking-tight">
                Vida Académica
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Mais do que uma escola, somos uma comunidade.
              </p>
            </div>

            <button
              onClick={() => goTo('galeria')}
              className="mt-4 md:mt-0 text-xs font-bold text-[#1456A0] hover:text-[#F28C28] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver galeria completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() =>
                setLightboxPhoto({
                  id: 'life-1',
                  title: 'Alunos do ITPSS no Pátio Escolar',
                  category: 'Alunos',
                  url: '/images/students-group-1.jpg',
                  caption: 'Convivência saudável e formação cívica no campus do Luena.',
                  date: 'Ano Letivo 2026',
                })
              }
              className="rounded-2xl overflow-hidden shadow-xs img-card-interactive group cursor-pointer border border-slate-100 bg-white"
            >
              <div className="h-60 img-zoom-container bg-slate-100">
                <img
                  src="/images/students-group-1.jpg"
                  alt="Estudantes do ITPSS"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h4 className="text-sm font-bold text-[#10385F] group-hover:text-[#1456A0] transition-colors font-heading">
                  Comunidade e Coleguismo
                </h4>
                <p className="text-xs text-slate-500 mt-1">Integração estudantil no campus</p>
              </div>
            </div>

            <div
              onClick={() =>
                setLightboxPhoto({
                  id: 'life-2',
                  title: 'Turma em Uniforme Institucional',
                  category: 'Alunos',
                  url: '/images/students-group-2.jpg',
                  caption: 'Futuros profissionais de saúde com a bata oficial.',
                  date: 'Ano Letivo 2026',
                })
              }
              className="rounded-2xl overflow-hidden shadow-xs img-card-interactive group cursor-pointer border border-slate-100 bg-white"
            >
              <div className="h-60 img-zoom-container bg-slate-100">
                <img
                  src="/images/students-group-2.jpg"
                  alt="Turma de saúde do ITPSS"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h4 className="text-sm font-bold text-[#10385F] group-hover:text-[#1456A0] transition-colors font-heading">
                  Turmas Práticas
                </h4>
                <p className="text-xs text-slate-500 mt-1">Aulas direcionadas à prática profissional</p>
              </div>
            </div>

            <div
              onClick={() =>
                setLightboxPhoto({
                  id: 'life-3',
                  title: 'Atividades Práticas de Saúde',
                  category: 'Laboratórios',
                  url: '/images/students-group-3.jpg',
                  caption: 'Simulações e procedimentos práticos em ambiente formativo.',
                  date: 'Ano Letivo 2026',
                })
              }
              className="rounded-2xl overflow-hidden shadow-xs img-card-interactive group cursor-pointer border border-slate-100 bg-white"
            >
              <div className="h-60 img-zoom-container bg-slate-100">
                <img
                  src="/images/students-group-3.jpg"
                  alt="Formação prática"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-white">
                <h4 className="text-sm font-bold text-[#10385F] group-hover:text-[#1456A0] transition-colors font-heading">
                  Laboratório de Simulação
                </h4>
                <p className="text-xs text-slate-500 mt-1">Ambientes preparados para o treino clínico</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALLOUT DUAL BANNER: ENROLLMENT + CONTACTS */}
      <section className="py-14 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Orange Enrollment Card */}
            <div className="lg:col-span-7 bg-[#F28C28] text-white p-8 md:p-10 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-100 block mb-2">
                  Ano Letivo 2026
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Inscrições e matrículas abertas para a 10.ª e 11.ª classes
                </h3>
                <p className="text-sm text-amber-50 leading-relaxed max-w-lg mb-6">
                  Garanta a sua vaga nos cursos de Enfermagem Geral, Análises Clínicas e Cardiopneumologia no Luena.
                </p>
              </div>

              <div>
                <button
                  onClick={() => goTo('matriculas')}
                  className="px-6 py-3 bg-[#10385F] hover:bg-[#0b2743] text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Fazer pré-inscrição</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navy Contact Card */}
            <div className="lg:col-span-5 bg-[#10385F] text-white p-8 md:p-10 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] block mb-2">
                  Atendimento Oficial
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight mb-3">
                  Fale connosco
                </h3>
                <div className="space-y-2 mb-6">
                  <a
                    href={`tel:${INSTITUTION_INFO.phone1Raw}`}
                    className="flex items-center gap-3 text-slate-200 hover:text-white text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#F28C28]" />
                    <span>{INSTITUTION_INFO.phone1}</span>
                  </a>
                  <a
                    href={`tel:${INSTITUTION_INFO.phone2Raw}`}
                    className="flex items-center gap-3 text-slate-200 hover:text-white text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#F28C28]" />
                    <span>{INSTITUTION_INFO.phone2}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${INSTITUTION_INFO.phone1Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Conversar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
