import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  Calendar,
  Lock,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDisciplineAverage, determineAcademicStatus } from '../../utils/academic.ts';
import {
  downloadExcelBuffer,
  exportStudentResultsWorkbook,
  getStudentPublishedPautas,
} from '../../utils/pautaGeral.ts';
import { PautaPeriod } from '../../types/index.ts';

type PeriodType = '1º Trimestre' | '2º Trimestre' | '3º Trimestre';

export const StudentResultados: React.FC = () => {
  const { currentStudent, minipautas, pautasGerais, showToast } = useApp();
  const [selectedTrimester, setSelectedTrimester] = useState<PeriodType>('1º Trimestre');

  if (!currentStudent) return null;

  // Strict Student Isolation: ONLY published Pautas Gerais matching this student's Matrícula
  const myPublishedPautas = getStudentPublishedPautas(
    pautasGerais,
    currentStudent.studentNumber
  );

  // Filter minipautas for this student's course and class
  const studentMinipautas = minipautas.filter(
    (m) => m.courseId === currentStudent.courseId && m.classId === currentStudent.classId
  );

  const publishedMinipautasForPeriod = studentMinipautas.filter(
    (m) => m.period === selectedTrimester && m.published
  );

  const unpublishedMinipautasForPeriod = studentMinipautas.filter(
    (m) => m.period === selectedTrimester && !m.published
  );

  const handleExportMyResults = () => {
    const buffer = exportStudentResultsWorkbook(currentStudent, myPublishedPautas, 'xlsx');
    downloadExcelBuffer(
      buffer,
      `Boletim_${currentStudent.studentNumber}_${currentStudent.name.replace(/\s+/g, '_')}.xlsx`
    );
    showToast('Boletim individual exportado em Excel (.xlsx).');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Boletim de Notas e Pautas Publicadas</h2>
          <p className="text-xs text-slate-500">
            Aproveitamento escolar oficial · Ano Letivo {currentStudent.academicYear} · {currentStudent.courseName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportMyResults}
            className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Boletim (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4 text-[#1456A0]" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Summary Card with Student Data */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Estudante Registado
          </span>
          <span className="text-lg font-black text-[#10385F]">{currentStudent.name}</span>
          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
            <span>
              N.º Matrícula:{' '}
              <strong className="text-slate-700 font-mono">{currentStudent.studentNumber}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Turma: <strong className="text-slate-700">{currentStudent.classId}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Classe: <strong className="text-slate-700">{currentStudent.classLevel}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Média Geral Ponderada
            </span>
            <span className="text-3xl font-black text-[#1456A0] tabular-nums">
              {currentStudent.overallAverage.toFixed(1)}
            </span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
            {determineAcademicStatus(currentStudent.overallAverage)}
          </div>
        </div>
      </div>

      {/* Published Pautas Gerais Section (Strictly Student-Scoped & Published-Only) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#10385F] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#1456A0]" />
            <span>Pautas Gerais Publicadas pela Secretaria</span>
          </h3>
          <span className="text-xs text-slate-500 tabular-nums">
            {myPublishedPautas.length} pauta(s) disponível(eis)
          </span>
        </div>

        {myPublishedPautas.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-400 shrink-0" />
            <span>
              Ainda não existem Pautas Gerais publicadas para a sua matrícula neste momento. Apenas resultados homologados e publicados pela Secretaria ficam visíveis aqui.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myPublishedPautas.map((pauta) => (
              <div
                key={pauta.pautaId}
                className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#10385F]">
                      {pauta.period} · {pauta.academicYear}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {pauta.courseName} · {pauta.classLevel} · Turma {pauta.classId} · Versão v{pauta.version}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publicada em {pauta.publishedAt}</span>
                    </span>
                    <span className="font-black text-[#1456A0] tabular-nums">
                      Média: {pauta.myRow.average.toFixed(1)} ({pauta.myRow.status})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {pauta.disciplines.map((disc) => {
                    const grade = pauta.myRow.grades[disc];
                    return (
                      <div
                        key={disc}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <span className="text-[11px] font-semibold text-slate-600 block truncate">
                          {disc}
                        </span>
                        <span className="text-lg font-black text-[#10385F] mt-1 block tabular-nums">
                          {grade !== undefined ? grade.toFixed(1) : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selector of Trimester for Minipautas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1456A0]" />
          <span className="text-xs font-bold text-[#10385F]">
            Consultar Minipauta Oficial por Período:
          </span>
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
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#10385F]">
                Minipautas Publicadas — {selectedTrimester}
              </h3>
              <span className="text-[11px] font-bold text-emerald-700">
                Pauta Homologada
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedMinipautasForPeriod.map((mp) => {
                const myEntry = mp.entries.find(
                  (e) => e.studentNumber === currentStudent.studentNumber
                );
                return (
                  <div
                    key={mp.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#10385F]">
                          {mp.disciplineName}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          Turma {mp.classId} · {mp.classLevel}
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
                          <span className="text-sm font-black text-slate-700 tabular-nums">
                            {myEntry.mac}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-semibold">NPP</span>
                          <span className="text-sm font-black text-slate-700 tabular-nums">
                            {myEntry.npp}
                          </span>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                          <span className="text-[10px] text-slate-400 block font-semibold">NPT</span>
                          <span className="text-sm font-black text-slate-700 tabular-nums">
                            {myEntry.npt !== undefined ? myEntry.npt : '-'}
                          </span>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-xl">
                          <span className="text-[10px] text-[#1456A0] block font-bold">
                            Média (MT)
                          </span>
                          <span className="text-sm font-black text-[#1456A0] tabular-nums">
                            {myEntry.notaFinal.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-2">
                        Classificação não lançada para esta matrícula.
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
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Aguardando publicação
            </span>
          </div>
        )}
      </div>

      {/* Global Academic Record Table */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#10385F]">
          Histórico Académico Global por Disciplina
        </h3>
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
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
                      <td className="py-3.5 px-4 text-slate-500">
                        {disc.teacher || 'Docente titular'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 tabular-nums">
                        {disc.grades.periodo1}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 tabular-nums">
                        {disc.grades.periodo2}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 tabular-nums">
                        {disc.grades.periodo3}
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-sm text-[#1456A0] tabular-nums">
                        {avg.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">
                        <span
                          className={
                            status === 'Aprovado'
                              ? 'text-emerald-700'
                              : status === 'Recurso'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }
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
    </div>
  );
};
