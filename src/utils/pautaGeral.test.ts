import test from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import {
  autoDetectSheetStructure,
  ColumnMapping,
  commitPautaImport,
  exportAchievementReportWorkbook,
  exportDisciplineResultsWorkbook,
  exportPautaGeralWorkbook,
  exportStudentResultsWorkbook,
  generateOfficialPautaTemplateWorkbook,
  getCurriculumDisciplines,
  getStudentPublishedPautas,
  inspectExcelWorkbook,
  PautaContextSelection,
  syncPublishedPautaToStudents,
  validateAndPreviewPautaImport,
} from './pautaGeral.ts';
import { INITIAL_STUDENTS } from '../data/initialData.ts';
import { PautaGeral } from '../types/index.ts';

function buildBufferFromAoa(
  aoa: unknown[][],
  bookType: 'xlsx' | 'biff8' = 'xlsx',
  sheetName = 'Pauta'
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const out = XLSX.write(wb, { type: 'array', bookType });
  if (out instanceof ArrayBuffer) return out;
  const u8 = new Uint8Array(out as ArrayLike<number>);
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

const ENFERMAGEM_10A_CONTEXT: PautaContextSelection = {
  courseId: 'enfermagem-geral',
  courseName: 'Enfermagem Geral',
  classLevel: '10.ª Classe',
  classId: '10ª A',
  academicYear: '2024/2025',
  period: '2º Trimestre',
};

const ENFERMAGEM_DISCIPLINES = getCurriculumDisciplines('enfermagem-geral');

test('1. Importação válida de ficheiro Excel (.xlsx e .xls)', () => {
  for (const format of ['xlsx', 'biff8'] as const) {
    const buffer = buildBufferFromAoa(
      [
        ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
        [1, '2024-0142', 'Ana Silva', 15, 14.5, 13, 16, 15],
        [2, '2024-0143', 'João Baptista Kiala', 12, 13, 11.5, 14, 13],
        [3, '2024-0144', 'Esperança Domingos', 17, 16, 15, 18, 16],
      ],
      format
    );

    const inspected = inspectExcelWorkbook(buffer);
    assert.equal(inspected.ok, true);
    assert.equal(inspected.sheetNames[0], 'Pauta');

    const sheetRows = inspected.sheets['Pauta'];
    const mapping = autoDetectSheetStructure(sheetRows, ENFERMAGEM_DISCIPLINES);
    const preview = validateAndPreviewPautaImport({
      sheetRows,
      mapping,
      context: ENFERMAGEM_10A_CONTEXT,
      expectedDisciplines: ENFERMAGEM_DISCIPLINES,
      registeredStudents: INITIAL_STUDENTS,
    });

    assert.equal(preview.canConfirm, true);
    assert.equal(preview.report.validRows, 3);
    assert.equal(preview.report.errorRows, 0);

    const commitRes = commitPautaImport({
      existingPautas: [],
      previewResult: preview,
      context: ENFERMAGEM_10A_CONTEXT,
      disciplines: ENFERMAGEM_DISCIPLINES,
      fileName: `pauta_valid.${format === 'biff8' ? 'xls' : 'xlsx'}`,
      author: 'Secretaria Geral',
    });

    assert.equal(commitRes.status, 'saved');
    if (commitRes.status === 'saved') {
      assert.equal(commitRes.pauta.published, false);
      assert.equal(commitRes.pauta.version, 1);
      assert.equal(commitRes.pauta.rows.length, 3);
      assert.equal(commitRes.auditLog.action, 'Importação Excel');
    }
  }
});

test('2. Importação de Excel com nomes de colunas diferentes / associação manual', () => {
  const buffer = buildBufferFromAoa([
    ['Documento Externo de Avaliação'],
    ['Registo: Turma 10A'],
    ['Código Interno', 'Aluno Completo', 'Cadeira A (Anat)', 'Cadeira B (Fis)', 'Cadeira C (Farm)', 'Cadeira D (Enf)', 'Cadeira E (SP)'],
    ['2024-0142', 'Ana Silva', 16, 15, 14, 17, 16],
  ]);

  const inspected = inspectExcelWorkbook(buffer);
  assert.equal(inspected.ok, true);
  const sheetRows = inspected.sheets['Pauta'];

  // Simular associação manual quando os cabeçalhos externos são arbitrários
  const manualMapping: ColumnMapping = {
    headerRowIndex: 2,
    rawHeaders: sheetRows[2].map((c) => String(c)),
    orderColIndex: null,
    matriculaColIndex: 0,
    nomeColIndex: 1,
    disciplineColMap: {
      Anatomia: 2,
      Fisiologia: 3,
      Farmacologia: 4,
      'Enfermagem Geral': 5,
      'Saúde Pública': 6,
    },
    unmappedExtraCols: [],
  };

  const preview = validateAndPreviewPautaImport({
    sheetRows,
    mapping: manualMapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(preview.canConfirm, true);
  assert.equal(preview.readyRows[0].studentNumber, '2024-0142');
  assert.equal(preview.readyRows[0].grades['Anatomia'], 16);
});

test('3. Matrícula inexistente gera erro e não cria estudante automaticamente', () => {
  const initialCount = INITIAL_STUDENTS.length;
  const buffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-9999', 'Estudante Desconhecido', 15, 14, 13, 15, 14],
    [2, '2024-0142', 'Ana Silva', 15, 14, 13, 15, 14],
  ]);

  const inspected = inspectExcelWorkbook(buffer);
  const sheetRows = inspected.sheets['Pauta'];
  const mapping = autoDetectSheetStructure(sheetRows, ENFERMAGEM_DISCIPLINES);
  const preview = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(preview.canConfirm, false);
  assert.equal(preview.report.missingStudents.includes('2024-9999'), true);
  assert.equal(preview.report.errorRows, 1);
  assert.equal(INITIAL_STUDENTS.length, initialCount);

  // Deve permitir rejeitar apenas a linha inválida e importar a válida
  const filteredPreview = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
    excludedRowKeys: new Set([preview.rows[0].rowKey]),
  });

  assert.equal(filteredPreview.canConfirm, true);
  assert.equal(filteredPreview.readyRows.length, 1);
  assert.equal(filteredPreview.readyRows[0].studentNumber, '2024-0142');
});

test('4. Estudante duplicado no ficheiro é detetado e bloqueado', () => {
  const buffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 15, 14, 13, 15, 14],
    [2, '2024-0142', 'Ana Silva', 16, 15, 14, 16, 15],
  ]);

  const inspected = inspectExcelWorkbook(buffer);
  const sheetRows = inspected.sheets['Pauta'];
  const mapping = autoDetectSheetStructure(sheetRows, ENFERMAGEM_DISCIPLINES);
  const preview = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(preview.canConfirm, false);
  assert.deepEqual(preview.report.duplicateMatriculas, ['2024-0142']);
  assert.equal(preview.rows[1].status, 'error');
});

test('5. Nota inválida (fora de 0-20, texto ou em falta) é identificada e pode ser corrigida', () => {
  const buffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 25, 'ABC', -1, 16, ''],
  ]);

  const inspected = inspectExcelWorkbook(buffer);
  const sheetRows = inspected.sheets['Pauta'];
  const mapping = autoDetectSheetStructure(sheetRows, ENFERMAGEM_DISCIPLINES);
  const preview = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(preview.canConfirm, false);
  assert.equal(preview.report.invalidGradesCount, 4);
  assert.ok(preview.rows[0].cellErrors['Anatomia']);
  assert.ok(preview.rows[0].cellErrors['Fisiologia']);
  assert.ok(preview.rows[0].cellErrors['Farmacologia']);
  assert.ok(preview.rows[0].cellErrors['Saúde Pública']);

  // Correção inline na pré-visualização deve validar a linha
  const corrected = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
    manualRowEdits: {
      [preview.rows[0].rowKey]: {
        grades: {
          Anatomia: '15',
          Fisiologia: '14',
          Farmacologia: '13',
          'Saúde Pública': '15',
        },
      },
    },
  });

  assert.equal(corrected.canConfirm, true);
  assert.equal(corrected.readyRows[0].average, 14.6);
});

test('6. Disciplina que não pertence à turma é detetada na validação curricular', () => {
  const buffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES, 'Física Nuclear'],
    [1, '2024-0142', 'Ana Silva', 15, 14, 13, 16, 15, 18],
  ]);

  const inspected = inspectExcelWorkbook(buffer);
  const sheetRows = inspected.sheets['Pauta'];
  const mapping = autoDetectSheetStructure(sheetRows, ENFERMAGEM_DISCIPLINES);
  const preview = validateAndPreviewPautaImport({
    sheetRows,
    mapping,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(preview.canConfirm, false);
  assert.deepEqual(preview.report.unknownDisciplines, ['Física Nuclear']);
  assert.ok(
    preview.report.globalErrors.some((msg) => msg.includes('Física Nuclear'))
  );
});

test('7. Ficheiro vazio ou corrompido é rejeitado com segurança', () => {
  const emptyRes = inspectExcelWorkbook(new ArrayBuffer(0));
  assert.equal(emptyRes.ok, false);
  assert.ok(emptyRes.error);

  const corruptBytes = new TextEncoder().encode('ISTO_NAO_E_UM_EXCEL_VALIDO_###@@@').buffer;
  const corruptRes = inspectExcelWorkbook(corruptBytes);
  assert.equal(corruptRes.ok, false);
  assert.ok(corruptRes.error);

  const emptySheetBuffer = buildBufferFromAoa([]);
  const emptySheetRes = inspectExcelWorkbook(emptySheetBuffer);
  assert.equal(emptySheetRes.ok, false);
  assert.ok(emptySheetRes.error);
});

test('8. Importação de pauta já existente exige confirmação e preserva versão anterior', () => {
  const bufferV1 = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 14, 14, 14, 14, 14],
  ]);
  const inspected1 = inspectExcelWorkbook(bufferV1);
  const map1 = autoDetectSheetStructure(inspected1.sheets['Pauta'], ENFERMAGEM_DISCIPLINES);
  const preview1 = validateAndPreviewPautaImport({
    sheetRows: inspected1.sheets['Pauta'],
    mapping: map1,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  const saved1 = commitPautaImport({
    existingPautas: [],
    previewResult: preview1,
    context: ENFERMAGEM_10A_CONTEXT,
    disciplines: ENFERMAGEM_DISCIPLINES,
    fileName: 'pauta_v1.xlsx',
    author: 'Secretaria Geral',
  });
  assert.equal(saved1.status, 'saved');
  if (saved1.status !== 'saved') return;

  const existingList: PautaGeral[] = [saved1.pauta];

  // Nova importação para o mesmo curso/turma/ano/período sem confirmação explícita
  const bufferV2 = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 17, 16, 15, 18, 17],
  ]);
  const inspected2 = inspectExcelWorkbook(bufferV2);
  const map2 = autoDetectSheetStructure(inspected2.sheets['Pauta'], ENFERMAGEM_DISCIPLINES);
  const preview2 = validateAndPreviewPautaImport({
    sheetRows: inspected2.sheets['Pauta'],
    mapping: map2,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  const blocked = commitPautaImport({
    existingPautas: existingList,
    previewResult: preview2,
    context: ENFERMAGEM_10A_CONTEXT,
    disciplines: ENFERMAGEM_DISCIPLINES,
    fileName: 'pauta_v2.xlsx',
    author: 'Secretaria Geral',
    overwriteConfirmed: false,
  });
  assert.equal(blocked.status, 'requires_confirmation');

  // Após confirmação explícita: gera v2 e preserva v1 no histórico
  const confirmed = commitPautaImport({
    existingPautas: existingList,
    previewResult: preview2,
    context: ENFERMAGEM_10A_CONTEXT,
    disciplines: ENFERMAGEM_DISCIPLINES,
    fileName: 'pauta_v2.xlsx',
    author: 'Secretaria Geral',
    overwriteConfirmed: true,
  });
  assert.equal(confirmed.status, 'saved');
  if (confirmed.status === 'saved') {
    assert.equal(confirmed.pauta.version, 2);
    assert.equal(confirmed.pauta.versions.length, 1);
    assert.equal(confirmed.pauta.versions[0].version, 1);
    assert.equal(confirmed.pauta.versions[0].rows[0].grades['Anatomia'], 14);
    assert.equal(confirmed.pauta.rows[0].grades['Anatomia'], 17);
    assert.equal(confirmed.auditLog.action, 'Substituição Confirmada');
  }
});

test('9. Exportação (modelo, pauta completa, disciplina, estudante, relatório) e reimportação Round-Trip', () => {
  // 9a. Gerar modelo oficial e preencher
  const turmaStudents = INITIAL_STUDENTS.filter((s) => s.classId === '10ª A');
  const templateBuffer = generateOfficialPautaTemplateWorkbook({
    courseName: ENFERMAGEM_10A_CONTEXT.courseName,
    classLevel: ENFERMAGEM_10A_CONTEXT.classLevel,
    classId: ENFERMAGEM_10A_CONTEXT.classId,
    academicYear: ENFERMAGEM_10A_CONTEXT.academicYear,
    period: ENFERMAGEM_10A_CONTEXT.period,
    students: turmaStudents,
    disciplines: ENFERMAGEM_DISCIPLINES,
  });

  const templateInspected = inspectExcelWorkbook(templateBuffer);
  assert.equal(templateInspected.ok, true);
  assert.equal(templateInspected.sheetNames.includes('Pauta Geral'), true);
  assert.equal(templateInspected.sheetNames.includes('Instruções'), true);

  // 9b. Exportar Pauta Geral completa e reimportar o ficheiro exportado
  const pautaBuffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 15, 14, 13, 16, 15],
    [2, '2024-0143', 'João Baptista Kiala', 12, 13, 12, 14, 13],
  ]);
  const insp = inspectExcelWorkbook(pautaBuffer);
  const map = autoDetectSheetStructure(insp.sheets['Pauta'], ENFERMAGEM_DISCIPLINES);
  const prev = validateAndPreviewPautaImport({
    sheetRows: insp.sheets['Pauta'],
    mapping: map,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });
  const saved = commitPautaImport({
    existingPautas: [],
    previewResult: prev,
    context: ENFERMAGEM_10A_CONTEXT,
    disciplines: ENFERMAGEM_DISCIPLINES,
    fileName: 'origem.xlsx',
    author: 'Secretaria Geral',
  });
  assert.equal(saved.status, 'saved');
  if (saved.status !== 'saved') return;

  const exportedBuffer = exportPautaGeralWorkbook(saved.pauta, 'xlsx');
  const reimportedInspected = inspectExcelWorkbook(exportedBuffer);
  assert.equal(reimportedInspected.ok, true);
  const reimportedSheet = reimportedInspected.sheets['Pauta Geral'];
  const reimportedMap = autoDetectSheetStructure(reimportedSheet, ENFERMAGEM_DISCIPLINES);
  const reimportedPreview = validateAndPreviewPautaImport({
    sheetRows: reimportedSheet,
    mapping: reimportedMap,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });

  assert.equal(reimportedPreview.canConfirm, true);
  assert.equal(reimportedPreview.readyRows.length, 2);
  assert.equal(reimportedPreview.readyRows[0].grades['Anatomia'], 15);
  assert.equal(reimportedPreview.readyRows[1].grades['Fisiologia'], 13);

  // Verificar também os outros 3 formatos de exportação (.xlsx e .xls)
  const discBuf = exportDisciplineResultsWorkbook(saved.pauta, 'Anatomia', 'xls');
  assert.equal(inspectExcelWorkbook(discBuf).ok, true);

  const studentBuf = exportStudentResultsWorkbook(INITIAL_STUDENTS[0], [], 'xlsx');
  assert.equal(inspectExcelWorkbook(studentBuf).ok, true);

  const reportBuf = exportAchievementReportWorkbook([saved.pauta], 'xlsx');
  assert.equal(inspectExcelWorkbook(reportBuf).ok, true);
});

test('10. Consulta individual do estudante e isolamento de pautas não publicadas', () => {
  const buffer = buildBufferFromAoa([
    ['Nº', 'Matrícula', 'Nome do estudante', ...ENFERMAGEM_DISCIPLINES],
    [1, '2024-0142', 'Ana Silva', 18, 17, 16, 19, 18],
    [2, '2024-0143', 'João Baptista Kiala', 11, 12, 10, 13, 12],
  ]);

  const insp = inspectExcelWorkbook(buffer);
  const map = autoDetectSheetStructure(insp.sheets['Pauta'], ENFERMAGEM_DISCIPLINES);
  const prev = validateAndPreviewPautaImport({
    sheetRows: insp.sheets['Pauta'],
    mapping: map,
    context: ENFERMAGEM_10A_CONTEXT,
    expectedDisciplines: ENFERMAGEM_DISCIPLINES,
    registeredStudents: INITIAL_STUDENTS,
  });
  const saved = commitPautaImport({
    existingPautas: [],
    previewResult: prev,
    context: ENFERMAGEM_10A_CONTEXT,
    disciplines: ENFERMAGEM_DISCIPLINES,
    fileName: 'pauta_2T.xlsx',
    author: 'Secretaria Geral',
  });
  assert.equal(saved.status, 'saved');
  if (saved.status !== 'saved') return;

  // Enquanto não publicada: NÃO visível ao estudante e NÃO sincronizada nas notas do estudante
  const draftViewAna = getStudentPublishedPautas([saved.pauta], '2024-0142');
  assert.equal(draftViewAna.length, 0);
  const untouchedStudents = syncPublishedPautaToStudents(saved.pauta, INITIAL_STUDENTS);
  assert.equal(
    untouchedStudents.find((s) => s.studentNumber === '2024-0142')?.disciplines[0].grades.periodo2,
    INITIAL_STUDENTS[0].disciplines[0].grades.periodo2
  );

  // Após publicação pela Secretaria: visível apenas para a própria matrícula
  const publishedPauta: PautaGeral = {
    ...saved.pauta,
    published: true,
    publishedAt: '2026-05-01 10:00',
    publishedBy: 'Secretaria Geral',
  };

  const pubViewAna = getStudentPublishedPautas([publishedPauta], '2024-0142');
  assert.equal(pubViewAna.length, 1);
  assert.equal(pubViewAna[0].myRow.studentNumber, '2024-0142');
  assert.equal(pubViewAna[0].myRow.grades['Anatomia'], 18);

  // Outro estudante de outra turma não recebe dados alheios
  const pubViewCarlos = getStudentPublishedPautas([publishedPauta], '2024-0188');
  assert.equal(pubViewCarlos.length, 0);

  // Sincronização atualiza as notas do período publicado para o estudante correspondente
  const syncedStudents = syncPublishedPautaToStudents(publishedPauta, INITIAL_STUDENTS);
  const syncedAna = syncedStudents.find((s) => s.studentNumber === '2024-0142');
  assert.equal(syncedAna?.disciplines.find((d) => d.name === 'Anatomia')?.grades.periodo2, 18);
});
