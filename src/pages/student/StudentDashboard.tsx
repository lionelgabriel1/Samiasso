import React from 'react';
import {
  Award,
  Clock,
  Calendar,
  Bell,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDisciplineAverage, determineAcademicStatus } from '../../utils/academic.ts';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, schedule, notices, setStudentRoute } = useApp();

  if (!currentStudent) {
    return <div className="p-8">Carregando dados do aluno...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner matching mockup */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider block mb-1">
            Ano Letivo {currentStudent.academicYear}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#10385F]">
            Bem-vindo(a), {currentStudent.name.split(' ')[0]}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curso: <strong>{currentStudent.courseName}</strong> | Turma: <strong>{currentStudent.classId}</strong> | N.º {currentStudent.studentNumber}
          </p>
        </div>

        {/* 2 Top Metric Badges matching mockup */}
        <div className="flex items-center gap-4">
          {/* Média Geral */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 min-w-32 text-center">
            <span className="text-[11px] font-bold text-[#1456A0] uppercase tracking-wider block">
              Média Geral
            </span>
            <div className="text-3xl font-black text-[#10385F] mt-0.5">
              {currentStudent.overallAverage.toFixed(1)}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {determineAcademicStatus(currentStudent.overallAverage)}
            </span>
          </div>

          {/* Assiduidade */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 min-w-32 text-center">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Assiduidade
            </span>
            <div className="text-3xl font-black text-emerald-800 mt-0.5">
              {currentStudent.attendanceRate}%
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">Regular</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Últimos Resultados on Left, Horários e Comunicados on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table: Últimos Resultados */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#10385F]">Últimos Resultados</h3>
              <p className="text-xs text-slate-400">Pauta de avaliações trimestrais contínuas</p>
            </div>
            <button
              onClick={() => setStudentRoute('resultados')}
              className="text-xs font-bold text-[#1456A0] hover:underline cursor-pointer"
            >
              Ver pauta completa →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Disciplina</th>
                  <th className="py-3 px-3 text-center">1º Período</th>
                  <th className="py-3 px-3 text-center">2º Período</th>
                  <th className="py-3 px-3 text-center">3º Período</th>
                  <th className="py-3 px-3 text-right">Média</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentStudent.disciplines.map((item) => {
                  const avg = calculateDisciplineAverage(item.grades);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-[#10385F]">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-600">
                        {item.grades.periodo1}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-600">
                        {item.grades.periodo2}
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-600">
                        {item.grades.periodo3}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-sm text-[#1456A0]">
                        {avg.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Próximos Horários & Comunicados Recentes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Próximos Horários matching mockup */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#10385F]">Próximos Horários</h3>
              <button
                onClick={() => setStudentRoute('horario')}
                className="text-xs font-bold text-[#1456A0] hover:underline"
              >
                Horário completo
              </button>
            </div>

            <div className="space-y-2.5">
              {schedule.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100/60 text-[#1456A0] shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-[#10385F] block">{item.subject}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.time} • {item.day}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 font-mono">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comunicados Recentes matching mockup */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#10385F]">Comunicados Recentes</h3>
              <button
                onClick={() => setStudentRoute('comunicados')}
                className="text-xs font-bold text-[#1456A0] hover:underline"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {notices.slice(0, 2).map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
                    <span className="font-bold text-[#10385F]">{notice.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Bottom Card matching mockup */}
      <div className="relative rounded-3xl overflow-hidden bg-[#10385F] text-white p-8 sm:p-10 shadow-lg">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/practical-banner.jpg"
            alt="Futuro na saúde"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-lg space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#F28C28] block">
            Vocação e Ética Profissional
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            O seu esforço também salva vidas.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Juntos construímos um futuro melhor para a saúde do Moxico e de Angola.
          </p>
        </div>
      </div>
    </div>
  );
};
