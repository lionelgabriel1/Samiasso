export type UserRole = 'admin' | 'secretaria' | 'student' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentNumber?: string;
  courseId?: string;
  courseName?: string;
  classLevel?: string;
  classId?: string;
  academicYear?: string;
  phone?: string;
  enrollmentStatus?: 'Ativa' | 'Trancada' | 'Pendente' | 'Concluída';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
  image: string;
  classes: string[];
  careerOpportunities: string[];
  practicalFocus: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  frequency: string;
  icon: 'shirt' | 'card' | 'file';
}

export interface GradeEntry {
  periodo1: number;
  periodo2: number;
  periodo3: number;
}

export interface DisciplineGrades {
  id: string;
  name: string;
  grades: GradeEntry;
  teacher?: string;
}

export type StudentEnrollmentStatus = 'Ativa' | 'Trancada' | 'Pendente' | 'Concluída';

export interface Student {
  id: string;
  studentNumber: string;
  name: string;
  courseId: string;
  courseName: string;
  classLevel: string;
  classId: string;
  academicYear: string;
  email: string;
  phone: string;
  enrollmentStatus: StudentEnrollmentStatus;
  attendanceRate: number;
  disciplines: DisciplineGrades[];
  overallAverage: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone: string;
  status: 'Ativo' | 'Licença';
  courseId: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  courseId: string;
  shift: 'Manhã' | 'Tarde';
  totalStudents: number;
  attendanceRate: number;
  roomNumber: string;
}

export interface PreEnrollment {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  classLevel: '10ª' | '11ª';
  courseId: string;
  courseName: string;
  message?: string;
  createdAt: string;
  status: 'Pendente' | 'Contactado' | 'Aprovado' | 'Cancelado';
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Académico' | 'Matrículas' | 'Institucional' | 'Eventos';
  date: string;
  summary: string;
  content: string;
  image: string;
  readTime: string;
  published: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Instalações' | 'Alunos' | 'Laboratórios' | 'Eventos';
  url: string;
  caption?: string;
  date: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  classId: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  priority: 'normal' | 'alta';
}

// ==========================================
// 1. MÓDULO DE MINIPAUTAS & HISTÓRICO
// ==========================================
export interface MinipautaEntry {
  studentId: string;
  studentNumber: string;
  studentName: string;
  mac: number; // Média de Avaliação Contínua (0-20)
  npp: number; // Nota da Prova do Professor (0-20)
  npt?: number; // Nota da Prova Trimestral (0-20)
  notaFinal: number; // Calculada
  observacao?: string;
}

export interface Minipauta {
  id: string;
  courseId: string;
  courseName: string;
  classId: string; // Ex: '10ª A'
  classLevel: string; // Ex: '10.ª Classe'
  disciplineId: string;
  disciplineName: string;
  period: '1º Trimestre' | '2º Trimestre' | '3º Trimestre';
  academicYear: string;
  published: boolean;
  publishedAt?: string;
  updatedAt: string;
  updatedBy: string;
  entries: MinipautaEntry[];
}

export interface MinipautaAuditLog {
  id: string;
  minipautaId: string;
  disciplineName: string;
  classId: string;
  action: 'Criação' | 'Atualização de Notas' | 'Importação Excel/CSV' | 'Publicação' | 'Ocultação';
  details: string;
  author: string;
  timestamp: string;
}

// ==========================================
// 2. MÓDULOS DE SOLICITAÇÕES DIGITAIS
// ==========================================
export type RequestStatus = 'Pendente' | 'Em análise' | 'Aprovado' | 'Rejeitado' | 'Concluído';

export type DeclarationType =
  | 'Declaração com Notas'
  | 'Declaração sem Notas'
  | 'Declaração de Frequência'
  | 'Efeito de Trabalho'
  | 'Efeito de Serviço Militar'
  | '2ª Via de Declaração';

export interface DeclarationRequest {
  id: string;
  requestCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  courseName: string;
  classId: string;
  type: DeclarationType;
  purpose: string;
  observations?: string;
  status: RequestStatus;
  issuedDocumentUrl?: string;
  issuedDocumentName?: string;
  secretaryNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CadernetaRequest {
  id: string;
  requestCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  courseName: string;
  classId: string;
  type: '1ª Via (Ingresso)' | '2ª Via (Extravio / Deterioração)';
  reason: string;
  observations?: string;
  status: RequestStatus;
  secretaryNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type CertificateType =
  | 'Certificado de Habilitações Literárias'
  | 'Certificado de Conclusão de Curso (Técnico Médio)'
  | 'Certidão de Notas Autenticada';

export interface CertificateRequest {
  id: string;
  requestCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  courseName: string;
  classId: string;
  type: CertificateType;
  purpose: string;
  observations?: string;
  status: RequestStatus;
  issuedDocumentUrl?: string;
  issuedDocumentName?: string;
  secretaryNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AbsenceJustificationRequest {
  id: string;
  requestCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  courseName: string;
  classId: string;
  absenceDate: string;
  discipline: string;
  reason: 'Consulta / Motivo Médico' | 'Assunto Familiar Urgente' | 'Compromisso Laboral' | 'Falecimento / Luto' | 'Outro Motivo';
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: RequestStatus;
  secretaryNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferRequest {
  id: string;
  requestCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  currentCourse: string;
  currentClass: string;
  destinationInstitution: string;
  reason: string;
  observations?: string;
  status: RequestStatus;
  secretaryNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. MÓDULO DE COMPROVATIVOS DE EMOLUMENTOS
// ==========================================
export type FeeType =
  | 'Propinas'
  | 'Matrículas'
  | 'Inscrições'
  | 'Emissão de Declarações'
  | 'Cadernetas'
  | 'Certificados'
  | 'Outros Emolumentos';

export type PaymentReceiptStatus = 'Aguardando validação' | 'Validado' | 'Rejeitado';

export interface PaymentReceipt {
  id: string;
  receiptCode: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  feeType: FeeType;
  amountPaid: number;
  paymentDate: string;
  bankReference: string;
  observations?: string;
  receiptFileName: string;
  receiptFileUrl: string;
  receiptFileType: 'image' | 'pdf';
  status: PaymentReceiptStatus;
  secretaryNote?: string;
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
}

// ==========================================
// 4. CENTRAL DE NOTIFICAÇÕES
// ==========================================
export interface PortalNotification {
  id: string;
  recipientId: string; // studentId or 'secretaria' or 'admin' or 'all'
  title: string;
  message: string;
  type: 'pedido' | 'comprovativo' | 'minipauta' | 'comunicado' | 'sistema';
  read: boolean;
  createdAt: string;
  linkRoute?: string;
}
