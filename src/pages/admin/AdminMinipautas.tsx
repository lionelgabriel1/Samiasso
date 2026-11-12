import React, { useState } from 'react';
import {
  Award,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Globe,
  Lock,
  Save,
  RefreshCw,
  History,
  Search,
  Filter,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Minipauta, MinipautaEntry } from '../../types/index.ts';
import { calculateTrimestralGrade, parseMinipautaCSV } from '../../utils/academic.ts';

type PeriodType = '1º Trimestre' | '2º Trimestre' | '3º Trimestre';

export const AdminMinipautas: React.FC = () => {
  const {
    courses,
    students,
    minipautas,
    minipautaAuditLogs,
    togglePublishMinipauta,
    importMinipautaEntries,
    currentUser,
  } = useApp();

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'enfermagem-geral');
  const [selectedClassId, setSelectedClassId] = useState<string>('10ª A');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('Anatomia e Fisiologia');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('1º Trimestre');

  // CSV Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedEntries, setParsedEntries] = useState<Omit<MinipautaEntry, 'notaFinal'>[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  // Audit Log Modal State
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Find active minipauta
  const activeMinipauta = minipautas.find(
    (m) =>
      m.courseId === selectedCourseId &&
      m.classId === selectedClassId &&
      m.disciplineName.toLowerCase().includes(selectedDiscipline.toLowerCase().slice(0, 8)) &&
      m.period === selectedPeriod
  ) || minipautas[0];

  // Local editable entries state
  const [localEntries, setLocalEntries] = useState<MinipautaEntry[]>(activeMinipauta?.entries || []);

  // Update local entries when activeMinipauta changes
  React.useEffect(() => {
    if (activeMinipauta) {
      setLocalEntries(activeMinipauta.entries);
    }
  }, [activeMinipauta?.id]);

  const handleGradeChange = (
    studentNumber: string,
    field: 'mac' | 'npp' | 'npt',
    valueStr: string
  ) => {
    const val = Math.min(20, Math.max(0, parseFloat(valueStr) || 0));

    setLocalEntries((prev) =>
      prev.map((entry) => {
        if (entry.studentNumber === studentNumber) {
          const updated = { ...entry, [field]: val };
          updated.notaFinal = calculateTrimestralGrade(updated.mac, updated.npp, updated.npt);
          return updated;
        }
        return entry;
      })
    );
  };

  const handleSaveGrades = () => {
    if (!activeMinipauta) return;
    importMinipautaEntries(activeMinipauta.id, localEntries);
  };

  const mapCsvEntries = (entries: ReturnType<typeof parseMinipautaCSV>['entries']) => {
    const errors: string[] = [];
    const mapped: Omit<MinipautaEntry, 'notaFinal'>[] = [];
    entries.forEach((entry) => {
      const student = students.find((item) => item.studentNumber.trim().toLowerCase() === entry.studentNumber.trim().toLowerCase());
      if (!student) {
        errors.push(`Matrícula não encontrada: ${entry.studentNumber}`);
        return;
      }
      mapped.push({ studentId: student.id, studentNumber: student.studentNumber, studentName: student.name, mac: entry.mac, npp: entry.npp, npt: entry.npt });
    });
    return { mapped, errors };
  };

  const handleCsvParse = () => {
    const res = parseMinipautaCSV(csvRawText);
    const mapped = mapCsvEntries(res.entries);
    setParsedEntries(mapped.mapped);
    setParseErrors([...res.errors, ...mapped.errors]);
  };

  const handleConfirmImport = () => {
    if (!activeMinipauta || parsedEntries.length === 0) return;
    const fullEntries: MinipautaEntry[] = parsedEntries.map((e) => ({
      ...e,
      notaFinal: calculateTrimestralGrade(e.mac, e.npp, e.npt),
    }));
    importMinipautaEntries(activeMinipauta.id, fullEntries, 'Importação Excel/CSV');
    setIsImportModalOpen(false);
    setCsvRawText('');
    setParsedEntries([]);
    setParseErrors([]);
  };

  const loadCsvSampleTemplate = () => {
    const sampleStudents = students.slice(0, 4);
    if (sampleStudents.length === 0) {
      setParseErrors(['Não existem estudantes registados para criar um exemplo.']);
      return;
    }
    const sample = `studentNumber,studentName,mac,npp,npt\n` + sampleStudents.map((student, index) => `${student.studentNumber},${student.name},${14 + index},${13 + index},${15 + index}`).join('\n');
    setCsvRawText(sample);
    const res = parseMinipautaCSV(sample);
    const mapped = mapCsvEntries(res.entries);
    setParsedEntries(mapped.mapped);
    setParseErrors([...res.errors, ...mapped.errors]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão e Publicação de Minipautas</h2>
          <p className="text-xs text-slate-500">
            Lançamento de notas trimestrais, importação de pautas em Excel/CSV e controlo de publicação para alunos
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Auditoria ({minipautaAuditLogs.length})</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Importar Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Curso</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Turma / Classe</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
            >
              <option value="10ª A">10.ª Classe — Turma A (Manhã)</option>
              <option value="10ª B">10.ª Classe — Turma B (Tarde)</option>
              <option value="11ª A">11.ª Classe — Turma A (Manhã)</option>
              <option value="11ª B">11.ª Classe — Turma B (Tarde)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Disciplina</label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
            >
              <option value="Anatomia e Fisiologia">Anatomia e Fisiologia Humana</option>
              <option value="Enfermagem Fundamental">Enfermagem Fundamental</option>
              <option value="Bioquímica Clínica">Bioquímica Clínica</option>
              <option value="Microbiologia e Parasitologia">Microbiologia e Parasitologia</option>
              <option value="Farmacologia Geral">Farmacologia Geral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Período Letivo</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as PeriodType)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
            >
              <option value="1º Trimestre">1.º Trimestre</option>
              <option value="2º Trimestre">2.º Trimestre</option>
              <option value="3º Trimestre">3.º Trimestre</option>
            </select>
          </div>
        </div>

        {/* Status of Active Minipauta & Actions */}
        {activeMinipauta && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  activeMinipauta.published
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {activeMinipauta.published ? (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publicada para Estudantes</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Rascunho Interno (Oculta para Alunos)</span>
                  </>
                )}
              </span>

              <span className="text-xs text-slate-500">
                Última atualização: <strong className="text-slate-700">{activeMinipauta.updatedAt}</strong> por{' '}
                <strong className="text-slate-700">{activeMinipauta.updatedBy}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveGrades}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações de Notas</span>
              </button>

              <button
                onClick={() => togglePublishMinipauta(activeMinipauta.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeMinipauta.published
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-[#1456A0] hover:bg-[#10385F] text-white shadow-xs'
                }`}
              >
                {activeMinipauta.published ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Suspender Publicação</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Publicar no Portal do Aluno</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grade Table */}
      {activeMinipauta ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-[#10385F]">
              Pauta da Disciplina: {activeMinipauta.disciplineName} • {activeMinipauta.period} • Turma: {activeMinipauta.classId}
            </span>
            <span className="text-slate-500">
              {localEntries.length} estudante(s) matriculado(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">N.º</th>
                  <th className="py-3 px-4">N.º Matrícula</th>
                  <th className="py-3 px-4">Nome do Estudante</th>
                  <th className="py-3 px-4 text-center w-28">MAC (Contínua)</th>
                  <th className="py-3 px-4 text-center w-28">NPP (Parcelar)</th>
                  <th className="py-3 px-4 text-center w-28">NPT (Trimestral)</th>
                  <th className="py-3 px-4 text-center w-28">Média (MT)</th>
                  <th className="py-3 px-4 text-right">Aproveitamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localEntries.map((entry, idx) => {
                  const isApproved = entry.notaFinal >= 10;
                  return (
                    <tr key={entry.studentNumber} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#1456A0]">{entry.studentNumber}</td>
                      <td className="py-3 px-4 font-bold text-[#10385F]">{entry.studentName}</td>
                      
                      {/* MAC Input */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={entry.mac}
                          onChange={(e) => handleGradeChange(entry.studentNumber, 'mac', e.target.value)}
                          className="w-20 py-1 px-2 text-center text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-[#1456A0] bg-slate-50 focus:bg-white"
                        />
                      </td>

                      {/* NPP Input */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={entry.npp}
                          onChange={(e) => handleGradeChange(entry.studentNumber, 'npp', e.target.value)}
                          className="w-20 py-1 px-2 text-center text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-[#1456A0] bg-slate-50 focus:bg-white"
                        />
                      </td>

                      {/* NPT Input */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={entry.npt !== undefined ? entry.npt : ''}
                          onChange={(e) => handleGradeChange(entry.studentNumber, 'npt', e.target.value)}
                          className="w-20 py-1 px-2 text-center text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-[#1456A0] bg-slate-50 focus:bg-white"
                        />
                      </td>

                      {/* Calculated MT */}
                      <td className="py-3 px-4 text-center font-black text-sm text-[#1456A0]">
                        {entry.notaFinal.toFixed(1)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isApproved ? 'Apto / Positiva' : 'Deficiente / Negativa'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
          Nenhuma minipauta selecionada.
        </div>
      )}

      {/* MODAL 1: IMPORTAR EXCEL / CSV */}
      {isImportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#1456A0]" />
                <h3 className="font-bold text-base text-[#10385F]">Importar Notas via CSV / Excel</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Cole o conteúdo CSV ou carregue os dados das notas formatados com as colunas:{' '}
              <strong className="font-mono text-slate-800">studentNumber,studentName,mac,npp,npt</strong>.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Texto CSV:</span>
                <button
                  type="button"
                  onClick={loadCsvSampleTemplate}
                  className="text-xs text-[#1456A0] font-bold hover:underline cursor-pointer"
                >
                  Carregar Exemplo de Demonstração
                </button>
              </div>

              <textarea
                rows={5}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder="studentNumber,studentName,mac,npp,npt&#10;2024-0142,Ana Paula Silva,16.5,15,17"
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />

              <button
                type="button"
                onClick={handleCsvParse}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Processar e Validar Dados
              </button>
            </div>

            {/* Validation Feedback */}
            {parseErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <span className="font-bold block">Erros encontrados:</span>
                {parseErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {/* Preview of Parsed Entries */}
            {parsedEntries.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {parsedEntries.length} linha(s) validadas com sucesso
                  </span>
                  <span>Fórmula MT aplicada automaticamente</span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="p-2">Matrícula</th>
                        <th className="p-2">Nome</th>
                        <th className="p-2 text-center">MAC</th>
                        <th className="p-2 text-center">NPP</th>
                        <th className="p-2 text-center">NPT</th>
                        <th className="p-2 text-center">Média Estimada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedEntries.map((pe) => {
                        const mt = calculateTrimestralGrade(pe.mac, pe.npp, pe.npt);
                        return (
                          <tr key={pe.studentNumber}>
                            <td className="p-2 font-mono">{pe.studentNumber}</td>
                            <td className="p-2 font-medium">{pe.studentName}</td>
                            <td className="p-2 text-center">{pe.mac}</td>
                            <td className="p-2 text-center">{pe.npp}</td>
                            <td className="p-2 text-center">{pe.npt !== undefined ? pe.npt : '-'}</td>
                            <td className="p-2 text-center font-bold text-[#1456A0]">{mt.toFixed(1)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={parsedEntries.length === 0}
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Importação para a Pauta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTO DE AUDITORIA */}
      {isAuditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAuditModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#F28C28]" />
                <h3 className="font-bold text-base text-[#10385F]">Registo de Auditoria de Minipautas</h3>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Histórico rastreável de todas as modificações, importações e publicações de notas efetuadas no sistema:
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2.5">
              {minipautaAuditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#10385F]">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Operador: <strong className="text-slate-800">{log.author}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Disciplina: {log.disciplineName} • Turma: {log.classId}
                  </div>
                  {log.details && (
                    <div className="text-[11px] text-[#1456A0] bg-white p-2 rounded-lg border border-slate-100">
                      {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
