import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDisciplineAverage,
  calculateOverallAverage,
  calculateTrimestralGrade,
  determineAcademicStatus,
  formatKwanza,
  validatePreEnrollment,
  hasPermission,
  parseMinipautaCSV,
} from './academic.ts';

test('calculateDisciplineAverage computes accurate 1-decimal average', () => {
  const avg1 = calculateDisciplineAverage({ periodo1: 14, periodo2: 15, periodo3: 16 });
  assert.equal(avg1, 15.0);

  const avg2 = calculateDisciplineAverage({ periodo1: 13, periodo2: 14, periodo3: 15 });
  assert.equal(avg2, 14.0);

  const avg3 = calculateDisciplineAverage({ periodo1: 12, periodo2: 14, periodo3: 15 });
  assert.equal(avg3, 13.7);
});

test('calculateOverallAverage computes correct mean across all disciplines', () => {
  const disciplines = [
    { id: '1', name: 'Anatomia', grades: { periodo1: 14, periodo2: 15, periodo3: 16 } }, // 15.0
    { id: '2', name: 'Fisiologia', grades: { periodo1: 13, periodo2: 14, periodo3: 15 } }, // 14.0
    { id: '3', name: 'Farmacologia', grades: { periodo1: 12, periodo2: 14, periodo3: 15 } }, // 13.7
    { id: '4', name: 'Enfermagem Geral', grades: { periodo1: 15, periodo2: 16, periodo3: 17 } }, // 16.0
    { id: '5', name: 'Saúde Pública', grades: { periodo1: 14, periodo2: 15, periodo3: 16 } }, // 15.0
  ];

  const overall = calculateOverallAverage(disciplines);
  assert.equal(overall, 14.7);
});

test('calculateTrimestralGrade calculates trimester grade with or without NPT', () => {
  // Without NPT: (MAC 14 + NPP 16) / 2 = 15.0
  const gradeWithoutNpt = calculateTrimestralGrade(14, 16);
  assert.equal(gradeWithoutNpt, 15.0);

  // With NPT: (MAC 14 + NPP 16 + NPT 15) / 3 = 15.0
  const gradeWithNpt = calculateTrimestralGrade(14, 16, 15);
  assert.equal(gradeWithNpt, 15.0);

  // Clamped to 0..20 bounds
  const clamped = calculateTrimestralGrade(25, -5);
  assert.equal(clamped, 10.0);
});

test('determineAcademicStatus follows Angolan grading classification', () => {
  assert.equal(determineAcademicStatus(14.2), 'Aprovado');
  assert.equal(determineAcademicStatus(10.0), 'Aprovado');
  assert.equal(determineAcademicStatus(9.5), 'Aprovado');
  assert.equal(determineAcademicStatus(8.5), 'Recurso');
  assert.equal(determineAcademicStatus(7.0), 'Recurso');
  assert.equal(determineAcademicStatus(6.9), 'Reprovado');
  assert.equal(determineAcademicStatus(4.0), 'Reprovado');
});

test('formatKwanza formats numbers into correct Angolan Kwanza representation', () => {
  assert.equal(formatKwanza(25000), '25 000 Kz');
  assert.equal(formatKwanza(27500), '27 500 Kz');
  assert.equal(formatKwanza(22500), '22 500 Kz');
  assert.equal(formatKwanza(5000), '5 000 Kz');
  assert.equal(formatKwanza(0), 'Grátis');
});

test('validatePreEnrollment checks mandatory fields', () => {
  const emptyRes = validatePreEnrollment({
    fullName: '',
    phone: '',
    classLevel: '',
    courseId: '',
  });
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.fullName);
  assert.ok(emptyRes.errors.phone);

  const validRes = validatePreEnrollment({
    fullName: 'Gabriel Lionel',
    phone: '+244 938 195 813',
    classLevel: '10ª',
    courseId: 'enfermagem',
    message: 'Interessado no turno da manhã',
  });
  assert.equal(validRes.isValid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);
});

test('hasPermission enforces role boundaries including secretaria', () => {
  assert.equal(hasPermission('guest', 'public'), true);
  assert.equal(hasPermission('guest', 'admin'), false);
  assert.equal(hasPermission('guest', 'secretaria'), false);
  assert.equal(hasPermission('guest', 'student'), false);

  assert.equal(hasPermission('student', 'public'), true);
  assert.equal(hasPermission('student', 'student'), true);
  assert.equal(hasPermission('student', 'admin'), false);
  assert.equal(hasPermission('student', 'secretaria'), false);

  assert.equal(hasPermission('secretaria', 'public'), true);
  assert.equal(hasPermission('secretaria', 'secretaria'), true);
  assert.equal(hasPermission('secretaria', 'admin'), true); // Can access operational admin modules
  assert.equal(hasPermission('secretaria', 'student'), false);

  assert.equal(hasPermission('admin', 'public'), true);
  assert.equal(hasPermission('admin', 'admin'), true);
  assert.equal(hasPermission('admin', 'secretaria'), true);
  assert.equal(hasPermission('admin', 'student'), true);
});

test('parseMinipautaCSV parses valid CSV and reports validation errors', () => {
  const validCsv = `Numero,Nome,MAC,NPP,NPT,Observacao
2024-0142,Ana Silva,15,16,17,Aprovada com mérito
2024-0211,João Baptista,13,14,14,Regular`;

  const result = parseMinipautaCSV(validCsv);
  assert.equal(result.valid, true);
  assert.equal(result.entries.length, 2);
  assert.equal(result.entries[0].studentNumber, '2024-0142');
  assert.equal(result.entries[0].notaFinal, 16.0); // (15 + 16 + 17) / 3 = 16.0

  const invalidCsv = `Numero,Nome,MAC,NPP
2024-0142,Ana Silva,35,16`; // MAC out of bounds (35 > 20)

  const badResult = parseMinipautaCSV(invalidCsv);
  assert.equal(badResult.valid, false);
  assert.ok(badResult.errors.length > 0);
});
