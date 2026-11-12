import React, { useState } from 'react';
import { Award, Printer, CheckCircle2, AlertCircle, FileText, Calendar, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDisciplineAverage, determineAcademicStatus } from '../../utils/academic.ts';

type PeriodType = '1º Trimestre' | '2º Trimestre' | '3º Trimestre';

export const StudentResultados: React.FC = () => {
  const { currentStudent, minipautas } = useApp();
  const [selectedTrimester, setSelectedTrimester] = useState<PeriodType>('1º Trimestre');

  if (!currentStudent) return null;

  // Filter minipautas for this student's course and class
  const studentMinipautas = minipautas.filter(
    (m) => m.courseId === currentStudent.courseId && m.classId === currentStudent.classId
  );

  // Filter published ones for the selected period
  const publishedMinipautasForPeriod = studentMinipautas.filter(
    (m) => m.period === selectedTrimester && m.published
  );

  const unpublishedMinipautasForPeriod = studentMinipautas.filter(
    (m) => m.period === selectedTrimester && !m.published
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Boletim de Notas e Minipautas</h2>
          <p className="text-xs text-slate-500">
            Aproveitamento escolar oficial • Ano Letivo {currentStudent.academicYear} • {currentStudent.courseName}
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

      {/* Summary Card with Student Data */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Estudante Registado</span>
          <span className="text-lg font-black text-[#10385F]">{currentStudent.name}</span>
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span>N.º Matrícula: <strong className="text-slate-700 font-mono">{currentStudent.studentNumber}</strong></span>
            <span>•</span>
            <span>Turma: <strong className="text-slate-700">{currentStudent.classId}</strong></span>
            <span>•</span>
            <span>Classe: <strong className="text-slate-700">{currentStudent.classLevel}</strong></span>
          </div>
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

      {/* Selector of Trimester */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1456A0]" />
          <span className="text-xs font-bold text-[#10385F]">Consultar Minipauta Oficial por Período:</span>
        </div>

        <div className="flex gap-2">
          {(['1º Trimestre', '2º Trimestre', '3º Trimestre'] as PeriodType[]).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrimester(t)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTrimester === t
                  ? 'bg-[#1456A0] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Minipautas Section */}
      <div className="space-y-4">
        {publishedMinipautasForPeriod.length === 0 ? (
          <div className="p-8 bg-amber-50/70 border border-amber-200/80 rounded-3xl text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-amber-900">
              Minipauta do {selectedTrimester} em Processamento Pedagógico
            </h3>
            <p className="text-xs text-amber-700 max-w-lg mx-auto">
              As classificações detalhadas deste período ainda se encontram em fase de lançamento ou homologação pela Secretaria e Corpo Docente.
              Serão disponibilizadas para consulta individual assim que forem publicadas oficialmente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-sm font-bold text-[#10385F]">
                  Minipautas Publicadas — {selectedTrimester}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Pauta Homologada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedMinipautasForPeriod.map((mp) => {
                const myEntry = mp.entries.find((e) => e.studentNumber === currentStudent.studentNumber);
                return (
                  <div
                    key={mp.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#10385F]">{mp.disciplineName}</h4>
                        <span className="text-[11px] text-slate-400">
                          Turma {mp.classId} • {mp.classLevel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {mp.academicYear}
                      </span>
                    </div>

                    {myEntry ? (
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-semibold">MAC</span>
                          <span className="text-sm font-black text-slate-700">{myEntry.mac}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-semibold">NPP</span>
                          <span className="text-sm font-black text-slate-700">{myEntry.npp}</span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-semibold">NPT</span>
                          <span className="text-sm font-black text-slate-700">{myEntry.npt !== undefined ? myEntry.npt : '-'}</span>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <span className="text-[10px] text-[#1456A0] block font-bold">Média (MT)</span>
                          <span className="text-sm font-black text-[#1456A0]">{myEntry.notaFinal.toFixed(1)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        Classificação não lançada para esta disciplina.
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Fórmula: MT = (MAC + NPP + NPT) / 3</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Validado na Secretaria
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {unpublishedMinipautasForPeriod.length > 0 && (
          <div className="p-4 bg-slate-100/60 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>
                {unpublishedMinipautasForPeriod.length} disciplina(s) do {selectedTrimester} ainda em elaboração pelo corpo docente.
              </span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Aguardando publicação</span>
          </div>
        )}
      </div>

      {/* Global Academic Record Table */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#10385F]">Histórico Académico Global por Disciplina</h3>
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Disciplina</th>
                <th className="py-3.5 px-4">Docente Responsável</th>
                <th className="py-3.5 px-4 text-center">1.º Trimestre</th>
                <th className="py-3.5 px-4 text-center">2.º Trimestre</th>
                <th className="py-3.5 px-4 text-center">3.º Trimestre</th>
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
    </div>
  );
};
