import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDisciplineAverage,
  calculateOverallAverage,
  determineAcademicStatus,
  formatKwanza,
  validatePreEnrollment,
  hasPermission,
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
  // (15.0 + 14.0 + 13.7 + 16.0 + 15.0) / 5 = 73.7 / 5 = 14.74 -> 14.7
  assert.equal(overall, 14.7);
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
  // Empty data
  const emptyRes = validatePreEnrollment({
    fullName: '',
    phone: '',
    classLevel: '',
    courseId: '',
  });
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.errors.fullName);
  assert.ok(emptyRes.errors.phone);
  assert.ok(emptyRes.errors.classLevel);
  assert.ok(emptyRes.errors.courseId);

  // Valid data
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

test('hasPermission enforces role boundaries', () => {
  assert.equal(hasPermission('guest', 'public'), true);
  assert.equal(hasPermission('guest', 'admin'), false);
  assert.equal(hasPermission('guest', 'student'), false);

  assert.equal(hasPermission('student', 'public'), true);
  assert.equal(hasPermission('student', 'student'), true);
  assert.equal(hasPermission('student', 'admin'), false);

  assert.equal(hasPermission('admin', 'public'), true);
  assert.equal(hasPermission('admin', 'student'), true);
  assert.equal(hasPermission('admin', 'admin'), true);
});
