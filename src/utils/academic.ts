/**
 * Pure business logic for ITPSS platform:
 * - Academic calculations (averages, passing status, minipauta formulas)
 * - Financial formatting (Kwanza currency)
 * - CSV/Excel minipauta parser & validator
 * - Role-based access control (Admin, Secretaria, Estudante)
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

export type UserRole = 'admin' | 'secretaria' | 'student' | 'guest';

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
 * Calculates final trimester grade from MAC, NPP, and optional NPT
 * Standard Angolan technical education formula:
 * If NPT is present: (MAC + NPP + NPT) / 3
 * If NPT is omitted: (MAC + NPP) / 2
 */
export function calculateTrimestralGrade(mac: number, npp: number, npt?: number): number {
  const safeMac = Math.min(20, Math.max(0, mac || 0));
  const safeNpp = Math.min(20, Math.max(0, npp || 0));

  if (npt !== undefined && npt !== null && !isNaN(npt) && npt >= 0) {
    const safeNpt = Math.min(20, Math.max(0, npt));
    const finalGrade = (safeMac + safeNpp + safeNpt) / 3;
    return Math.round(finalGrade * 10) / 10;
  }

  const finalGrade = (safeMac + safeNpp) / 2;
  return Math.round(finalGrade * 10) / 10;
}

/**
 * Determines academic status based on standard Angolan technical secondary education scale:
 * >= 9.5: Aprovado
 * >= 7.0 and < 9.5: Recurso (Exame)
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
export function hasPermission(
  role: UserRole,
  module: 'admin' | 'secretaria' | 'student' | 'public'
): boolean {
  if (module === 'public') return true;
  if (role === 'admin') return true;
  if (role === 'secretaria') {
    return module === 'secretaria' || module === 'admin';
  }
  if (role === 'student') return module === 'student';
  return false;
}

/**
 * Parses and validates CSV string for Minipautas.
 * Expected columns: Numero, Nome, MAC, NPP, NPT, Observacao
 */
export interface ParsedCSVEntry {
  studentNumber: string;
  studentName: string;
  mac: number;
  npp: number;
  npt?: number;
  notaFinal: number;
  observacao?: string;
}

export function parseMinipautaCSV(csvContent: string): {
  valid: boolean;
  entries: ParsedCSVEntry[];
  errors: string[];
} {
  const lines = csvContent.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  const errors: string[] = [];
  const entries: ParsedCSVEntry[] = [];

  if (lines.length < 2) {
    return {
      valid: false,
      entries: [],
      errors: ['O ficheiro CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.'],
    };
  }

  // Parse lines, skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // support semicolon or comma separation
    const delimiter = line.includes(';') ? ';' : ',';
    const parts = line.split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));

    if (parts.length < 4) {
      errors.push(`Linha ${i + 1}: Dados insuficientes (mínimo de 4 colunas: Número, Nome, MAC, NPP).`);
      continue;
    }

    const studentNumber = parts[0];
    const studentName = parts[1];
    const mac = parseFloat(parts[2].replace(',', '.'));
    const npp = parseFloat(parts[3].replace(',', '.'));
    const npt = parts[4] ? parseFloat(parts[4].replace(',', '.')) : undefined;
    const observacao = parts[5] || '';

    if (!studentNumber) {
      errors.push(`Linha ${i + 1}: Número de matrícula não informado.`);
    }
    if (!studentName) {
      errors.push(`Linha ${i + 1}: Nome do aluno não informado.`);
    }
    if (isNaN(mac) || mac < 0 || mac > 20) {
      errors.push(`Linha ${i + 1}: MAC inválida "${parts[2]}" (deve estar entre 0 e 20).`);
    }
    if (isNaN(npp) || npp < 0 || npp > 20) {
      errors.push(`Linha ${i + 1}: NPP inválida "${parts[3]}" (deve estar entre 0 e 20).`);
    }
    if (npt !== undefined && (isNaN(npt) || npt < 0 || npt > 20)) {
      errors.push(`Linha ${i + 1}: NPT inválida "${parts[4]}" (deve estar entre 0 e 20).`);
    }

    if (errors.length === 0) {
      const notaFinal = calculateTrimestralGrade(mac, npp, npt);
      entries.push({
        studentNumber,
        studentName,
        mac,
        npp,
        npt: isNaN(npt as number) ? undefined : npt,
        notaFinal,
        observacao,
      });
    }
  }

  return {
    valid: errors.length === 0 && entries.length > 0,
    entries,
    errors,
  };
}
