export type UserRole = 'admin' | 'student' | 'guest';

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
