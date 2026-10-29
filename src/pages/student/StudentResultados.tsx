import React from 'react';
import { Award, Printer, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDisciplineAverage, determineAcademicStatus } from '../../utils/academic.ts';

export const StudentResultados: React.FC = () => {
  const { currentStudent } = useApp();

  if (!currentStudent) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Boletim de Notas e Pauta</h2>
          <p className="text-xs text-slate-500">
            Aproveitamento escolar do ano letivo {currentStudent.academicYear} • {currentStudent.courseName}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-[#1456A0]" />
          <span>Imprimir Boletim Oficial</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estudante</span>
          <span className="text-lg font-black text-[#10385F]">{currentStudent.name}</span>
          <span className="text-xs text-slate-500 block">N.º Matrícula: {currentStudent.studentNumber}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Média Geral Ponderada</span>
            <span className="text-3xl font-black text-[#1456A0]">{currentStudent.overallAverage.toFixed(1)}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            {determineAcademicStatus(currentStudent.overallAverage)}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <th className="py-3.5 px-4">Disciplina</th>
              <th className="py-3.5 px-4">Docente Responsável</th>
              <th className="py-3.5 px-4 text-center">1.º Período</th>
              <th className="py-3.5 px-4 text-center">2.º Período</th>
              <th className="py-3.5 px-4 text-center">3.º Período</th>
              <th className="py-3.5 px-4 text-center">Média Anual</th>
              <th className="py-3.5 px-4 text-right">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentStudent.disciplines.map((disc) => {
              const avg = calculateDisciplineAverage(disc.grades);
              const status = determineAcademicStatus(avg);

              return (
                <tr key={disc.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-bold text-[#10385F]">{disc.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{disc.teacher || 'Docente titular'}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{disc.grades.periodo1}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{disc.grades.periodo2}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{disc.grades.periodo3}</td>
                  <td className="py-3.5 px-4 text-center font-black text-sm text-[#1456A0]">{avg.toFixed(1)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'Recurso'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
