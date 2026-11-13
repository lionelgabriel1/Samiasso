import React, { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Globe,
  History,
  Lock,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext.tsx';
import { PautaGeral, PautaPeriod } from '../../types/index.ts';
import {
  autoDetectSheetStructure,
  ColumnMapping,
  downloadExcelBuffer,
  ExcelExportFormat,
  exportAchievementReportWorkbook,
  exportDisciplineResultsWorkbook,
  exportPautaGeralWorkbook,
  exportStudentResultsWorkbook,
  findExistingPautaConflict,
  generateOfficialPautaTemplateWorkbook,
  getCurriculumDisciplines,
  getStudentPublishedPautas,
  inspectExcelWorkbook,
  ManualRowEdit,
  PautaContextSelection,
  validateAndPreviewPautaImport,
  WorkbookInspectResult,
} from '../../utils/pautaGeral.ts';

type SubTab = 'gestao' | 'relatorios' | 'auditoria';

const CLASS_LEVEL_OPTIONS = ['10.ª Classe', '11.ª Classe'];
const ACADEMIC_YEARS = ['2024/2025', '2025/2026', '2026/2027'];
const PERIOD_OPTIONS: PautaPeriod[] = [
  '1º Trimestre',
  '2º Trimestre',
  '3º Trimestre',
  'Final Anual',
];

export const AdminPautasGerais: React.FC = () => {
  const {
    courses,
    classes,
    students,
    pautasGerais,
    pautaAuditLogs,
    importPautaGeral,
    togglePublishPautaGeral,
    updatePautaGeralCellGrade,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SubTab>('gestao');

  // Context filters
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || 'enfermagem-geral');
  const [classLevel, setClassLevel] = useState<string>('10.ª Classe');
  const [classId, setClassId] = useState<string>('10ª A');
  const [academicYear, setAcademicYear] = useState<string>('2024/2025');
  const [period, setPeriod] = useState<PautaPeriod>('1º Trimestre');

  // Export state
  const [exportFormat, setExportFormat] = useState<ExcelExportFormat>('xlsx');
  const [selectedExportDiscipline, setSelectedExportDiscipline] = useState<string>('');
  const [selectedExportStudentNumber, setSelectedExportStudentNumber] = useState<string>('');

  // Excel import workflow state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [workbookData, setWorkbookData] = useState<WorkbookInspectResult | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [manualEdits, setManualEdits] = useState<Record<string, ManualRowEdit>>({});
  const [excludedRows, setExcludedRows] = useState<Set<string>>(new Set());
  const [ignoreExtraColumns, setIgnoreExtraColumns] = useState<boolean>(false);
  const [importFatalError, setImportFatalError] = useState<string>('');
  const [conflictPauta, setConflictPauta] = useState<PautaGeral | null>(null);

  // Version comparison modal
  const [selectedVersionView, setSelectedVersionView] = useState<{
    pauta: PautaGeral;
    versionNumber: number;
  } | null>(null);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === courseId) || courses[0],
    [courses, courseId]
  );

  const availableClasses = useMemo(() => {
    const filtered = classes.filter((c) => c.courseId === courseId);
    return filtered.length > 0 ? filtered : classes;
  }, [classes, courseId]);

  const expectedDisciplines = useMemo(
    () => getCurriculumDisciplines(courseId),
    [courseId]
  );

  const contextSelection: PautaContextSelection = useMemo(
    () => ({
      courseId,
      courseName: selectedCourse?.name || courseId,
      classLevel,
      classId,
      academicYear,
      period,
    }),
    [courseId, selectedCourse, classLevel, classId, academicYear, period]
  );

  const studentsInTurma = useMemo(
    () => students.filter((s) => s.courseId === courseId && s.classId === classId),
    [students, courseId, classId]
  );

  const activePauta = useMemo(
    () =>
      pautasGerais.find(
        (p) =>
          p.courseId === courseId &&
          p.classId === classId &&
          p.academicYear === academicYear &&
          p.period === period
      ) || null,
    [pautasGerais, courseId, classId, academicYear, period]
  );

  // Keep classId synced when course changes
  const handleCourseChange = (nextCourseId: string) => {
    setCourseId(nextCourseId);
    const match = classes.find((c) => c.courseId === nextCourseId);
    if (match) {
      setClassId(match.id);
      setClassLevel(match.id.startsWith('11') ? '11.ª Classe' : '10.ª Classe');
    }
    if (workbookData?.ok && selectedSheet) {
      const nextDiscs = getCurriculumDisciplines(nextCourseId);
      setColumnMapping(autoDetectSheetStructure(workbookData.sheets[selectedSheet] || [], nextDiscs));
    }
  };

  // Recompute live preview whenever sheet, mapping, edits, exclusions, or context changes
  const previewResult = useMemo(() => {
    if (!workbookData?.ok || !selectedSheet || !columnMapping) return null;
    const sheetRows = workbookData.sheets[selectedSheet] || [];
    return validateAndPreviewPautaImport({
      sheetRows,
      mapping: columnMapping,
      context: contextSelection,
      expectedDisciplines,
      registeredStudents: students,
      manualRowEdits: manualEdits,
      excludedRowKeys: excludedRows,
      ignoreExtraColumns,
    });
  }, [
    workbookData,
    selectedSheet,
    columnMapping,
    contextSelection,
    expectedDisciplines,
    students,
    manualEdits,
    excludedRows,
    ignoreExtraColumns,
  ]);

  const handleDownloadTemplate = () => {
    const buffer = generateOfficialPautaTemplateWorkbook({
      courseName: contextSelection.courseName,
      classLevel: contextSelection.classLevel,
      classId: contextSelection.classId,
      academicYear: contextSelection.academicYear,
      period: contextSelection.period,
      students: studentsInTurma,
      disciplines: expectedDisciplines,
      format: 'xlsx',
    });
    const safeTurma = classId.replace(/\s+/g, '_');
    const safePeriod = period.replace(/\s+/g, '_');
    downloadExcelBuffer(buffer, `Modelo_Pauta_ITPSS_${safeTurma}_${safePeriod}.xlsx`);
    showToast(`Modelo oficial descarregado para ${contextSelection.courseName} (${classId}).`);
  };

  const resetImportWorkspace = () => {
    setUploadedFileName('');
    setWorkbookData(null);
    setSelectedSheet('');
    setColumnMapping(null);
    setManualEdits({});
    setExcludedRows(new Set());
    setIgnoreExtraColumns(false);
    setImportFatalError('');
    setConflictPauta(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = async (file: File) => {
    setImportFatalError('');
    setManualEdits({});
    setExcludedRows(new Set());
    setIgnoreExtraColumns(false);
    setConflictPauta(null);
    setUploadedFileName(file.name);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      setWorkbookData(null);
      setImportFatalError('Formato inválido. Selecione um ficheiro Excel (.xlsx ou .xls).');
      return;
    }

    const buffer = await file.arrayBuffer();
    const inspected = inspectExcelWorkbook(buffer);
    if (!inspected.ok) {
      setWorkbookData(null);
      setColumnMapping(null);
      setImportFatalError(inspected.error || 'Erro ao ler o ficheiro Excel.');
      return;
    }

    const firstSheet = inspected.sheetNames[0];
    setWorkbookData(inspected);
    setSelectedSheet(firstSheet);
    setColumnMapping(
      autoDetectSheetStructure(inspected.sheets[firstSheet] || [], expectedDisciplines)
    );
  };

  const handleSheetChange = (nextSheet: string) => {
    setSelectedSheet(nextSheet);
    setManualEdits({});
    setExcludedRows(new Set());
    if (workbookData?.sheets[nextSheet]) {
      setColumnMapping(
        autoDetectSheetStructure(workbookData.sheets[nextSheet], expectedDisciplines)
      );
    }
  };

  const handleHeaderRowChange = (nextRowZeroBased: number) => {
    if (!workbookData || !selectedSheet) return;
    const rows = workbookData.sheets[selectedSheet] || [];
    const safeIdx = Math.max(0, Math.min(rows.length - 1, nextRowZeroBased));
    const sliced = rows.slice(safeIdx);
    const redetected = autoDetectSheetStructure(sliced, expectedDisciplines);
    setColumnMapping({
      ...redetected,
      headerRowIndex: safeIdx,
      rawHeaders: (rows[safeIdx] || []).map((c, idx) => String(c ?? '').trim() || `Coluna ${idx + 1}`),
    });
  };

  const handleUpdateCellEdit = (rowKey: string, field: 'matricula' | string, value: string) => {
    setManualEdits((prev) => {
      const curr = prev[rowKey] || {};
      if (field === 'matricula') {
        return { ...prev, [rowKey]: { ...curr, matricula: value } };
      }
      return {
        ...prev,
        [rowKey]: {
          ...curr,
          grades: { ...(curr.grades || {}), [field]: value },
        },
      };
    });
  };

  const handleToggleExcludeRow = (rowKey: string) => {
    setExcludedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const handleExcludeAllInvalidRows = () => {
    if (!previewResult) return;
    const next = new Set(excludedRows);
    for (const r of previewResult.rows) {
      if (r.status === 'error') next.add(r.rowKey);
    }
    setExcludedRows(next);
  };

  const handleExecuteImport = (overwriteConfirmed = false) => {
    if (!previewResult) return;
    const existing = findExistingPautaConflict(pautasGerais, contextSelection);
    if (existing && !overwriteConfirmed) {
      setConflictPauta(existing);
      return;
    }

    const res = importPautaGeral({
      previewResult,
      context: contextSelection,
      disciplines: expectedDisciplines,
      fileName: uploadedFileName || 'pauta-importada.xlsx',
      overwriteConfirmed,
    });

    if (res.status === 'invalid') {
      showToast(res.error, 'error');
      return;
    }

    if (res.status === 'requires_confirmation') {
      setConflictPauta(res.existingPauta);
      return;
    }

    setConflictPauta(null);
    resetImportWorkspace();
  };

  const handleExportFullPauta = () => {
    if (!activePauta) return;
    const buffer = exportPautaGeralWorkbook(activePauta, exportFormat);
    downloadExcelBuffer(
      buffer,
      `Pauta_Geral_${activePauta.classId.replace(/\s+/g, '_')}_${activePauta.period.replace(/\s+/g, '_')}.${exportFormat}`
    );
    showToast(`Pauta geral exportada em .${exportFormat}.`);
  };

  const handleExportByDiscipline = () => {
    if (!activePauta) return;
    const disc = selectedExportDiscipline || activePauta.disciplines[0];
    if (!disc) return;
    const buffer = exportDisciplineResultsWorkbook(activePauta, disc, exportFormat);
    downloadExcelBuffer(
      buffer,
      `Resultados_${disc.replace(/\s+/g, '_')}_${activePauta.classId.replace(/\s+/g, '_')}.${exportFormat}`
    );
    showToast(`Resultados de ${disc} exportados em .${exportFormat}.`);
  };

  const handleExportIndividualStudent = () => {
    if (!activePauta) return;
    const mat = selectedExportStudentNumber || activePauta.rows[0]?.studentNumber;
    const stu = students.find((s) => s.studentNumber === mat);
    if (!stu) return;
    const pubViews = getStudentPublishedPautas(pautasGerais, stu.studentNumber);
    const buffer = exportStudentResultsWorkbook(stu, pubViews, exportFormat);
    downloadExcelBuffer(
      buffer,
      `Boletim_${stu.studentNumber}_${stu.name.replace(/\s+/g, '_')}.${exportFormat}`
    );
    showToast(`Boletim individual de ${stu.name} exportado em .${exportFormat}.`);
  };

  const handleExportAchievementReport = () => {
    const buffer = exportAchievementReportWorkbook(pautasGerais, exportFormat);
    downloadExcelBuffer(buffer, `Relatorio_Aproveitamento_ITPSS.${exportFormat}`);
    showToast(`Relatório de aproveitamento exportado em .${exportFormat}.`);
  };

  // Report analytics across saved pautas
  const reportStats = useMemo(() => {
    const totalPautas = pautasGerais.length;
    const publishedCount = pautasGerais.filter((p) => p.published).length;
    const avgPassRate =
      totalPautas > 0
        ? Math.round(pautasGerais.reduce((acc, p) => acc + p.summary.passRate, 0) / totalPautas)
        : 0;
    const avgClassGrade =
      totalPautas > 0
        ? Math.round(
            (pautasGerais.reduce((acc, p) => acc + p.summary.classAverage, 0) / totalPautas) * 10
          ) / 10
        : 0;

    const chartData = pautasGerais.map((p) => ({
      label: `${p.classId} (${p.period.replace(' Trimestre', 'T')})`,
      Aprovados: p.summary.approvedCount,
      Recurso: p.summary.recursoCount,
      Reprovados: p.summary.reprovedCount,
      media: p.summary.classAverage,
    }));

    return { totalPautas, publishedCount, avgPassRate, avgClassGrade, chartData };
  }, [pautasGerais]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Pautas Gerais & Resultados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Importação Excel (.xlsx/.xls), validação curricular por matrícula, publicação controlada e relatórios
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('gestao')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'gestao'
                ? 'bg-white text-[#10385F] shadow-xs'
                : 'text-slate-600 hover:text-[#10385F]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Pautas & Importação</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('relatorios')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'relatorios'
                ? 'bg-white text-[#10385F] shadow-xs'
                : 'text-slate-600 hover:text-[#10385F]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Relatórios de Aproveitamento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auditoria')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'auditoria'
                ? 'bg-white text-[#10385F] shadow-xs'
                : 'text-slate-600 hover:text-[#10385F]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Versões & Auditoria ({pautaAuditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: PAUTAS & IMPORTAÇÃO EXCEL */}
      {/* ========================================== */}
      {activeTab === 'gestao' && (
        <div className="space-y-6">
          {/* Context Filter & Template / Upload Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Curso</label>
                <select
                  aria-label="Selecionar curso"
                  value={courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classe</label>
                <select
                  aria-label="Selecionar classe"
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  {CLASS_LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Turma</label>
                <select
                  aria-label="Selecionar turma"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.id} · {cls.shift}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ano Letivo</label>
                <select
                  aria-label="Selecionar ano letivo"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  {ACADEMIC_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Período Académico</label>
                <select
                  aria-label="Selecionar período"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PautaPeriod)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  {PERIOD_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-[#10385F]">Disciplinas do plano curricular:</span>{' '}
                {expectedDisciplines.join(' · ')}
                <span className="mx-2 text-slate-300">|</span>
                <span className="tabular-nums font-semibold text-slate-700">
                  {studentsInTurma.length} estudante(s) matriculado(s) na turma
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#10385F] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4 text-[#1456A0]" />
                  <span>Descarregar Modelo Oficial (.xlsx)</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="hidden"
                  id="pauta-excel-upload"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importar Ficheiro Excel (.xlsx / .xls)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fatal File Error */}
          {importFatalError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Erro ao processar "{uploadedFileName}"</p>
                  <p className="mt-0.5">{importFatalError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetImportWorkspace}
                className="text-xs font-bold text-rose-700 hover:underline cursor-pointer shrink-0"
              >
                Fechar
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* EXCEL IMPORT & VALIDATION WORKSPACE */}
          {/* ========================================== */}
          {workbookData?.ok && columnMapping && previewResult && (
            <div className="bg-white p-6 rounded-2xl border border-[#1456A0]/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-[#1456A0]">
                    Pré-visualização & Validação de Importação
                  </div>
                  <h3 className="text-base font-extrabold text-[#10385F]">
                    Ficheiro: {uploadedFileName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Destino: {contextSelection.courseName} · {contextSelection.classId} · {contextSelection.academicYear} · {contextSelection.period}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetImportWorkspace}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 self-start"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancelar Importação</span>
                </button>
              </div>

              {/* Sheet & Column Mapping Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Folha do Excel
                    </label>
                    <select
                      aria-label="Folha do Excel"
                      value={selectedSheet}
                      onChange={(e) => handleSheetChange(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {workbookData.sheetNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Linha de Cabeçalho (1-indexed)
                    </label>
                    <select
                      aria-label="Linha de cabeçalho"
                      value={columnMapping.headerRowIndex}
                      onChange={(e) => handleHeaderRowChange(Number(e.target.value))}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      {(workbookData.sheets[selectedSheet] || []).slice(0, 15).map((r, idx) => (
                        <option key={idx} value={idx}>
                          Linha {idx + 1}: {r.filter((c) => String(c ?? '').trim() !== '').slice(0, 3).join(' | ') || '(vazia)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer py-2">
                      <input
                        type="checkbox"
                        checked={ignoreExtraColumns}
                        onChange={(e) => setIgnoreExtraColumns(e.target.checked)}
                        className="rounded border-slate-300 text-[#1456A0]"
                      />
                      <span>Ignorar colunas não pertencentes à turma</span>
                    </label>
                  </div>
                </div>

                {/* Manual Column Mapping Grid */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-[#10385F]">
                    Associação de Colunas (Automática com ajuste manual)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Coluna de Matrícula *
                      </label>
                      <select
                        value={columnMapping.matriculaColIndex ?? ''}
                        onChange={(e) =>
                          setColumnMapping({
                            ...columnMapping,
                            matriculaColIndex: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                        className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="">-- Não associada --</option>
                        {columnMapping.rawHeaders.map((h, idx) => (
                          <option key={idx} value={idx}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Coluna de Nome do Estudante
                      </label>
                      <select
                        value={columnMapping.nomeColIndex ?? ''}
                        onChange={(e) =>
                          setColumnMapping({
                            ...columnMapping,
                            nomeColIndex: e.target.value === '' ? null : Number(e.target.value),
                          })
                        }
                        className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="">-- Opcional --</option>
                        {columnMapping.rawHeaders.map((h, idx) => (
                          <option key={idx} value={idx}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    {expectedDisciplines.map((disc) => (
                      <div key={disc}>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1 truncate">
                          {disc} *
                        </label>
                        <select
                          aria-label={`Coluna para ${disc}`}
                          value={columnMapping.disciplineColMap[disc] ?? ''}
                          onChange={(e) =>
                            setColumnMapping({
                              ...columnMapping,
                              disciplineColMap: {
                                ...columnMapping.disciplineColMap,
                                [disc]: e.target.value === '' ? null : Number(e.target.value),
                              },
                            })
                          }
                          className={`w-full py-1.5 px-2.5 text-xs rounded-lg border bg-white ${
                            columnMapping.disciplineColMap[disc] === null
                              ? 'border-rose-400'
                              : 'border-slate-300'
                          }`}
                        >
                          <option value="">-- Associar coluna --</option>
                          {columnMapping.rawHeaders.map((h, idx) => (
                            <option key={idx} value={idx}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Validation Report Summary */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Total lidas</span>
                    <span className="text-lg font-black text-[#10385F] tabular-nums">
                      {previewResult.report.totalRows}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-700 block">Válidas</span>
                    <span className="text-lg font-black text-emerald-800 tabular-nums">
                      {previewResult.report.validRows}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-amber-700 block">Com avisos</span>
                    <span className="text-lg font-black text-amber-800 tabular-nums">
                      {previewResult.report.warningRows}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <span className="text-rose-700 block">Com erros</span>
                    <span className="text-lg font-black text-rose-800 tabular-nums">
                      {previewResult.report.errorRows}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Rejeitadas</span>
                    <span className="text-lg font-black text-slate-700 tabular-nums">
                      {previewResult.report.excludedRows}
                    </span>
                  </div>
                </div>

                {previewResult.report.globalErrors.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Problemas de estrutura / currículo detetados:</span>
                    </div>
                    {previewResult.report.globalErrors.map((err, idx) => (
                      <p key={idx}>• {err}</p>
                    ))}
                  </div>
                )}

                {previewResult.report.errorRows > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <span>
                      Corrija as células inválidas diretamente na tabela abaixo ou exclua os registos com erro para prosseguir.
                    </span>
                    <button
                      type="button"
                      onClick={handleExcludeAllInvalidRows}
                      className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Rejeitar Todas as Linhas com Erro
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Preview Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Linha</th>
                      <th className="py-2.5 px-3">Matrícula</th>
                      <th className="py-2.5 px-3">Nome do Estudante</th>
                      {expectedDisciplines.map((d) => (
                        <th key={d} className="py-2.5 px-2 text-center whitespace-nowrap">
                          {d}
                        </th>
                      ))}
                      <th className="py-2.5 px-3 text-right">Média</th>
                      <th className="py-2.5 px-3">Validação</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewResult.rows.map((row) => (
                      <tr
                        key={row.rowKey}
                        className={
                          row.excluded
                            ? 'bg-slate-100/70 opacity-55'
                            : row.status === 'error'
                            ? 'bg-rose-50/40'
                            : 'hover:bg-slate-50/80'
                        }
                      >
                        <td className="py-2.5 px-3 font-mono text-slate-500 tabular-nums">
                          L{row.excelRowNumber}
                        </td>

                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            aria-label={`Matrícula linha ${row.excelRowNumber}`}
                            value={row.rawMatricula}
                            disabled={row.excluded}
                            onChange={(e) =>
                              handleUpdateCellEdit(row.rowKey, 'matricula', e.target.value)
                            }
                            className={`w-28 py-1 px-2 font-mono text-xs rounded border ${
                              !row.matchedStudent && !row.excluded
                                ? 'border-rose-400 bg-white text-rose-800'
                                : 'border-slate-200 bg-white text-[#1456A0]'
                            }`}
                          />
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-bold text-[#10385F]">
                            {row.matchedStudent ? row.matchedStudent.name : row.rawNome || '—'}
                          </div>
                          {row.warnings.length > 0 && (
                            <div className="text-[11px] text-amber-700 mt-0.5">
                              {row.warnings[0]}
                            </div>
                          )}
                        </td>

                        {expectedDisciplines.map((disc) => {
                          const hasCellErr = Boolean(row.cellErrors[disc]);
                          return (
                            <td key={disc} className="py-2.5 px-2 text-center">
                              <input
                                type="text"
                                aria-label={`${disc} linha ${row.excelRowNumber}`}
                                disabled={row.excluded}
                                value={row.rawGradeInputs[disc] ?? ''}
                                onChange={(e) =>
                                  handleUpdateCellEdit(row.rowKey, disc, e.target.value)
                                }
                                title={row.cellErrors[disc] || disc}
                                className={`w-14 py-1 px-1.5 text-center text-xs font-bold tabular-nums rounded border ${
                                  hasCellErr && !row.excluded
                                    ? 'border-rose-400 bg-rose-50 text-rose-800'
                                    : 'border-slate-200 bg-white text-slate-800'
                                }`}
                              />
                            </td>
                          );
                        })}

                        <td className="py-2.5 px-3 text-right font-black text-[#1456A0] tabular-nums">
                          {row.average !== null ? row.average.toFixed(1) : '—'}
                        </td>

                        <td className="py-2.5 px-3 max-w-xs">
                          {row.excluded ? (
                            <span className="text-slate-500 font-semibold">Rejeitado</span>
                          ) : row.errors.length > 0 ? (
                            <div className="text-[11px] text-rose-700 space-y-0.5">
                              {row.errors.slice(0, 2).map((e, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>{e}</span>
                                </div>
                              ))}
                            </div>
                          ) : row.warnings.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Aviso</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Válido</span>
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleExcludeRow(row.rowKey)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer whitespace-nowrap"
                          >
                            {row.excluded ? 'Restaurar' : 'Rejeitar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Confirm Import Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  A importação guarda a pauta como <strong>Rascunho Interno</strong>. Os estudantes só terão acesso após publicação explícita pela Secretaria.
                </p>

                <button
                  type="button"
                  disabled={!previewResult.canConfirm}
                  onClick={() => handleExecuteImport(false)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 self-end whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Confirmar Importação ({previewResult.readyRows.length} estudantes)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* ACTIVE PAUTA GERAL FOR SELECTED TURMA/PERIOD */}
          {/* ========================================== */}
          {activePauta ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Header & Publication Bar */}
              <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span className="font-bold text-[#10385F]">
                      {activePauta.courseName} · {activePauta.classId} · {activePauta.period}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">Versão v{activePauta.version}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        activePauta.published ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {activePauta.published ? (
                        <>
                          <Globe className="w-3.5 h-3.5" />
                          <span>Publicada para Estudantes</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Rascunho Interno (Oculta dos Estudantes)</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Atualizada em {activePauta.updatedAt} por {activePauta.updatedBy}
                    {activePauta.sourceFileName ? ` · Ficheiro: ${activePauta.sourceFileName}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => togglePublishPautaGeral(activePauta.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      activePauta.published
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {activePauta.published ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Ocultar dos Estudantes</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Publicar Pauta Oficial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Export Toolbar */}
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#10385F]">Exportação Excel:</span>
                  <select
                    aria-label="Formato de exportação"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as ExcelExportFormat)}
                    className="py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="xlsx">.xlsx (Excel Moderno)</option>
                    <option value="xls">.xls (Excel Clássico)</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleExportFullPauta}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#10385F] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#1456A0]" />
                    <span>Pauta Completa da Turma</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <select
                      aria-label="Selecionar disciplina para exportar"
                      value={selectedExportDiscipline || activePauta.disciplines[0] || ''}
                      onChange={(e) => setSelectedExportDiscipline(e.target.value)}
                      className="py-1.5 px-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      {activePauta.disciplines.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleExportByDiscipline}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#10385F] font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Exportar Disciplina
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <select
                      aria-label="Selecionar estudante para exportar"
                      value={selectedExportStudentNumber || activePauta.rows[0]?.studentNumber || ''}
                      onChange={(e) => setSelectedExportStudentNumber(e.target.value)}
                      className="py-1.5 px-2 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      {activePauta.rows.map((r) => (
                        <option key={r.studentNumber} value={r.studentNumber}>
                          {r.studentNumber} · {r.studentName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleExportIndividualStudent}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#10385F] font-bold rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Exportar Estudante
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportAchievementReport}
                    className="px-3 py-1.5 bg-[#10385F] hover:bg-[#1456A0] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Relatório de Aproveitamento</span>
                  </button>
                </div>
              </div>

              {/* Class Summary Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 border-b border-slate-200 text-xs">
                <div className="p-4">
                  <span className="text-slate-500 block">Estudantes</span>
                  <span className="text-xl font-black text-[#10385F] tabular-nums">
                    {activePauta.summary.totalStudents}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-slate-500 block">Aprovados</span>
                  <span className="text-xl font-black text-emerald-700 tabular-nums">
                    {activePauta.summary.approvedCount}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-slate-500 block">Em Recurso</span>
                  <span className="text-xl font-black text-amber-600 tabular-nums">
                    {activePauta.summary.recursoCount}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-slate-500 block">Taxa Aprovação</span>
                  <span className="text-xl font-black text-[#1456A0] tabular-nums">
                    {activePauta.summary.passRate}%
                  </span>
                </div>
                <div className="p-4 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Média da Turma</span>
                  <span className="text-xl font-black text-[#10385F] tabular-nums">
                    {activePauta.summary.classAverage.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Full Pauta Geral Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-3 px-4 w-12 text-center">Nº</th>
                      <th className="py-3 px-4">Matrícula</th>
                      <th className="py-3 px-4">Nome do estudante</th>
                      {activePauta.disciplines.map((d) => (
                        <th key={d} className="py-3 px-3 text-center whitespace-nowrap">
                          {d}
                        </th>
                      ))}
                      <th className="py-3 px-4 text-right">Média</th>
                      <th className="py-3 px-4 text-right">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activePauta.rows.map((row) => (
                      <tr key={row.studentNumber} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-400 tabular-nums">
                          {row.order}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#1456A0]">
                          {row.studentNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#10385F]">{row.studentName}</td>

                        {activePauta.disciplines.map((disc) => (
                          <td key={disc} className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              step={0.1}
                              aria-label={`Nota ${disc} de ${row.studentName}`}
                              value={row.grades[disc] ?? 0}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (!isNaN(v)) {
                                  updatePautaGeralCellGrade(
                                    activePauta.id,
                                    row.studentNumber,
                                    disc,
                                    v
                                  );
                                }
                              }}
                              className="w-16 py-1 px-1.5 text-center text-xs font-bold tabular-nums rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#1456A0] focus:outline-none"
                            />
                          </td>
                        ))}

                        <td className="py-3 px-4 text-right font-black text-sm text-[#1456A0] tabular-nums">
                          {row.average.toFixed(1)}
                        </td>

                        <td className="py-3 px-4 text-right font-bold">
                          <span
                            className={
                              row.status === 'Aprovado'
                                ? 'text-emerald-700'
                                : row.status === 'Recurso'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-extrabold text-[#10385F]">
                Nenhuma Pauta Geral registada para {contextSelection.courseName} · {classId} ({period})
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Descarregue o modelo oficial em Excel (.xlsx), preencha as notas das disciplinas e importe o ficheiro acima para validar e publicar os resultados.
              </p>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descarregar Modelo Oficial Agora</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: RELATÓRIOS DE APROVEITAMENTO */}
      {/* ========================================== */}
      {activeTab === 'relatorios' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#10385F]">
                Indicadores Consolidados de Aproveitamento
              </h3>
              <p className="text-xs text-slate-500">
                Estatísticas calculadas diretamente a partir das Pautas Gerais registadas
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as ExcelExportFormat)}
                className="py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white font-semibold"
              >
                <option value="xlsx">.xlsx</option>
                <option value="xls">.xls</option>
              </select>
              <button
                type="button"
                onClick={handleExportAchievementReport}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Relatório Completo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Pautas Gerais Registadas</span>
              <span className="text-2xl font-black text-[#10385F] mt-1 block tabular-nums">
                {reportStats.totalPautas}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Pautas Publicadas</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block tabular-nums">
                {reportStats.publishedCount}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Taxa Média de Aprovação</span>
              <span className="text-2xl font-black text-[#1456A0] mt-1 block tabular-nums">
                {reportStats.avgPassRate}%
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Média Global das Turmas</span>
              <span className="text-2xl font-black text-[#10385F] mt-1 block tabular-nums">
                {reportStats.avgClassGrade.toFixed(1)}
              </span>
            </div>
          </div>

          {reportStats.chartData.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-extrabold text-[#10385F] mb-4">
                Distribuição de Aproveitamento por Turma e Período
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Aprovados" fill="#16A34A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Recurso" fill="#F28C28" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Reprovados" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Curso / Turma</th>
                    <th className="py-3 px-4">Ano / Período</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Estudantes</th>
                    <th className="py-3 px-4 text-right">Aprovados</th>
                    <th className="py-3 px-4 text-right">Recurso</th>
                    <th className="py-3 px-4 text-right">Reprovados</th>
                    <th className="py-3 px-4 text-right">Aprovação</th>
                    <th className="py-3 px-4 text-right">Média</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pautasGerais.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-[#10385F]">
                        {p.courseName} · {p.classId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {p.academicYear} · {p.period} (v{p.version})
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        <span className={p.published ? 'text-emerald-700' : 'text-amber-700'}>
                          {p.published ? 'Publicada' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums">{p.summary.totalStudents}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700 tabular-nums">
                        {p.summary.approvedCount}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600 tabular-nums">
                        {p.summary.recursoCount}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600 tabular-nums">
                        {p.summary.reprovedCount}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#1456A0] tabular-nums">
                        {p.summary.passRate}%
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#10385F] tabular-nums">
                        {p.summary.classAverage.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: HISTÓRICO DE VERSÕES & AUDITORIA */}
      {/* ========================================== */}
      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          {/* Version History per Pauta */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#10385F]">
                Versões Guardadas por Pauta Geral
              </h3>
              <p className="text-xs text-slate-500">
                Cada substituição confirmada preserva integralmente a versão anterior para rastreabilidade
              </p>
            </div>

            <div className="space-y-3">
              {pautasGerais.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#10385F]">
                      {p.courseName} · {p.classId} · {p.academicYear} · {p.period}
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Versão atual: <strong>v{p.version}</strong> · {p.versions.length} versão(ões) anterior(es) arquivada(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {p.versions.map((v) => (
                      <button
                        key={v.version}
                        type="button"
                        onClick={() =>
                          setSelectedVersionView({ pauta: p, versionNumber: v.version })
                        }
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-[#10385F] font-bold rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#1456A0]" />
                        <span>Ver v{v.version} ({v.savedAt})</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Audit Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-[#10385F]">
                Registo de Auditoria de Importações e Alterações
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Data / Hora</th>
                    <th className="py-3 px-4">Ação</th>
                    <th className="py-3 px-4">Turma / Período</th>
                    <th className="py-3 px-4">Ficheiro</th>
                    <th className="py-3 px-4 text-right">Registos</th>
                    <th className="py-3 px-4">Operador</th>
                    <th className="py-3 px-4">Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pautaAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#10385F] whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {log.courseName} · {log.classId} · {log.period}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {log.fileName || 'Edição manual'}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                        {log.validCount}/{log.processedCount} válidos
                        {log.errorCount > 0 ? ` (${log.errorCount} erros)` : ''}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        {log.author}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CONFIRMAÇÃO DE SUBSTITUIÇÃO DE PAUTA */}
      {/* ========================================== */}
      {conflictPauta && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setConflictPauta(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#F28C28] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-extrabold text-[#10385F]">
                  Pauta Geral Já Existente — Confirmar Substituição
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Já existe uma Pauta Geral (<strong>Versão v{conflictPauta.version}</strong>) registada para{' '}
                  <strong>{conflictPauta.courseName} · {conflictPauta.classId} · {conflictPauta.period}</strong>{' '}
                  ({conflictPauta.published ? 'atualmente publicada para estudantes' : 'em rascunho'}).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <p>
                • A versão atual (<strong>v{conflictPauta.version}</strong>) será arquivada automaticamente no histórico de versões.
              </p>
              <p>
                • A nova versão (<strong>v{conflictPauta.version + 1}</strong>) será guardada como rascunho interno até nova publicação pela Secretaria.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConflictPauta(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleExecuteImport(true)}
                className="px-4 py-2 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirmar Substituição (Gerar v{conflictPauta.version + 1})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: VISUALIZAR VERSÃO ARQUIVADA */}
      {/* ========================================== */}
      {selectedVersionView && (() => {
        const ver = selectedVersionView.pauta.versions.find(
          (v) => v.version === selectedVersionView.versionNumber
        );
        if (!ver) return null;
        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedVersionView(null)}
          >
            <div
              className="w-full max-w-3xl bg-white rounded-2xl p-6 space-y-4 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#10385F]">
                    Arquivo Histórico — Versão v{ver.version}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Guardada em {ver.savedAt} por {ver.savedBy}
                    {ver.sourceFileName ? ` · ${ver.sourceFileName}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVersionView(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2 px-3">Matrícula</th>
                      <th className="py-2 px-3">Estudante</th>
                      {selectedVersionView.pauta.disciplines.map((d) => (
                        <th key={d} className="py-2 px-2 text-center">
                          {d}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-right">Média</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ver.rows.map((r) => (
                      <tr key={r.studentNumber}>
                        <td className="py-2 px-3 font-mono text-[#1456A0]">{r.studentNumber}</td>
                        <td className="py-2 px-3 font-semibold">{r.studentName}</td>
                        {selectedVersionView.pauta.disciplines.map((d) => (
                          <td key={d} className="py-2 px-2 text-center tabular-nums">
                            {r.grades[d] ?? '—'}
                          </td>
                        ))}
                        <td className="py-2 px-3 text-right font-bold tabular-nums">
                          {r.average.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
