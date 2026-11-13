import * as XLSX from 'xlsx';
import {
  AcademicStatus,
  calculateDisciplineAverage,
  calculateOverallAverage,
  determineAcademicStatus,
} from './academic.ts';
import { COURSE_CURRICULA, INSTITUTION_INFO } from '../data/initialData.ts';
import {
  PautaDisciplineStat,
  PautaGeral,
  PautaGeralAuditLog,
  PautaGeralRow,
  PautaGeralSummary,
  PautaPeriod,
  Student,
} from '../types/index.ts';

export type ExcelExportFormat = 'xlsx' | 'xls';

export interface PautaContextSelection {
  courseId: string;
  courseName: string;
  classLevel: string;
  classId: string;
  academicYear: string;
  period: PautaPeriod;
}

export interface ColumnMapping {
  headerRowIndex: number;
  rawHeaders: string[];
  orderColIndex: number | null;
  matriculaColIndex: number | null;
  nomeColIndex: number | null;
  disciplineColMap: Record<string, number | null>;
  unmappedExtraCols: { colIndex: number; headerName: string }[];
}

export interface CellValidationIssue {
  discipline: string;
  message: string;
}

export interface PreviewRowItem {
  rowKey: string;
  excelRowNumber: number;
  order: number;
  rawMatricula: string;
  rawNome: string;
  matchedStudent: Student | null;
  grades: Record<string, number | null>;
  rawGradeInputs: Record<string, string>;
  average: number | null;
  academicStatus: AcademicStatus | null;
  errors: string[];
  warnings: string[];
  cellErrors: Record<string, string>;
  status: 'valid' | 'warning' | 'error';
  excluded: boolean;
}

export interface PautaValidationReport {
  totalRows: number;
  includedRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  excludedRows: number;
  missingStudents: string[];
  duplicateMatriculas: string[];
  invalidGradesCount: number;
  missingDisciplines: string[];
  unknownDisciplines: string[];
  globalErrors: string[];
  globalWarnings: string[];
}

export interface PautaPreviewResult {
  rows: PreviewRowItem[];
  report: PautaValidationReport;
  canConfirm: boolean;
  readyRows: PautaGeralRow[];
}

export interface WorkbookInspectResult {
  ok: boolean;
  error?: string;
  sheetNames: string[];
  sheets: Record<string, unknown[][]>;
}

export interface ManualRowEdit {
  matricula?: string;
  grades?: Record<string, string>;
}

const MATRICULA_ALIASES = [
  'matricula',
  'n matricula',
  'no matricula',
  'num matricula',
  'numero matricula',
  'numero de matricula',
  'n de matricula',
  'studentnumber',
  'student number',
  'codigo aluno',
  'cod aluno',
  'cod estudante',
  'id aluno',
  'numero',
];

const NOME_ALIASES = [
  'nome do estudante',
  'nome do aluno',
  'nome completo',
  'estudante',
  'aluno',
  'nome',
  'studentname',
  'student name',
];

const ORDER_ALIASES = ['n', 'no', 'num', 'nº', 'n o', 'ordem', 'ord', '#'];

const SUMMARY_IGNORE_ALIASES = [
  'media',
  'media geral',
  'media final',
  'situacao',
  'estado',
  'observacao',
  'observacoes',
  'obs',
  'resultado',
  'aproveitamento',
  'status',
];

export function normalizeText(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getCurriculumDisciplines(courseId: string): string[] {
  return COURSE_CURRICULA[courseId] ? [...COURSE_CURRICULA[courseId]] : [];
}

export function formatTimestampNow(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 16);
}

export function parseGradeValue(raw: unknown): {
  valid: boolean;
  value: number | null;
  rawText: string;
  error?: string;
} {
  if (raw === null || raw === undefined) {
    return { valid: false, value: null, rawText: '', error: 'Nota em falta' };
  }
  const str = String(raw).trim();
  if (str === '' || str === '-') {
    return { valid: false, value: null, rawText: str, error: 'Nota em falta' };
  }
  const normalizedNum = str.replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(normalizedNum)) {
    return {
      valid: false,
      value: null,
      rawText: str,
      error: `Valor inválido "${str}" (use número de 0 a 20)`,
    };
  }
  const num = Number(normalizedNum);
  if (!Number.isFinite(num) || num < 0 || num > 20) {
    return {
      valid: false,
      value: null,
      rawText: str,
      error: `Nota "${str}" fora da escala (0 a 20)`,
    };
  }
  const rounded = Math.round(num * 10) / 10;
  return { valid: true, value: rounded, rawText: String(rounded) };
}

export function summarizePautaRows(
  rows: PautaGeralRow[],
  disciplines: string[]
): PautaGeralSummary {
  const totalStudents = rows.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      approvedCount: 0,
      recursoCount: 0,
      reprovedCount: 0,
      passRate: 0,
      classAverage: 0,
      disciplineStats: disciplines.map((discipline) => ({
        discipline,
        average: 0,
        min: 0,
        max: 0,
        approvedCount: 0,
        passRate: 0,
      })),
    };
  }

  let approvedCount = 0;
  let recursoCount = 0;
  let reprovedCount = 0;
  let avgSum = 0;

  for (const row of rows) {
    avgSum += row.average;
    if (row.status === 'Aprovado') approvedCount++;
    else if (row.status === 'Recurso') recursoCount++;
    else reprovedCount++;
  }

  const disciplineStats: PautaDisciplineStat[] = disciplines.map((discipline) => {
    const vals = rows
      .map((r) => r.grades[discipline])
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
    if (vals.length === 0) {
      return { discipline, average: 0, min: 0, max: 0, approvedCount: 0, passRate: 0 };
    }
    const sum = vals.reduce((acc, n) => acc + n, 0);
    const discApproved = vals.filter((v) => v >= 9.5).length;
    return {
      discipline,
      average: Math.round((sum / vals.length) * 10) / 10,
      min: Math.min(...vals),
      max: Math.max(...vals),
      approvedCount: discApproved,
      passRate: Math.round((discApproved / vals.length) * 100),
    };
  });

  return {
    totalStudents,
    approvedCount,
    recursoCount,
    reprovedCount,
    passRate: Math.round((approvedCount / totalStudents) * 100),
    classAverage: Math.round((avgSum / totalStudents) * 10) / 10,
    disciplineStats,
  };
}

function isLikelyExcelSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  // ZIP (.xlsx) signature: PK\x03\x04 or PK\x05\x06
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return true;
  // OLE2 Compound Document (.xls BIFF8): D0 CF 11 E0
  if (
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0
  ) {
    return true;
  }
  // BIFF5 / older Excel BOF
  if (bytes[0] === 0x09 && (bytes[1] === 0x08 || bytes[1] === 0x04)) return true;
  // XML Spreadsheet 2003 or HTML Excel
  const headText = new TextDecoder('utf-8', { fatal: false })
    .decode(bytes.slice(0, 128))
    .trimStart()
    .toLowerCase();
  if (
    headText.startsWith('<?xml') ||
    headText.startsWith('<workbook') ||
    headText.startsWith('<html') ||
    headText.startsWith('<!doctype html')
  ) {
    return true;
  }
  return false;
}

export function inspectExcelWorkbook(buffer: ArrayBuffer): WorkbookInspectResult {
  if (!buffer || buffer.byteLength === 0) {
    return {
      ok: false,
      error: 'O ficheiro está vazio (0 bytes). Selecione um ficheiro Excel (.xlsx ou .xls) válido.',
      sheetNames: [],
      sheets: {},
    };
  }

  const bytes = new Uint8Array(buffer);
  if (!isLikelyExcelSignature(bytes)) {
    return {
      ok: false,
      error:
        'Ficheiro corrompido ou formato não suportado. Utilize um ficheiro Excel válido nos formatos .xlsx ou .xls.',
      sheetNames: [],
      sheets: {},
    };
  }

  try {
    const workbook = XLSX.read(bytes, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        ok: false,
        error: 'O livro Excel não contém folhas de cálculo válidas.',
        sheetNames: [],
        sheets: {},
      };
    }

    const sheets: Record<string, unknown[][]> = {};
    let hasAnyNonEmptyRow = false;

    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      if (!sheet) continue;
      const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: '',
        blankrows: false,
      });
      sheets[name] = aoa;
      if (aoa.some((row) => row.some((cell) => String(cell ?? '').trim() !== ''))) {
        hasAnyNonEmptyRow = true;
      }
    }

    if (!hasAnyNonEmptyRow) {
      return {
        ok: false,
        error: 'As folhas do ficheiro Excel estão vazias e não contêm registos para importar.',
        sheetNames: workbook.SheetNames,
        sheets,
      };
    }

    return {
      ok: true,
      sheetNames: workbook.SheetNames,
      sheets,
    };
  } catch {
    return {
      ok: false,
      error:
        'Não foi possível ler o ficheiro Excel. O ficheiro pode estar corrompido ou protegido por palavra-passe.',
      sheetNames: [],
      sheets: {},
    };
  }
}

function matchesAlias(normalizedHeader: string, aliases: string[]): boolean {
  if (!normalizedHeader) return false;
  return aliases.some(
    (alias) =>
      normalizedHeader === alias ||
      (alias.length >= 4 && normalizedHeader.includes(alias)) ||
      (normalizedHeader.length >= 4 && alias.length >= 5 && alias.includes(normalizedHeader))
  );
}

function matchDiscipline(normalizedHeader: string, disciplines: string[]): string | null {
  if (!normalizedHeader) return null;
  // Exact normalized match first
  for (const disc of disciplines) {
    if (normalizeText(disc) === normalizedHeader) return disc;
  }
  // Substring/partial match only when header is meaningful length
  if (normalizedHeader.length < 4) return null;
  for (const disc of disciplines) {
    const normDisc = normalizeText(disc);
    if (
      normDisc.length >= 4 &&
      (normalizedHeader.includes(normDisc) || normDisc.includes(normalizedHeader))
    ) {
      return disc;
    }
  }
  return null;
}

export function autoDetectSheetStructure(
  sheetRows: unknown[][],
  expectedDisciplines: string[]
): ColumnMapping {
  if (!sheetRows || sheetRows.length === 0) {
    return {
      headerRowIndex: 0,
      rawHeaders: [],
      orderColIndex: null,
      matriculaColIndex: null,
      nomeColIndex: null,
      disciplineColMap: Object.fromEntries(expectedDisciplines.map((d) => [d, null])),
      unmappedExtraCols: [],
    };
  }

  let bestRowIdx = 0;
  let bestScore = -1;
  const maxScan = Math.min(sheetRows.length, 25);

  for (let i = 0; i < maxScan; i++) {
    const row = sheetRows[i] || [];
    let score = 0;
    const nonEmpty = row.filter((c) => String(c ?? '').trim() !== '');
    if (nonEmpty.length < 2) continue;

    for (const cell of row) {
      const norm = normalizeText(String(cell ?? ''));
      if (!norm) continue;
      if (ORDER_ALIASES.includes(norm)) {
        score += 3;
      } else if (matchesAlias(norm, MATRICULA_ALIASES)) {
        score += 10;
      } else if (matchesAlias(norm, NOME_ALIASES)) {
        score += 8;
      } else if (matchDiscipline(norm, expectedDisciplines)) {
        score += 6;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestRowIdx = i;
    }
  }

  const headerRow = sheetRows[bestRowIdx] || [];
  const rawHeaders = headerRow.map((cell, idx) => {
    const val = String(cell ?? '').trim();
    return val || `Coluna ${idx + 1}`;
  });

  let orderColIndex: number | null = null;
  let matriculaColIndex: number | null = null;
  let nomeColIndex: number | null = null;
  const disciplineColMap: Record<string, number | null> = Object.fromEntries(
    expectedDisciplines.map((d) => [d, null])
  );
  const unmappedExtraCols: { colIndex: number; headerName: string }[] = [];

  rawHeaders.forEach((header, idx) => {
    const norm = normalizeText(header);
    if (!norm || header.startsWith('Coluna ')) return;

    if (orderColIndex === null && ORDER_ALIASES.includes(norm)) {
      orderColIndex = idx;
      return;
    }
    if (matriculaColIndex === null && matchesAlias(norm, MATRICULA_ALIASES)) {
      matriculaColIndex = idx;
      return;
    }
    if (nomeColIndex === null && matchesAlias(norm, NOME_ALIASES)) {
      nomeColIndex = idx;
      return;
    }
    if (matchesAlias(norm, SUMMARY_IGNORE_ALIASES)) {
      return;
    }

    const matchedDisc = matchDiscipline(norm, expectedDisciplines);
    if (matchedDisc) {
      if (disciplineColMap[matchedDisc] === null) {
        disciplineColMap[matchedDisc] = idx;
      }
      return;
    }

    // Any remaining header column that doesn't match metadata/summary/curriculum
    unmappedExtraCols.push({ colIndex: idx, headerName: header });
  });

  return {
    headerRowIndex: bestRowIdx,
    rawHeaders,
    orderColIndex,
    matriculaColIndex,
    nomeColIndex,
    disciplineColMap,
    unmappedExtraCols,
  };
}

export function validateAndPreviewPautaImport(params: {
  sheetRows: unknown[][];
  mapping: ColumnMapping;
  context: PautaContextSelection;
  expectedDisciplines: string[];
  registeredStudents: Student[];
  manualRowEdits?: Record<string, ManualRowEdit>;
  excludedRowKeys?: Set<string>;
  ignoreExtraColumns?: boolean;
}): PautaPreviewResult {
  const {
    sheetRows,
    mapping,
    context,
    expectedDisciplines,
    registeredStudents,
    manualRowEdits = {},
    excludedRowKeys = new Set<string>(),
    ignoreExtraColumns = false,
  } = params;

  const globalErrors: string[] = [];
  const globalWarnings: string[] = [];

  if (mapping.matriculaColIndex === null) {
    globalErrors.push(
      'Coluna de Matrícula não identificada. Associe manualmente a coluna correspondente à Matrícula do estudante.'
    );
  }

  const missingDisciplines = expectedDisciplines.filter(
    (d) => mapping.disciplineColMap[d] === null || mapping.disciplineColMap[d] === undefined
  );

  if (missingDisciplines.length > 0) {
    globalErrors.push(
      `Disciplina(s) em falta ou não associada(s) no ficheiro para ${context.courseName} (${context.classId}): ${missingDisciplines.join(', ')}.`
    );
  }

  // Filter extra columns not mapped to any curriculum discipline
  const mappedIndices = new Set<number>(
    Object.values(mapping.disciplineColMap).filter((v): v is number => v !== null)
  );
  if (mapping.matriculaColIndex !== null) mappedIndices.add(mapping.matriculaColIndex);
  if (mapping.nomeColIndex !== null) mappedIndices.add(mapping.nomeColIndex);
  if (mapping.orderColIndex !== null) mappedIndices.add(mapping.orderColIndex);

  const activeUnknownDisciplines = mapping.unmappedExtraCols
    .filter((c) => !mappedIndices.has(c.colIndex))
    .map((c) => c.headerName);

  if (!ignoreExtraColumns && activeUnknownDisciplines.length > 0) {
    globalErrors.push(
      `Disciplina(s) que não pertencem ao plano curricular de ${context.courseName} (${context.classId}): ${activeUnknownDisciplines.join(', ')}. Corrija a associação ou ative "Ignorar colunas extras".`
    );
  }

  const studentByMatricula = new Map<string, Student>();
  for (const s of registeredStudents) {
    studentByMatricula.set(s.studentNumber.trim().toLowerCase(), s);
  }

  const seenMatriculas = new Map<string, number>();
  const rows: PreviewRowItem[] = [];
  const missingStudents: string[] = [];
  const duplicateMatriculas: string[] = [];
  let invalidGradesCount = 0;

  const startRow = mapping.headerRowIndex + 1;
  for (let i = startRow; i < sheetRows.length; i++) {
    const rawRow = sheetRows[i] || [];
    const hasAnyValue = rawRow.some((c) => String(c ?? '').trim() !== '');
    if (!hasAnyValue) continue;

    // Stop or skip summary footer lines at bottom of exported pautas
    const firstNonEmpty = rawRow.find((c) => String(c ?? '').trim() !== '');
    const normFirst = normalizeText(String(firstNonEmpty ?? ''));
    if (
      normFirst.startsWith('resumo') ||
      normFirst.startsWith('total de estudantes') ||
      normFirst.startsWith('aprovados') ||
      normFirst.startsWith('recurso') ||
      normFirst.startsWith('reprovados') ||
      normFirst.startsWith('taxa de aprovacao') ||
      normFirst.startsWith('media da turma')
    ) {
      continue;
    }

    const rowKey = `row-${i}`;
    const edit = manualRowEdits[rowKey];

    const rawMatriculaCell =
      mapping.matriculaColIndex !== null ? String(rawRow[mapping.matriculaColIndex] ?? '').trim() : '';
    const effectiveMatricula =
      edit?.matricula !== undefined ? edit.matricula.trim() : rawMatriculaCell;

    const rawNome =
      mapping.nomeColIndex !== null ? String(rawRow[mapping.nomeColIndex] ?? '').trim() : '';

    const rawOrder =
      mapping.orderColIndex !== null ? Number(rawRow[mapping.orderColIndex]) : NaN;
    const order = Number.isFinite(rawOrder) && rawOrder > 0 ? rawOrder : rows.length + 1;

    const errors: string[] = [];
    const warnings: string[] = [];
    const cellErrors: Record<string, string> = {};
    const grades: Record<string, number | null> = {};
    const rawGradeInputs: Record<string, string> = {};

    let matchedStudent: Student | null = null;
    if (!effectiveMatricula) {
      errors.push('Matrícula em falta na linha.');
    } else {
      const matKey = effectiveMatricula.toLowerCase();
      if (seenMatriculas.has(matKey)) {
        const firstExcelLine = seenMatriculas.get(matKey)!;
        errors.push(
          `Estudante duplicado: matrícula "${effectiveMatricula}" já apareceu na linha ${firstExcelLine}.`
        );
        if (!duplicateMatriculas.includes(effectiveMatricula)) {
          duplicateMatriculas.push(effectiveMatricula);
        }
      } else {
        seenMatriculas.set(matKey, i + 1);
      }

      matchedStudent = studentByMatricula.get(matKey) || null;
      if (!matchedStudent) {
        errors.push(
          `Matrícula "${effectiveMatricula}" não registada no sistema. Não são criados estudantes automaticamente.`
        );
        if (!missingStudents.includes(effectiveMatricula)) {
          missingStudents.push(effectiveMatricula);
        }
      } else {
        if (matchedStudent.courseId !== context.courseId || matchedStudent.classId !== context.classId) {
          errors.push(
            `Estudante "${matchedStudent.name}" (${effectiveMatricula}) está matriculado em ${matchedStudent.courseName} · ${matchedStudent.classId}, não em ${context.courseName} · ${context.classId}.`
          );
        }
        if (
          rawNome &&
          normalizeText(rawNome) !== normalizeText(matchedStudent.name)
        ) {
          warnings.push(
            `Nome no ficheiro ("${rawNome}") difere do registo oficial ("${matchedStudent.name}"). Será mantido o nome oficial associado à matrícula.`
          );
        }
      }
    }

    // Validate grades for every expected discipline
    const validGradeNumbers: number[] = [];
    for (const disc of expectedDisciplines) {
      const colIdx = mapping.disciplineColMap[disc];
      const cellRaw =
        edit?.grades && edit.grades[disc] !== undefined
          ? edit.grades[disc]
          : colIdx !== null && colIdx !== undefined
          ? rawRow[colIdx]
          : '';

      const parsed = parseGradeValue(cellRaw);
      rawGradeInputs[disc] = parsed.rawText;

      if (!parsed.valid || parsed.value === null) {
        grades[disc] = null;
        const msg = `${disc}: ${parsed.error || 'Nota inválida'}`;
        cellErrors[disc] = parsed.error || 'Nota inválida';
        errors.push(msg);
        invalidGradesCount++;
      } else {
        grades[disc] = parsed.value;
        validGradeNumbers.push(parsed.value);
      }
    }

    const average =
      validGradeNumbers.length === expectedDisciplines.length && expectedDisciplines.length > 0
        ? Math.round(
            (validGradeNumbers.reduce((acc, g) => acc + g, 0) / validGradeNumbers.length) * 10
          ) / 10
        : null;
    const academicStatus = average !== null ? determineAcademicStatus(average) : null;

    const status: 'valid' | 'warning' | 'error' =
      errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';

    rows.push({
      rowKey,
      excelRowNumber: i + 1,
      order,
      rawMatricula: effectiveMatricula,
      rawNome,
      matchedStudent,
      grades,
      rawGradeInputs,
      average,
      academicStatus,
      errors,
      warnings,
      cellErrors,
      status,
      excluded: excludedRowKeys.has(rowKey),
    });
  }

  if (rows.length === 0) {
    globalErrors.push('Nenhuma linha de estudante foi encontrada abaixo do cabeçalho selecionado.');
  }

  const included = rows.filter((r) => !r.excluded);
  const validRowsCount = included.filter((r) => r.status === 'valid').length;
  const warningRowsCount = included.filter((r) => r.status === 'warning').length;
  const errorRowsCount = included.filter((r) => r.status === 'error').length;
  const excludedCount = rows.filter((r) => r.excluded).length;

  const readyRows: PautaGeralRow[] = included
    .filter((r) => r.status !== 'error' && r.matchedStudent !== null && r.average !== null)
    .map((r, idx) => {
      const cleanGrades: Record<string, number> = {};
      for (const disc of expectedDisciplines) {
        cleanGrades[disc] = r.grades[disc] ?? 0;
      }
      return {
        order: idx + 1,
        studentId: r.matchedStudent!.id,
        studentNumber: r.matchedStudent!.studentNumber,
        studentName: r.matchedStudent!.name,
        grades: cleanGrades,
        average: r.average!,
        status: r.academicStatus!,
      };
    });

  const canConfirm =
    globalErrors.length === 0 &&
    errorRowsCount === 0 &&
    readyRows.length > 0;

  return {
    rows,
    report: {
      totalRows: rows.length,
      includedRows: included.length,
      validRows: validRowsCount,
      warningRows: warningRowsCount,
      errorRows: errorRowsCount,
      excludedRows: excludedCount,
      missingStudents,
      duplicateMatriculas,
      invalidGradesCount,
      missingDisciplines,
      unknownDisciplines: activeUnknownDisciplines,
      globalErrors,
      globalWarnings,
    },
    canConfirm,
    readyRows,
  };
}

export function findExistingPautaConflict(
  existingPautas: PautaGeral[],
  context: PautaContextSelection
): PautaGeral | undefined {
  return existingPautas.find(
    (p) =>
      p.courseId === context.courseId &&
      p.classId === context.classId &&
      p.academicYear === context.academicYear &&
      p.period === context.period
  );
}

export function commitPautaImport(params: {
  existingPautas: PautaGeral[];
  previewResult: PautaPreviewResult;
  context: PautaContextSelection;
  disciplines: string[];
  fileName: string;
  author: string;
  overwriteConfirmed?: boolean;
}):
  | { status: 'invalid'; error: string }
  | { status: 'requires_confirmation'; existingPauta: PautaGeral }
  | { status: 'saved'; pauta: PautaGeral; auditLog: PautaGeralAuditLog; allPautas: PautaGeral[] } {
  const {
    existingPautas,
    previewResult,
    context,
    disciplines,
    fileName,
    author,
    overwriteConfirmed = false,
  } = params;

  if (!previewResult.canConfirm || previewResult.readyRows.length === 0) {
    return {
      status: 'invalid',
      error:
        previewResult.report.globalErrors[0] ||
        'Existem erros de validação por resolver ou excluir antes de confirmar a importação.',
    };
  }

  const now = formatTimestampNow();
  const existing = findExistingPautaConflict(existingPautas, context);

  if (existing && !overwriteConfirmed) {
    return { status: 'requires_confirmation', existingPauta: existing };
  }

  const summary = summarizePautaRows(previewResult.readyRows, disciplines);

  if (existing) {
    const previousSnapshot = {
      version: existing.version,
      savedAt: existing.updatedAt,
      savedBy: existing.updatedBy,
      sourceFileName: existing.sourceFileName,
      note: existing.published ? 'Versão anteriormente publicada' : 'Versão em rascunho',
      rows: existing.rows,
      summary: existing.summary,
    };

    const nextVersion = existing.version + 1;
    const updatedPauta: PautaGeral = {
      ...existing,
      disciplines: [...disciplines],
      rows: previewResult.readyRows,
      summary,
      version: nextVersion,
      versions: [previousSnapshot, ...existing.versions],
      published: false, // Substituição exige nova revisão/publicação pela Secretaria
      publishedAt: undefined,
      publishedBy: undefined,
      sourceFileName: fileName,
      updatedAt: now,
      updatedBy: author,
    };

    const auditLog: PautaGeralAuditLog = {
      id: `pg-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      pautaId: existing.id,
      fileName,
      courseName: context.courseName,
      classId: context.classId,
      academicYear: context.academicYear,
      period: context.period,
      action: 'Substituição Confirmada',
      processedCount: previewResult.report.totalRows,
      validCount: previewResult.readyRows.length,
      errorCount: previewResult.report.errorRows + previewResult.report.excludedRows,
      author,
      timestamp: now,
      details: `Pauta geral atualizada para v${nextVersion} (versão v${existing.version} preservada no histórico). ${previewResult.readyRows.length} estudantes importados.`,
    };

    const allPautas = existingPautas.map((p) => (p.id === existing.id ? updatedPauta : p));
    return { status: 'saved', pauta: updatedPauta, auditLog, allPautas };
  }

  const pautaId = `pg-${context.courseId}-${context.classId.replace(/\s+/g, '')}-${context.academicYear.replace(/\//g, '-')}-${context.period.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`;

  const newPauta: PautaGeral = {
    id: pautaId,
    courseId: context.courseId,
    courseName: context.courseName,
    classLevel: context.classLevel,
    classId: context.classId,
    academicYear: context.academicYear,
    period: context.period,
    disciplines: [...disciplines],
    rows: previewResult.readyRows,
    summary,
    version: 1,
    versions: [],
    published: false,
    sourceFileName: fileName,
    importedAt: now,
    importedBy: author,
    updatedAt: now,
    updatedBy: author,
  };

  const auditLog: PautaGeralAuditLog = {
    id: `pg-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    pautaId,
    fileName,
    courseName: context.courseName,
    classId: context.classId,
    academicYear: context.academicYear,
    period: context.period,
    action: 'Importação Excel',
    processedCount: previewResult.report.totalRows,
    validCount: previewResult.readyRows.length,
    errorCount: previewResult.report.errorRows + previewResult.report.excludedRows,
    author,
    timestamp: now,
    details: `Pauta geral v1 importada como rascunho interno (${previewResult.readyRows.length} estudantes). Aguarda publicação pela Secretaria.`,
  };

  return {
    status: 'saved',
    pauta: newPauta,
    auditLog,
    allPautas: [newPauta, ...existingPautas],
  };
}

export function syncPublishedPautaToStudents(
  pauta: PautaGeral,
  students: Student[]
): Student[] {
  if (!pauta.published) {
    return students;
  }

  const rowByMat = new Map<string, PautaGeralRow>();
  for (const row of pauta.rows) {
    rowByMat.set(row.studentNumber.trim().toLowerCase(), row);
  }

  return students.map((student) => {
    const row = rowByMat.get(student.studentNumber.trim().toLowerCase());
    if (!row) return student;

    const existingDiscMap = new Map(
      student.disciplines.map((d) => [normalizeText(d.name), d])
    );

    const updatedDisciplines = student.disciplines.map((disc) => {
      const matchedName = Object.keys(row.grades).find(
        (k) => normalizeText(k) === normalizeText(disc.name)
      );
      if (!matchedName) return disc;
      const gradeVal = row.grades[matchedName];
      const nextGrades = { ...disc.grades };
      if (pauta.period === '1º Trimestre') nextGrades.periodo1 = gradeVal;
      else if (pauta.period === '2º Trimestre') nextGrades.periodo2 = gradeVal;
      else if (pauta.period === '3º Trimestre') nextGrades.periodo3 = gradeVal;
      else {
        nextGrades.periodo1 = gradeVal;
        nextGrades.periodo2 = gradeVal;
        nextGrades.periodo3 = gradeVal;
      }
      return { ...disc, grades: nextGrades };
    });

    // Append any curriculum discipline present in PautaGeral that wasn't on the student's array yet
    for (const discName of pauta.disciplines) {
      if (!existingDiscMap.has(normalizeText(discName)) && row.grades[discName] !== undefined) {
        const val = row.grades[discName];
        updatedDisciplines.push({
          id: `disc-${normalizeText(discName).replace(/\s+/g, '-')}`,
          name: discName,
          grades: {
            periodo1: pauta.period === '1º Trimestre' || pauta.period === 'Final Anual' ? val : 0,
            periodo2: pauta.period === '2º Trimestre' || pauta.period === 'Final Anual' ? val : 0,
            periodo3: pauta.period === '3º Trimestre' || pauta.period === 'Final Anual' ? val : 0,
          },
        });
      }
    }

    const recalculatedOverall = calculateOverallAverage(updatedDisciplines);
    return {
      ...student,
      disciplines: updatedDisciplines,
      overallAverage: recalculatedOverall,
    };
  });
}

export interface StudentPublishedPautaView {
  pautaId: string;
  courseName: string;
  classLevel: string;
  classId: string;
  academicYear: string;
  period: PautaPeriod;
  publishedAt?: string;
  version: number;
  disciplines: string[];
  myRow: PautaGeralRow;
}

/**
 * Strict student isolation:
 * - Never returns unpublished pautas (published === false)
 * - Never leaks grades of other students
 */
export function getStudentPublishedPautas(
  pautas: PautaGeral[],
  studentNumber: string
): StudentPublishedPautaView[] {
  const targetMat = studentNumber.trim().toLowerCase();
  if (!targetMat) return [];

  const result: StudentPublishedPautaView[] = [];
  for (const pauta of pautas) {
    if (!pauta.published) continue;
    const myRow = pauta.rows.find(
      (r) => r.studentNumber.trim().toLowerCase() === targetMat
    );
    if (!myRow) continue;

    result.push({
      pautaId: pauta.id,
      courseName: pauta.courseName,
      classLevel: pauta.classLevel,
      classId: pauta.classId,
      academicYear: pauta.academicYear,
      period: pauta.period,
      publishedAt: pauta.publishedAt,
      version: pauta.version,
      disciplines: [...pauta.disciplines],
      myRow: {
        ...myRow,
        grades: { ...myRow.grades },
      },
    });
  }
  return result;
}

// ==========================================
// EXCEL TEMPLATE & EXPORTERS (.xlsx / .xls)
// ==========================================

function writeWorkbookToArrayBuffer(
  workbook: XLSX.WorkBook,
  format: ExcelExportFormat = 'xlsx'
): ArrayBuffer {
  const bookType = format === 'xls' ? 'biff8' : 'xlsx';
  const out = XLSX.write(workbook, { type: 'array', bookType });
  if (out instanceof ArrayBuffer) return out;
  const uint = new Uint8Array(out as ArrayLike<number>);
  return uint.buffer.slice(uint.byteOffset, uint.byteOffset + uint.byteLength);
}

export function generateOfficialPautaTemplateWorkbook(params: {
  courseName: string;
  classLevel: string;
  classId: string;
  academicYear: string;
  period: PautaPeriod;
  students: Student[];
  disciplines: string[];
  format?: ExcelExportFormat;
}): ArrayBuffer {
  const {
    courseName,
    classLevel,
    classId,
    academicYear,
    period,
    students,
    disciplines,
    format = 'xlsx',
  } = params;

  const headerMetadata: unknown[][] = [
    [INSTITUTION_INFO.name.toUpperCase()],
    [`Licença Oficial: ${INSTITUTION_INFO.license} | ${INSTITUTION_INFO.locationText}`],
    ['MODELO OFICIAL DE PAUTA GERAL — ITPSS SAMIASSO'],
    ['Curso:', courseName, 'Classe:', classLevel, 'Turma:', classId],
    ['Ano Letivo:', academicYear, 'Período Académico:', period],
    [],
    ['Nº', 'Matrícula', 'Nome do estudante', ...disciplines],
  ];

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
  const studentRows: unknown[][] = sortedStudents.map((s, idx) => [
    idx + 1,
    s.studentNumber,
    s.name,
    ...disciplines.map(() => ''),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([...headerMetadata, ...studentRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 30 },
    ...disciplines.map((d) => ({ wch: Math.max(16, d.length + 4) })),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pauta Geral');

  const instructionsSheet = XLSX.utils.aoa_to_sheet([
    ['INSTRUÇÕES DE PREENCHIMENTO DA PAUTA GERAL — ITPSS'],
    ['1. Não altere os números de matrícula dos estudantes.'],
    ['2. Preencha as notas de cada disciplina na escala oficial de 0 a 20 (decimais com ponto ou vírgula).'],
    ['3. Não adicione estudantes não matriculados diretamente no ficheiro; registe-os primeiro na Secretaria.'],
    ['4. Após o preenchimento, importe este ficheiro no Painel da Secretaria -> Resultados & Pautas Gerais.'],
  ]);
  instructionsSheet['!cols'] = [{ wch: 90 }];
  XLSX.utils.book_append_sheet(wb, instructionsSheet, 'Instruções');

  return writeWorkbookToArrayBuffer(wb, format);
}

export function exportPautaGeralWorkbook(
  pauta: PautaGeral,
  format: ExcelExportFormat = 'xlsx'
): ArrayBuffer {
  const header: unknown[][] = [
    [INSTITUTION_INFO.name.toUpperCase()],
    [`PAUTA GERAL OFICIAL · Versão ${pauta.version} · ${pauta.published ? 'PUBLICADA' : 'RASCUNHO INTERNO'}`],
    ['Curso:', pauta.courseName, 'Classe:', pauta.classLevel, 'Turma:', pauta.classId],
    ['Ano Letivo:', pauta.academicYear, 'Período Académico:', pauta.period],
    [],
    ['Nº', 'Matrícula', 'Nome do estudante', ...pauta.disciplines, 'Média Geral', 'Situação'],
  ];

  const rows: unknown[][] = pauta.rows.map((r) => [
    r.order,
    r.studentNumber,
    r.studentName,
    ...pauta.disciplines.map((d) => r.grades[d] ?? ''),
    r.average,
    r.status,
  ]);

  const summaryRows: unknown[][] = [
    [],
    ['Resumo Estatístico da Turma'],
    ['Total de estudantes', pauta.summary.totalStudents],
    ['Aprovados (>= 9.5)', pauta.summary.approvedCount],
    ['Recurso (7.0 - 9.4)', pauta.summary.recursoCount],
    ['Reprovados (< 7.0)', pauta.summary.reprovedCount],
    ['Taxa de aprovação (%)', `${pauta.summary.passRate}%`],
    ['Média da turma', pauta.summary.classAverage],
  ];

  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows, ...summaryRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 28 },
    ...pauta.disciplines.map((d) => ({ wch: Math.max(15, d.length + 3) })),
    { wch: 14 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pauta Geral');
  return writeWorkbookToArrayBuffer(wb, format);
}

export function exportStudentResultsWorkbook(
  student: Student,
  publishedPautas: StudentPublishedPautaView[],
  format: ExcelExportFormat = 'xlsx'
): ArrayBuffer {
  const header: unknown[][] = [
    [INSTITUTION_INFO.name.toUpperCase()],
    ['BOLETIM INDIVIDUAL DE RESULTADOS ACADÉMICOS'],
    ['Estudante:', student.name, 'Matrícula:', student.studentNumber],
    ['Curso:', student.courseName, 'Classe / Turma:', `${student.classLevel} · ${student.classId}`],
    ['Ano Letivo:', student.academicYear, 'Média Global:', student.overallAverage],
    [],
    ['Disciplina', '1.º Trimestre', '2.º Trimestre', '3.º Trimestre', 'Média Anual', 'Situação'],
  ];

  const rows: unknown[][] = student.disciplines.map((d) => {
    const avg = calculateDisciplineAverage(d.grades);
    return [
      d.name,
      d.grades.periodo1,
      d.grades.periodo2,
      d.grades.periodo3,
      avg,
      determineAcademicStatus(avg),
    ];
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  ws['!cols'] = [
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, 'Histórico Individual');

  if (publishedPautas.length > 0) {
    const pautaRows: unknown[][] = [
      ['PAUTAS GERAIS HOMOLOGADAS DO ESTUDANTE'],
      ['Período', 'Ano Letivo', 'Turma', 'Disciplina', 'Nota', 'Média Geral', 'Situação'],
    ];
    for (const p of publishedPautas) {
      for (const disc of p.disciplines) {
        pautaRows.push([
          p.period,
          p.academicYear,
          p.classId,
          disc,
          p.myRow.grades[disc] ?? '-',
          p.myRow.average,
          p.myRow.status,
        ]);
      }
    }
    const wsPautas = XLSX.utils.aoa_to_sheet(pautaRows);
    wsPautas['!cols'] = [
      { wch: 15 },
      { wch: 13 },
      { wch: 10 },
      { wch: 26 },
      { wch: 10 },
      { wch: 13 },
      { wch: 13 },
    ];
    XLSX.utils.book_append_sheet(wb, wsPautas, 'Pautas Publicadas');
  }

  return writeWorkbookToArrayBuffer(wb, format);
}

export function exportDisciplineResultsWorkbook(
  pauta: PautaGeral,
  disciplineName: string,
  format: ExcelExportFormat = 'xlsx'
): ArrayBuffer {
  const grades = pauta.rows.map((r) => r.grades[disciplineName] ?? 0);
  const avg =
    grades.length > 0
      ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10
      : 0;
  const approved = grades.filter((g) => g >= 9.5).length;
  const passRate = grades.length > 0 ? Math.round((approved / grades.length) * 100) : 0;

  const header: unknown[][] = [
    [INSTITUTION_INFO.name.toUpperCase()],
    [`PAUTA POR DISCIPLINA — ${disciplineName.toUpperCase()}`],
    ['Curso:', pauta.courseName, 'Turma:', pauta.classId, 'Período:', pauta.period],
    ['Ano Letivo:', pauta.academicYear, 'Média da Disciplina:', avg, 'Aprovação:', `${passRate}%`],
    [],
    ['Nº', 'Matrícula', 'Nome do estudante', disciplineName, 'Situação na Disciplina'],
  ];

  const rows: unknown[][] = pauta.rows.map((r) => {
    const val = r.grades[disciplineName] ?? 0;
    return [r.order, r.studentNumber, r.studentName, val, determineAcademicStatus(val)];
  });

  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  ws['!cols'] = [{ wch: 6 }, { wch: 16 }, { wch: 30 }, { wch: 22 }, { wch: 22 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Por Disciplina');
  return writeWorkbookToArrayBuffer(wb, format);
}

export function exportAchievementReportWorkbook(
  pautas: PautaGeral[],
  format: ExcelExportFormat = 'xlsx'
): ArrayBuffer {
  const header: unknown[][] = [
    [INSTITUTION_INFO.name.toUpperCase()],
    ['RELATÓRIO DE APROVEITAMENTO ACADÉMICO POR TURMA E PERÍODO'],
    ['Gerado em:', formatTimestampNow()],
    [],
    [
      'Curso',
      'Classe',
      'Turma',
      'Ano Letivo',
      'Período',
      'Versão',
      'Estado',
      'Total Alunos',
      'Aprovados',
      'Recurso',
      'Reprovados',
      'Taxa Aprovação (%)',
      'Média Turma',
    ],
  ];

  const rows: unknown[][] = pautas.map((p) => [
    p.courseName,
    p.classLevel,
    p.classId,
    p.academicYear,
    p.period,
    `v${p.version}`,
    p.published ? 'Publicada' : 'Rascunho',
    p.summary.totalStudents,
    p.summary.approvedCount,
    p.summary.recursoCount,
    p.summary.reprovedCount,
    p.summary.passRate,
    p.summary.classAverage,
  ]);

  const disciplineRows: unknown[][] = [
    ['DETALHE POR DISCIPLINA'],
    ['Curso', 'Turma', 'Período', 'Disciplina', 'Média', 'Mínima', 'Máxima', 'Aprovados', 'Taxa (%)'],
  ];
  for (const p of pautas) {
    for (const st of p.summary.disciplineStats) {
      disciplineRows.push([
        p.courseName,
        p.classId,
        p.period,
        st.discipline,
        st.average,
        st.min,
        st.max,
        st.approvedCount,
        st.passRate,
      ]);
    }
  }

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  wsSummary['!cols'] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 11 },
    { wch: 10 },
    { wch: 11 },
    { wch: 18 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo por Turma');

  const wsDisc = XLSX.utils.aoa_to_sheet(disciplineRows);
  wsDisc['!cols'] = [
    { wch: 22 },
    { wch: 10 },
    { wch: 14 },
    { wch: 26 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 11 },
    { wch: 11 },
  ];
  XLSX.utils.book_append_sheet(wb, wsDisc, 'Por Disciplina');

  return writeWorkbookToArrayBuffer(wb, format);
}

export function downloadExcelBuffer(buffer: ArrayBuffer, filename: string): void {
  if (typeof window === 'undefined') return;
  const isXls = filename.toLowerCase().endsWith('.xls');
  const mimeType = isXls
    ? 'application/vnd.ms-excel'
    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
