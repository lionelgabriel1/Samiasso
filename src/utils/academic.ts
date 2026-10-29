/**
 * Pure business logic for ITPSS platform:
 * - Academic calculations (averages, passing status)
 * - Financial formatting (Kwanza currency)
 * - Validation rules
 * - Role-based access control
 */

export interface GradeEntry {
  periodo1: number;
  periodo2: number;
  periodo3: number;
}

export interface DisciplineGrades {
  id: string;
  name: string;
  grades: GradeEntry;
}

export type AcademicStatus = 'Aprovado' | 'Recurso' | 'Reprovado';

export interface PreEnrollmentInput {
  fullName: string;
  phone: string;
  classLevel: '10ª' | '11ª' | '';
  courseId: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type UserRole = 'admin' | 'student' | 'guest';

/**
 * Calculates student average from 3 evaluation periods.
 * Rounded to 1 decimal place.
 */
export function calculateDisciplineAverage(grades: GradeEntry): number {
  const sum = grades.periodo1 + grades.periodo2 + grades.periodo3;
  return Math.round((sum / 3) * 10) / 10;
}

/**
 * Calculates overall academic average across all disciplines.
 */
export function calculateOverallAverage(disciplines: DisciplineGrades[]): number {
  if (!disciplines || disciplines.length === 0) return 0;
  const averages = disciplines.map(d => calculateDisciplineAverage(d.grades));
  const total = averages.reduce((acc, curr) => acc + curr, 0);
  return Math.round((total / averages.length) * 10) / 10;
}

/**
 * Determines academic status based on standard Angolan technical secondary education scale:
 * >= 10.0: Aprovado
 * >= 7.0 and < 10.0: Recurso (Exame)
 * < 7.0: Reprovado
 */
export function determineAcademicStatus(average: number): AcademicStatus {
  if (average >= 9.5) return 'Aprovado';
  if (average >= 7.0) return 'Recurso';
  return 'Reprovado';
}

/**
 * Formats a monetary amount into Angolan Kwanzas.
 * Example: 25000 -> "25 000 Kz"
 */
export function formatKwanza(amount: number): string {
  if (amount === 0) return 'Grátis';
  // Use non-breaking space or standard space formatting
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} Kz`;
}

/**
 * Validates pre-enrollment form submission.
 */
export function validatePreEnrollment(data: PreEnrollmentInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = 'O nome completo deve ter pelo menos 3 caracteres.';
  }

  const phoneClean = data.phone ? data.phone.replace(/[\s-]/g, '') : '';
  if (!phoneClean || phoneClean.length < 9) {
    errors.phone = 'Informe um número de telefone válido (mínimo 9 dígitos).';
  }

  if (!data.classLevel || (data.classLevel !== '10ª' && data.classLevel !== '11ª')) {
    errors.classLevel = 'Selecione a classe pretendida (10.ª ou 11.ª).';
  }

  if (!data.courseId || data.courseId.trim() === '') {
    errors.courseId = 'Selecione o curso de interesse.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Checks role permissions for system modules.
 */
export function hasPermission(role: UserRole, module: 'admin' | 'student' | 'public'): boolean {
  if (module === 'public') return true;
  if (role === 'admin') return true; // admin can access all
  if (role === 'student' && module === 'student') return true;
  return false;
}
