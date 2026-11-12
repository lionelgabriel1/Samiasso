import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRepository } from '../data/repository.ts';
import {
  User,
  UserRole,
  Course,
  PaymentItem,
  Student,
  Teacher,
  PreEnrollment,
  NewsItem,
  GalleryPhoto,
  ScheduleItem,
  Notice,
  Minipauta, MinipautaEntry, MinipautaAuditLog,
  DeclarationRequest, DeclarationType, CadernetaRequest, CertificateRequest, CertificateType,
  AbsenceJustificationRequest, TransferRequest, PaymentReceipt, PaymentReceiptStatus, FeeType,
  PortalNotification, RequestStatus,
} from '../types/index.ts';
import {
  INITIAL_COURSES,
  INITIAL_PAYMENTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PRE_ENROLLMENTS,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  INITIAL_SCHEDULE,
  INITIAL_NOTICES,
} from '../data/initialData.ts';
import {
  calculateDisciplineAverage,
  calculateOverallAverage,
  calculateTrimestralGrade,
  validatePreEnrollment,
} from '../utils/academic.ts';

export type PublicRoute = 'home' | 'sobre' | 'cursos' | 'matriculas' | 'noticias' | 'galeria' | 'contactos';
export type AdminRoute = 'dashboard' | 'alunos' | 'docentes' | 'cursos' | 'turmas' | 'resultados' | 'assiduidade' | 'matriculas' | 'noticias' | 'galeria' | 'configuracoes' | 'minipautas' | 'comprovativos' | 'declaracoes' | 'cadernetas' | 'certificados' | 'faltas' | 'transferencias' | 'utilizadores';
export type StudentRoute = 'visao-geral' | 'resultados' | 'horario' | 'assiduidade' | 'comunicados' | 'perfil' | 'pedidos' | 'cadernetas' | 'certificados' | 'faltas' | 'transferencias' | 'pagamentos' | 'notificacoes';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation
  activeSection: 'public' | 'admin' | 'student';
  setActiveSection: (sec: 'public' | 'admin' | 'student') => void;
  publicRoute: PublicRoute;
  setPublicRoute: (route: PublicRoute) => void;
  adminRoute: AdminRoute;
  setAdminRoute: (route: AdminRoute) => void;
  studentRoute: StudentRoute;
  setStudentRoute: (route: StudentRoute) => void;

  // Authentication
  currentUser: User | null;
  loginAsAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsStudent: (studentNumberOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: { name: string; email: string; phone: string; courseId: string; classLevel: string; pass: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'admin' | 'student-login' | 'student-register';
  setAuthModalTab: (tab: 'admin' | 'student-login' | 'student-register') => void;

  // Data & Synced State
  courses: Course[];
  updateCourse: (course: Course) => void;
  paymentItems: PaymentItem[];
  updatePaymentItem: (item: PaymentItem) => void;
  students: Student[];
  currentStudent: Student | null;
  selectStudent: (id: string) => void;
  updateStudentGrade: (studentId: string, disciplineId: string, grades: { periodo1: number; periodo2: number; periodo3: number }) => void;
  teachers: Teacher[];
  preEnrollments: PreEnrollment[];
  submitPreEnrollment: (data: { fullName: string; phone: string; classLevel: '10ª' | '11ª'; courseId: string; message?: string }) => { success: boolean; code?: string; errors?: Record<string, string> };
  updatePreEnrollmentStatus: (id: string, status: PreEnrollment['status']) => void;
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (item: NewsItem) => void;
  deleteNews: (id: string) => void;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  schedule: ScheduleItem[];
  notices: Notice[];

  // Academic results and digital services (shared local demo data)
  minipautas: Minipauta[];
  minipautaAuditLogs: MinipautaAuditLog[];
  togglePublishMinipauta: (id: string, published: boolean) => void;
  importMinipautaEntries: (id: string, entries: MinipautaEntry[], action?: 'Atualização de Notas' | 'Importação Excel/CSV') => void;
  declarations: DeclarationRequest[];
  cadernetas: CadernetaRequest[];
  certificates: CertificateRequest[];
  absences: AbsenceJustificationRequest[];
  transfers: TransferRequest[];
  paymentReceipts: PaymentReceipt[];
  notifications: PortalNotification[];
  submitDeclarationRequest: (data: { type: DeclarationType; purpose: string; observations?: string }) => void;
  updateDeclarationStatus: (id: string, status: RequestStatus, note?: string, url?: string, name?: string) => void;
  submitCadernetaRequest: (data: { type: CadernetaRequest['type']; reason: string }) => void;
  updateCadernetaStatus: (id: string, status: RequestStatus, note?: string) => void;
  submitCertificateRequest: (data: { type: CertificateType; purpose: string; observations?: string }) => void;
  updateCertificateStatus: (id: string, status: RequestStatus, note?: string, url?: string, name?: string) => void;
  submitAbsenceJustification: (data: { absenceDate: string; discipline: string; reason: AbsenceJustificationRequest['reason']; description: string; attachmentName?: string; attachmentUrl?: string }) => void;
  updateAbsenceStatus: (id: string, status: RequestStatus, note?: string) => void;
  submitTransferRequest: (data: { destinationInstitution: string; reason: string; observations?: string }) => void;
  updateTransferStatus: (id: string, status: RequestStatus, note?: string) => void;
  submitPaymentReceipt: (data: { feeType: FeeType; amountPaid: number; paymentDate: string; bankReference: string; observations?: string; receiptFileName: string; receiptFileUrl: string; receiptFileType: 'image' | 'pdf' }) => void;
  validatePaymentReceipt: (id: string, status: PaymentReceiptStatus, note?: string) => void;
  markNotificationAsRead: (id: string) => void;

  // Lightbox & Reader
  lightboxPhoto: GalleryPhoto | null;
  setLightboxPhoto: (photo: GalleryPhoto | null) => void;
  selectedNewsArticle: NewsItem | null;
  setSelectedNewsArticle: (item: NewsItem | null) => void;

  // Course Pre-selection for Enrollment Flow
  selectedCourseForEnrollment: string | null;
  setSelectedCourseForEnrollment: (courseId: string | null) => void;

  // Demonstration Helpers for Board Presentation
  resetDemoData: () => void;
  isDemoBarVisible: boolean;
  setIsDemoBarVisible: (visible: boolean) => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_DEFAULT_USER: User = {
  id: 'usr-admin-1',
  name: 'Administrador ITPSS',
  email: 'admin@itpss.ao',
  role: 'admin',
  avatar: '/images/campus-drone.jpg',
};

const buildInitialMinipautas = (): Minipauta[] => {
  const grouped = new Map<string, Minipauta>();
  INITIAL_STUDENTS.forEach((student) => {
    student.disciplines.forEach((discipline) => {
      const key = [student.courseId, student.classId, discipline.id].join('|');
      const existing = grouped.get(key);
      const entry: MinipautaEntry = {
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: student.name,
        mac: discipline.grades.periodo1,
        npp: discipline.grades.periodo2,
        npt: discipline.grades.periodo3,
        notaFinal: calculateTrimestralGrade(discipline.grades.periodo1, discipline.grades.periodo2, discipline.grades.periodo3),
      };
      if (existing) existing.entries.push(entry);
      else grouped.set(key, {
        id: `mini-${key.replace(/[^a-z0-9]+/gi, '-')}`,
        courseId: student.courseId,
        courseName: student.courseName,
        classId: student.classId,
        classLevel: student.classLevel,
        disciplineId: discipline.id,
        disciplineName: discipline.name,
        period: '1º Trimestre',
        academicYear: student.academicYear,
        published: true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'Dados de demonstração',
        entries: [entry],
      });
    });
  });
  return [...grouped.values()];
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeSection, setActiveSection] = useState<'public' | 'admin' | 'student'>('public');
  const [publicRoute, setPublicRoute] = useState<PublicRoute>('home');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');
  const [studentRoute, setStudentRoute] = useState<StudentRoute>('visao-geral');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'admin' | 'student-login' | 'student-register'>('student-login');

  // Business State with LocalStorage Persistence
  const [courses, setCourses] = useState<Course[]>(() => getRepository().get('itpss_courses', INITIAL_COURSES));

  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(() => getRepository().get('itpss_payments', INITIAL_PAYMENTS));

  const [students, setStudents] = useState<Student[]>(() => getRepository().get('itpss_students', INITIAL_STUDENTS));

  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [preEnrollments, setPreEnrollments] = useState<PreEnrollment[]>(() => getRepository().get('itpss_pre_enrollments', INITIAL_PRE_ENROLLMENTS));

  const [news, setNews] = useState<NewsItem[]>(() => getRepository().get('itpss_news', INITIAL_NEWS));

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => getRepository().get('itpss_gallery', INITIAL_GALLERY));

  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);

  // All newly added academic/service modules share the same repository boundary.
  const [minipautas, setMinipautas] = useState<Minipauta[]>(() => getRepository().get('itpss_minipautas', buildInitialMinipautas()));
  const [minipautaAuditLogs, setMinipautaAuditLogs] = useState<MinipautaAuditLog[]>(() => getRepository().get('itpss_minipauta_audit', []));
  const [declarations, setDeclarations] = useState<DeclarationRequest[]>(() => getRepository().get('itpss_declarations', []));
  const [cadernetas, setCadernetas] = useState<CadernetaRequest[]>(() => getRepository().get('itpss_cadernetas', []));
  const [certificates, setCertificates] = useState<CertificateRequest[]>(() => getRepository().get('itpss_certificates', []));
  const [absences, setAbsences] = useState<AbsenceJustificationRequest[]>(() => getRepository().get('itpss_absences', []));
  const [transfers, setTransfers] = useState<TransferRequest[]>(() => getRepository().get('itpss_transfers', []));
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(() => getRepository().get('itpss_payment_receipts', []));
  const [notifications, setNotifications] = useState<PortalNotification[]>(() => getRepository().get('itpss_notifications', []));

  // Active student selection for student portal
  const [currentStudentId, setCurrentStudentId] = useState<string>('std-1');

  // Lightbox & Reader
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);

  // Course pre-selection for enrollment journey
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<string | null>(null);

  // Executive demonstration mode bar
  const [isDemoBarVisible, setIsDemoBarVisible] = useState<boolean>(true);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  const persist = <T,>(key: string, value: T) => {
    try { getRepository().set(key, value); }
    catch { showToast('O armazenamento local está cheio. Remova alguns anexos ou reinicie os dados da demonstração.', 'error'); }
  };

  // Sync to localStorage
  useEffect(() => {
    persist('itpss_courses', courses);
  }, [courses]);

  useEffect(() => {
    persist('itpss_pre_enrollments', preEnrollments);
  }, [preEnrollments]);

  useEffect(() => {
    persist('itpss_students', students);
  }, [students]);

  useEffect(() => {
    persist('itpss_news', news);
  }, [news]);

  useEffect(() => {
    persist('itpss_gallery', gallery);
  }, [gallery]);

  useEffect(() => persist('itpss_minipautas', minipautas), [minipautas]);
  useEffect(() => persist('itpss_minipauta_audit', minipautaAuditLogs), [minipautaAuditLogs]);
  useEffect(() => persist('itpss_declarations', declarations), [declarations]);
  useEffect(() => persist('itpss_cadernetas', cadernetas), [cadernetas]);
  useEffect(() => persist('itpss_certificates', certificates), [certificates]);
  useEffect(() => persist('itpss_absences', absences), [absences]);
  useEffect(() => persist('itpss_transfers', transfers), [transfers]);
  useEffect(() => persist('itpss_payment_receipts', paymentReceipts), [paymentReceipts]);
  useEffect(() => persist('itpss_notifications', notifications), [notifications]);

  // Handle current student calculation
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0] || null;

  // Synchronized Handlers
  const updateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    showToast(`Curso "${updatedCourse.name}" atualizado com sucesso!`);
  };

  const updatePaymentItem = (updatedItem: PaymentItem) => {
    setPaymentItems((prev) => prev.map((p) => (p.id === updatedItem.id ? updatedItem : p)));
    showToast(`Valor de "${updatedItem.name}" atualizado!`);
  };

  const submitPreEnrollment = (data: {
    fullName: string;
    phone: string;
    classLevel: '10ª' | '11ª';
    courseId: string;
    message?: string;
  }) => {
    const validation = validatePreEnrollment(data);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const course = courses.find((c) => c.id === data.courseId);
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const code = `ITPSS-2026-${randomSeq}`;

    const newRecord: PreEnrollment = {
      id: `pre-${Date.now()}`,
      code,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      classLevel: data.classLevel,
      courseId: data.courseId,
      courseName: course ? course.name : data.courseId,
      message: data.message?.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pendente',
    };

    setPreEnrollments((prev) => [newRecord, ...prev]);
    showToast(`Pré-inscrição submetida com sucesso! Código: ${code}`);
    return { success: true, code };
  };

  const updatePreEnrollmentStatus = (id: string, status: PreEnrollment['status']) => {
    setPreEnrollments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showToast(`Estado da pré-inscrição alterado para: ${status}`);
  };

  const updateStudentGrade = (
    studentId: string,
    disciplineId: string,
    newGrades: { periodo1: number; periodo2: number; periodo3: number }
  ) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const updatedDisciplines = student.disciplines.map((d) => {
          if (d.id !== disciplineId) return d;
          return { ...d, grades: newGrades };
        });

        const overall = calculateOverallAverage(updatedDisciplines);

        return {
          ...student,
          disciplines: updatedDisciplines,
          overallAverage: overall,
        };
      })
    );
    showToast('Nota gravada e média recalculada com sucesso!');
  };

  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
    };
    setNews((prev) => [newItem, ...prev]);
    showToast('Notícia publicada com sucesso!');
  };

  const updateNews = (item: NewsItem) => {
    setNews((prev) => prev.map((n) => (n.id === item.id ? item : n)));
    showToast('Notícia atualizada com sucesso!');
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    showToast('Notícia removida com sucesso!');
  };

  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
    };
    setGallery((prev) => [newPhoto, ...prev]);
    showToast('Fotografia adicionada à galeria!');
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showToast('Fotografia removida da galeria!');
  };

  const createRequestCode = (prefix: string) => `${prefix}-${Date.now().toString().slice(-8)}`;
  const studentSnapshot = () => currentStudent ? {
    studentId: currentStudent.id, studentNumber: currentStudent.studentNumber,
    studentName: currentStudent.name, courseName: currentStudent.courseName, classId: currentStudent.classId,
  } : null;
  const notify = (recipientId: string, title: string, message: string, type: PortalNotification['type']) => {
    setNotifications((prev) => [{ id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, recipientId, title, message, type, read: false, createdAt: new Date().toLocaleString('pt-PT') }, ...prev]);
  };
  const updateRequest = <T extends { id: string; status: RequestStatus; secretaryNote?: string; updatedAt?: string }>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, status: RequestStatus, note?: string, extra?: Partial<T>
  ) => setter((prev) => prev.map((item) => item.id === id ? { ...item, status, secretaryNote: note, updatedAt: new Date().toISOString(), ...extra } : item));

  const submitDeclarationRequest = (data: { type: DeclarationType; purpose: string; observations?: string }) => {
    const student = studentSnapshot(); if (!student) return;
    const item: DeclarationRequest = { id: `dec-${Date.now()}`, requestCode: createRequestCode('DEC'), ...student, ...data, status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setDeclarations((prev) => [item, ...prev]); notify('secretaria', 'Novo pedido de declaração', `${student.studentName} solicitou ${data.type}.`, 'pedido'); showToast('Pedido de declaração registado.');
  };
  const updateDeclarationStatus = (id: string, status: RequestStatus, note?: string, url?: string, name?: string) => {
    const item = declarations.find((entry) => entry.id === id); updateRequest<DeclarationRequest>(setDeclarations, id, status, note, { issuedDocumentUrl: url, issuedDocumentName: name }); if (item) notify(item.studentId, 'Pedido de declaração atualizado', `O pedido ${item.requestCode} está agora: ${status}.`, 'pedido'); showToast('Estado do pedido atualizado.');
  };
  const submitCadernetaRequest = (data: { type: CadernetaRequest['type']; reason: string }) => {
    const student = studentSnapshot(); if (!student) return;
    const item: CadernetaRequest = { id: `cad-${Date.now()}`, requestCode: createRequestCode('CAD'), ...student, ...data, status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCadernetas((prev) => [item, ...prev]); notify('secretaria', 'Novo pedido de caderneta', `${student.studentName} solicitou uma caderneta.`, 'pedido'); showToast('Pedido de caderneta registado.');
  };
  const updateCadernetaStatus = (id: string, status: RequestStatus, note?: string) => { const item = cadernetas.find((entry) => entry.id === id); updateRequest<CadernetaRequest>(setCadernetas, id, status, note); if (item) notify(item.studentId, 'Pedido de caderneta atualizado', `O pedido ${item.requestCode} está agora: ${status}.`, 'pedido'); showToast('Estado da caderneta atualizado.'); };
  const submitCertificateRequest = (data: { type: CertificateType; purpose: string; observations?: string }) => {
    const student = studentSnapshot(); if (!student) return;
    const item: CertificateRequest = { id: `cert-${Date.now()}`, requestCode: createRequestCode('CERT'), ...student, ...data, status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setCertificates((prev) => [item, ...prev]); notify('secretaria', 'Novo pedido de certificado', `${student.studentName} solicitou ${data.type}.`, 'pedido'); showToast('Pedido de certificado registado.');
  };
  const updateCertificateStatus = (id: string, status: RequestStatus, note?: string, url?: string, name?: string) => { const item = certificates.find((entry) => entry.id === id); updateRequest<CertificateRequest>(setCertificates, id, status, note, { issuedDocumentUrl: url, issuedDocumentName: name }); if (item) notify(item.studentId, 'Pedido de certificado atualizado', `O pedido ${item.requestCode} está agora: ${status}.`, 'pedido'); showToast('Estado do certificado atualizado.'); };
  const submitAbsenceJustification = (data: { absenceDate: string; discipline: string; reason: AbsenceJustificationRequest['reason']; description: string; attachmentName?: string; attachmentUrl?: string }) => {
    const student = studentSnapshot(); if (!student) return;
    const item: AbsenceJustificationRequest = { id: `abs-${Date.now()}`, requestCode: createRequestCode('FAL'), ...student, ...data, status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setAbsences((prev) => [item, ...prev]); notify('secretaria', 'Nova justificação de falta', `${student.studentName} submeteu uma justificação.`, 'pedido'); showToast('Justificação submetida.');
  };
  const updateAbsenceStatus = (id: string, status: RequestStatus, note?: string) => { const item = absences.find((entry) => entry.id === id); updateRequest<AbsenceJustificationRequest>(setAbsences, id, status, note); if (item) notify(item.studentId, 'Justificação de falta atualizada', `A justificação ${item.requestCode} está agora: ${status}.`, 'pedido'); showToast('Justificação atualizada.'); };
  const submitTransferRequest = (data: { destinationInstitution: string; reason: string; observations?: string }) => {
    const student = studentSnapshot(); if (!student) return;
    const item: TransferRequest = { id: `trf-${Date.now()}`, requestCode: createRequestCode('TRF'), ...student, currentCourse: student.courseName, currentClass: student.classId, ...data, status: 'Pendente', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setTransfers((prev) => [item, ...prev]); notify('secretaria', 'Novo pedido de transferência', `${student.studentName} solicitou transferência.`, 'pedido'); showToast('Pedido de transferência submetido.');
  };
  const updateTransferStatus = (id: string, status: RequestStatus, note?: string) => { const item = transfers.find((entry) => entry.id === id); updateRequest<TransferRequest>(setTransfers, id, status, note); if (item) notify(item.studentId, 'Pedido de transferência atualizado', `O pedido ${item.requestCode} está agora: ${status}.`, 'pedido'); showToast('Pedido de transferência atualizado.'); };
  const submitPaymentReceipt = (data: { feeType: FeeType; amountPaid: number; paymentDate: string; bankReference: string; observations?: string; receiptFileName: string; receiptFileUrl: string; receiptFileType: 'image' | 'pdf' }) => {
    const student = studentSnapshot(); if (!student) return;
    if (!data.receiptFileUrl || !data.receiptFileName) { showToast('Anexe o comprovativo antes de submeter.', 'error'); return; }
    const item: PaymentReceipt = { id: `pay-${Date.now()}`, receiptCode: createRequestCode('PAG'), ...student, ...data, status: 'Aguardando validação', createdAt: new Date().toISOString() };
    setPaymentReceipts((prev) => [item, ...prev]); notify('secretaria', 'Novo comprovativo recebido', `${student.studentName} enviou comprovativo de ${data.feeType}.`, 'comprovativo'); showToast('Comprovativo enviado para validação manual.');
  };
  const validatePaymentReceipt = (id: string, status: PaymentReceiptStatus, note?: string) => {
    setPaymentReceipts((prev) => prev.map((item) => item.id === id ? { ...item, status, secretaryNote: note, validatedBy: currentUser?.name || 'Secretaria', validatedAt: new Date().toISOString() } : item));
    const receipt = paymentReceipts.find((item) => item.id === id); if (receipt) notify(receipt.studentId, 'Atualização do comprovativo', `O comprovativo ${receipt.receiptCode} foi marcado como ${status}.`, 'comprovativo');
    showToast('Validação do comprovativo registada.');
  };
  const togglePublishMinipauta = (id: string, published: boolean) => {
    setMinipautas((prev) => prev.map((item) => item.id === id ? { ...item, published, publishedAt: published ? new Date().toISOString() : undefined, updatedAt: new Date().toISOString() } : item));
    const item = minipautas.find((m) => m.id === id);
    if (item) setMinipautaAuditLogs((prev) => [{ id: `audit-${Date.now()}`, minipautaId: id, disciplineName: item.disciplineName, classId: item.classId, action: published ? 'Publicação' : 'Ocultação', details: published ? 'Minipauta publicada para consulta.' : 'Minipauta retirada da consulta.', author: currentUser?.name || 'Secretaria', timestamp: new Date().toLocaleString('pt-PT') }, ...prev]);
    notify('all', published ? 'Minipauta publicada' : 'Minipauta atualizada', item?.disciplineName || 'Resultados académicos', 'minipauta');
    showToast(published ? 'Minipauta publicada.' : 'Minipauta ocultada.');
  };
  const importMinipautaEntries = (id: string, entries: MinipautaEntry[], action: 'Atualização de Notas' | 'Importação Excel/CSV' = 'Atualização de Notas') => {
    const target = minipautas.find((item) => item.id === id); if (!target) { showToast('Minipauta não encontrada.', 'error'); return; }
    const validEntries = entries.filter((entry) => students.some((student) => student.id === entry.studentId && student.studentNumber === entry.studentNumber));
    if (validEntries.length !== entries.length) { showToast('Existem estudantes sem matrícula correspondente. Corrija a importação antes de gravar.', 'error'); return; }
    setMinipautas((prev) => prev.map((item) => item.id === id ? { ...item, entries: validEntries, published: false, updatedAt: new Date().toISOString(), updatedBy: currentUser?.name || 'Secretaria' } : item));
    setMinipautaAuditLogs((prev) => [{ id: `audit-${Date.now()}`, minipautaId: id, disciplineName: target.disciplineName, classId: target.classId, action, details: `${validEntries.length} registos guardados. A publicação foi desativada até nova conferência.`, author: currentUser?.name || 'Secretaria', timestamp: new Date().toLocaleString('pt-PT') }, ...prev]);
    showToast('Notas guardadas. Reveja e publique a minipauta quando estiver pronta.');
  };
  const markNotificationAsRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const selectStudent = (id: string) => {
    setCurrentStudentId(id);
    const found = students.find((s) => s.id === id);
    if (found) {
      setCurrentUser({
        id: found.id,
        name: found.name,
        email: found.email,
        role: 'student',
        studentNumber: found.studentNumber,
        courseId: found.courseId,
        courseName: found.courseName,
        classLevel: found.classLevel,
        classId: found.classId,
        academicYear: found.academicYear,
        phone: found.phone,
      });
    }
  };

  // Presentation-only access checks. This is not production authentication.
  const loginAsAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !pass) {
      return { success: false, error: 'Por favor preencha o e-mail e a palavra-passe.' };
    }

    if (email.trim().toLowerCase() !== 'admin@itpss.ao' || pass !== 'admin123') {
      return { success: false, error: 'E-mail ou palavra-passe inválidos.' };
    }

    setCurrentUser(ADMIN_DEFAULT_USER);
    setActiveSection('admin');
    setAdminRoute('dashboard');
    setIsAuthModalOpen(false);
    showToast('Sessão iniciada como Administrador.');
    return { success: true };
  };

  const loginAsStudent = async (
    studentNumberOrEmail: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!studentNumberOrEmail.trim() || !pass) {
      return { success: false, error: 'Informe o número de estudante (ou e-mail) e a palavra-passe.' };
    }

    const cleanInput = studentNumberOrEmail.trim().toLowerCase();
    const found = students.find(
      (s) =>
        s.studentNumber.toLowerCase() === cleanInput ||
        s.email.toLowerCase() === cleanInput ||
        s.name.toLowerCase() === cleanInput
    );

    if (!found || pass !== 'senha123') {
      return { success: false, error: 'Dados de acesso inválidos. Verifique os seus dados e tente novamente.' };
    }

    selectStudent(found.id);
    setActiveSection('student');
    setStudentRoute('visao-geral');
    setIsAuthModalOpen(false);
    showToast(`Bem-vindo(a), ${found.name}!`);
    return { success: true };
  };

  const registerStudent = async (data: {
    name: string;
    email: string;
    phone: string;
    courseId: string;
    classLevel: string;
    pass: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || data.name.trim().length < 3) {
      return { success: false, error: 'O nome completo deve ter pelo menos 3 caracteres.' };
    }
    if (!data.email || !data.email.includes('@')) {
      return { success: false, error: 'Informe um e-mail válido.' };
    }
    if (!data.pass || data.pass.length < 6) {
      return { success: false, error: 'A palavra-passe deve conter pelo menos 6 caracteres.' };
    }

    const course = courses.find((c) => c.id === data.courseId);
    const newNumber = `2026-0${Math.floor(200 + Math.random() * 800)}`;
    const newStudentId = `std-${Date.now()}`;

    const newStudent: Student = {
      id: newStudentId,
      studentNumber: newNumber,
      name: data.name.trim(),
      courseId: data.courseId,
      courseName: course ? course.name : 'Saúde Geral',
      classLevel: data.classLevel || '10.ª Classe',
      classId: '10ª C',
      academicYear: '2026/2027',
      email: data.email.trim(),
      phone: data.phone.trim(),
      attendanceRate: 100,
      overallAverage: 0,
      disciplines: [
        { id: 'd1', name: 'Anatomia Humana', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
        { id: 'd2', name: 'Fisiologia Geral', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
        { id: 'd3', name: 'Ética e Deontologia em Saúde', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
      ],
    };

    setStudents((prev) => [newStudent, ...prev]);
    setCurrentStudentId(newStudentId);
    setCurrentUser({ id: newStudent.id, name: newStudent.name, email: newStudent.email, role: 'student', studentNumber: newStudent.studentNumber, courseId: newStudent.courseId, courseName: newStudent.courseName, classLevel: newStudent.classLevel, classId: newStudent.classId, academicYear: newStudent.academicYear, phone: newStudent.phone });
    setActiveSection('student');
    setStudentRoute('visao-geral');
    setIsAuthModalOpen(false);
    showToast(`Conta de estudante criada com sucesso! N.º ${newNumber}`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveSection('public');
    setPublicRoute('home');
    showToast('Sessão terminada.');
  };

  const resetDemoData = () => {
    ['itpss_courses', 'itpss_payments', 'itpss_students', 'itpss_news', 'itpss_gallery', 'itpss_pre_enrollments', 'itpss_minipautas', 'itpss_minipauta_audit', 'itpss_declarations', 'itpss_cadernetas', 'itpss_certificates', 'itpss_absences', 'itpss_transfers', 'itpss_payment_receipts', 'itpss_notifications'].forEach((key) => getRepository().remove(key));

    setCourses(INITIAL_COURSES);
    setPaymentItems(INITIAL_PAYMENTS);
    setStudents(INITIAL_STUDENTS);
    setNews(INITIAL_NEWS);
    setGallery(INITIAL_GALLERY);
    setPreEnrollments(INITIAL_PRE_ENROLLMENTS);
    setMinipautas(buildInitialMinipautas());
    setMinipautaAuditLogs([]);
    setDeclarations([]);
    setCadernetas([]);
    setCertificates([]);
    setAbsences([]);
    setTransfers([]);
    setPaymentReceipts([]);
    setNotifications([]);
    setCurrentStudentId('std-1');

    showToast('Dados de demonstração repostos com sucesso!', 'info');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_DEFAULT_USER);
      setActiveSection('admin');
      setAdminRoute('dashboard');
    } else if (role === 'student') {
      selectStudent('std-1');
      setActiveSection('student');
      setStudentRoute('visao-geral');
    } else {
      setCurrentUser(null);
      setActiveSection('public');
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeSection,
        setActiveSection,
        publicRoute,
        setPublicRoute,
        adminRoute,
        setAdminRoute,
        studentRoute,
        setStudentRoute,

        currentUser,
        loginAsAdmin,
        loginAsStudent,
        registerStudent,
        logout,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,

        courses,
        updateCourse,
        paymentItems,
        updatePaymentItem,
        students,
        currentStudent,
        selectStudent,
        updateStudentGrade,
        teachers,
        preEnrollments,
        submitPreEnrollment,
        updatePreEnrollmentStatus,
        news,
        addNews,
        updateNews,
        deleteNews,
        gallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        schedule,
        notices,
        minipautas, minipautaAuditLogs, togglePublishMinipauta, importMinipautaEntries,
        declarations, cadernetas, certificates, absences, transfers, paymentReceipts, notifications,
        submitDeclarationRequest, updateDeclarationStatus, submitCadernetaRequest, updateCadernetaStatus,
        submitCertificateRequest, updateCertificateStatus, submitAbsenceJustification, updateAbsenceStatus,
        submitTransferRequest, updateTransferStatus, submitPaymentReceipt, validatePaymentReceipt, markNotificationAsRead,

        lightboxPhoto,
        setLightboxPhoto,
        selectedNewsArticle,
        setSelectedNewsArticle,

        selectedCourseForEnrollment,
        setSelectedCourseForEnrollment,

        resetDemoData,
        isDemoBarVisible,
        setIsDemoBarVisible,

        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
