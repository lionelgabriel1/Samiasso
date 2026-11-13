import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Course,
  PaymentItem,
  Student,
  Teacher,
  ClassRoom,
  PreEnrollment,
  NewsItem,
  GalleryPhoto,
  ScheduleItem,
  Notice,
  Minipauta,
  MinipautaEntry,
  MinipautaAuditLog,
  PautaGeral,
  PautaGeralAuditLog,
  DeclarationRequest,
  CadernetaRequest,
  CertificateRequest,
  AbsenceJustificationRequest,
  TransferRequest,
  PaymentReceipt,
  PaymentReceiptStatus,
  PortalNotification,
  RequestStatus,
} from '../types/index.ts';
import {
  INITIAL_COURSES,
  INITIAL_PAYMENTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_CLASSES,
  INITIAL_PRE_ENROLLMENTS,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  INITIAL_SCHEDULE,
  INITIAL_NOTICES,
  INITIAL_MINIPAUTAS,
  INITIAL_MINIPAUTA_AUDIT_LOGS,
  INITIAL_PAUTAS_GERAIS,
  INITIAL_PAUTA_AUDIT_LOGS,
  INITIAL_DECLARATIONS,
  INITIAL_CADERNETAS,
  INITIAL_CERTIFICATES,
  INITIAL_ABSENCES,
  INITIAL_TRANSFERS,
  INITIAL_PAYMENT_RECEIPTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData.ts';
import {
  calculateOverallAverage,
  determineAcademicStatus,
  validatePreEnrollment,
} from '../utils/academic.ts';
import {
  commitPautaImport,
  formatTimestampNow,
  PautaContextSelection,
  PautaPreviewResult,
  summarizePautaRows,
  syncPublishedPautaToStudents,
} from '../utils/pautaGeral.ts';
import { dataRepository } from '../services/dataRepository.ts';

export type PublicRoute =
  | 'home'
  | 'sobre'
  | 'cursos'
  | 'matriculas'
  | 'noticias'
  | 'galeria'
  | 'contactos';

export type AdminRoute =
  | 'dashboard'
  | 'pautas-gerais'
  | 'minipautas'
  | 'resultados'
  | 'assiduidade'
  | 'comprovativos'
  | 'declaracoes'
  | 'cadernetas'
  | 'certificados'
  | 'faltas'
  | 'transferencias'
  | 'alunos'
  | 'turmas'
  | 'docentes'
  | 'cursos'
  | 'matriculas'
  | 'utilizadores'
  | 'noticias'
  | 'galeria'
  | 'configuracoes';

export type StudentRoute =
  | 'visao-geral'
  | 'resultados'
  | 'pedidos'
  | 'cadernetas'
  | 'certificados'
  | 'faltas'
  | 'transferencias'
  | 'pagamentos'
  | 'notificacoes'
  | 'horario'
  | 'assiduidade'
  | 'comunicados'
  | 'perfil';

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
  loginAsSecretaria: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsStudent: (studentNumberOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: {
    name: string;
    email: string;
    phone: string;
    courseId: string;
    classLevel: string;
    pass: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'admin' | 'student-login' | 'student-register';
  setAuthModalTab: (tab: 'admin' | 'student-login' | 'student-register') => void;

  // Core Institutional Data
  courses: Course[];
  updateCourse: (course: Course) => void;
  paymentItems: PaymentItem[];
  updatePaymentItem: (item: PaymentItem) => void;
  students: Student[];
  currentStudent: Student | null;
  selectStudent: (id: string) => void;
  updateStudentGrade: (
    studentId: string,
    disciplineId: string,
    grades: { periodo1: number; periodo2: number; periodo3: number }
  ) => void;
  teachers: Teacher[];
  classes: ClassRoom[];
  preEnrollments: PreEnrollment[];
  submitPreEnrollment: (data: {
    fullName: string;
    phone: string;
    classLevel: '10ª' | '11ª';
    courseId: string;
    message?: string;
  }) => { success: boolean; code?: string; errors?: Record<string, string> };
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

  // Pautas Gerais Module
  pautasGerais: PautaGeral[];
  pautaAuditLogs: PautaGeralAuditLog[];
  importPautaGeral: (params: {
    previewResult: PautaPreviewResult;
    context: PautaContextSelection;
    disciplines: string[];
    fileName: string;
    overwriteConfirmed?: boolean;
  }) => ReturnType<typeof commitPautaImport>;
  togglePublishPautaGeral: (pautaId: string) => void;
  updatePautaGeralCellGrade: (
    pautaId: string,
    studentNumber: string,
    disciplineName: string,
    grade: number
  ) => void;

  // Minipautas Module
  minipautas: Minipauta[];
  minipautaAuditLogs: MinipautaAuditLog[];
  togglePublishMinipauta: (minipautaId: string) => void;
  importMinipautaEntries: (
    minipautaId: string,
    entries: MinipautaEntry[],
    sourceFile?: string
  ) => void;

  // Digital Services & Receipts
  declarations: DeclarationRequest[];
  submitDeclarationRequest: (data: {
    type: DeclarationRequest['type'];
    purpose: string;
    observations?: string;
  }) => void;
  updateDeclarationStatus: (
    id: string,
    status: RequestStatus,
    secretaryNote?: string,
    issuedDocumentUrl?: string,
    issuedDocumentName?: string
  ) => void;

  cadernetas: CadernetaRequest[];
  submitCadernetaRequest: (data: {
    type: CadernetaRequest['type'];
    reason: string;
    observations?: string;
  }) => void;
  updateCadernetaStatus: (id: string, status: RequestStatus, secretaryNote?: string) => void;

  certificates: CertificateRequest[];
  submitCertificateRequest: (data: {
    type: CertificateRequest['type'];
    purpose: string;
    observations?: string;
  }) => void;
  updateCertificateStatus: (
    id: string,
    status: RequestStatus,
    secretaryNote?: string,
    issuedDocumentUrl?: string,
    issuedDocumentName?: string
  ) => void;

  absences: AbsenceJustificationRequest[];
  submitAbsenceJustification: (data: {
    absenceDate: string;
    discipline: string;
    reason: AbsenceJustificationRequest['reason'];
    description: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }) => void;
  updateAbsenceStatus: (id: string, status: RequestStatus, secretaryNote?: string) => void;

  transfers: TransferRequest[];
  submitTransferRequest: (data: {
    destinationInstitution: string;
    reason: string;
    observations?: string;
  }) => void;
  updateTransferStatus: (id: string, status: RequestStatus, secretaryNote?: string) => void;

  paymentReceipts: PaymentReceipt[];
  submitPaymentReceipt: (data: {
    feeType: PaymentReceipt['feeType'];
    amountPaid: number;
    paymentDate: string;
    bankReference: string;
    observations?: string;
    receiptFileName: string;
    receiptFileUrl: string;
    receiptFileType: 'image' | 'pdf';
  }) => void;
  validatePaymentReceipt: (
    id: string,
    status: PaymentReceiptStatus,
    secretaryNote?: string
  ) => void;

  notifications: PortalNotification[];
  markNotificationAsRead: (id: string) => void;

  // Lightbox & Reader
  lightboxPhoto: GalleryPhoto | null;
  setLightboxPhoto: (photo: GalleryPhoto | null) => void;
  selectedNewsArticle: NewsItem | null;
  setSelectedNewsArticle: (item: NewsItem | null) => void;

  // Course Pre-selection
  selectedCourseForEnrollment: string | null;
  setSelectedCourseForEnrollment: (courseId: string | null) => void;

  // Demonstration Helpers
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
  name: 'Direção Geral ITPSS',
  email: 'admin@itpss.ao',
  role: 'admin',
  avatar: '/images/Foto da escola feita com drone.jpg',
};

const SECRETARIA_DEFAULT_USER: User = {
  id: 'usr-sec-1',
  name: 'Secretaria Geral Pedagógica',
  email: 'secretaria@itpss.ao',
  role: 'secretaria',
  avatar: '/images/Foto da escola feita com drone.jpg',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<'public' | 'admin' | 'student'>('public');
  const [publicRoute, setPublicRoute] = useState<PublicRoute>('home');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');
  const [studentRoute, setStudentRoute] = useState<StudentRoute>('visao-geral');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'admin' | 'student-login' | 'student-register'>('student-login');

  // Persisted State via DataRepository
  const [courses, setCourses] = useState<Course[]>(() => dataRepository.loadCourses());
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(() => dataRepository.loadPayments());
  const [students, setStudents] = useState<Student[]>(() => dataRepository.loadStudents());
  const [classes, setClasses] = useState<ClassRoom[]>(() => dataRepository.loadClasses());
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [preEnrollments, setPreEnrollments] = useState<PreEnrollment[]>(() =>
    dataRepository.loadPreEnrollments()
  );
  const [news, setNews] = useState<NewsItem[]>(() => dataRepository.loadNews());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => dataRepository.loadGallery());
  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);

  const [pautasGerais, setPautasGerais] = useState<PautaGeral[]>(() =>
    dataRepository.loadPautasGerais()
  );
  const [pautaAuditLogs, setPautaAuditLogs] = useState<PautaGeralAuditLog[]>(() =>
    dataRepository.loadPautaAuditLogs()
  );

  const [minipautas, setMinipautas] = useState<Minipauta[]>(() =>
    dataRepository.loadMinipautas()
  );
  const [minipautaAuditLogs, setMinipautaAuditLogs] = useState<MinipautaAuditLog[]>(() =>
    dataRepository.loadMinipautaLogs()
  );

  const [declarations, setDeclarations] = useState<DeclarationRequest[]>(() =>
    dataRepository.loadDeclarations()
  );
  const [cadernetas, setCadernetas] = useState<CadernetaRequest[]>(() =>
    dataRepository.loadCadernetas()
  );
  const [certificates, setCertificates] = useState<CertificateRequest[]>(() =>
    dataRepository.loadCertificates()
  );
  const [absences, setAbsences] = useState<AbsenceJustificationRequest[]>(() =>
    dataRepository.loadAbsences()
  );
  const [transfers, setTransfers] = useState<TransferRequest[]>(() =>
    dataRepository.loadTransfers()
  );
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(() =>
    dataRepository.loadPaymentReceipts()
  );
  const [notifications, setNotifications] = useState<PortalNotification[]>(() =>
    dataRepository.loadNotifications()
  );

  const [currentStudentId, setCurrentStudentId] = useState<string>('std-1');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<string | null>(null);
  const [isDemoBarVisible, setIsDemoBarVisible] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync persistence effects
  useEffect(() => dataRepository.saveCourses(courses), [courses]);
  useEffect(() => dataRepository.savePayments(paymentItems), [paymentItems]);
  useEffect(() => dataRepository.saveStudents(students), [students]);
  useEffect(() => dataRepository.saveClasses(classes), [classes]);
  useEffect(() => dataRepository.savePreEnrollments(preEnrollments), [preEnrollments]);
  useEffect(() => dataRepository.saveNews(news), [news]);
  useEffect(() => dataRepository.saveGallery(gallery), [gallery]);
  useEffect(() => dataRepository.savePautasGerais(pautasGerais), [pautasGerais]);
  useEffect(() => dataRepository.savePautaAuditLogs(pautaAuditLogs), [pautaAuditLogs]);
  useEffect(() => dataRepository.saveMinipautas(minipautas), [minipautas]);
  useEffect(() => dataRepository.saveMinipautaLogs(minipautaAuditLogs), [minipautaAuditLogs]);
  useEffect(() => dataRepository.saveDeclarations(declarations), [declarations]);
  useEffect(() => dataRepository.saveCadernetas(cadernetas), [cadernetas]);
  useEffect(() => dataRepository.saveCertificates(certificates), [certificates]);
  useEffect(() => dataRepository.saveAbsences(absences), [absences]);
  useEffect(() => dataRepository.saveTransfers(transfers), [transfers]);
  useEffect(() => dataRepository.savePaymentReceipts(paymentReceipts), [paymentReceipts]);
  useEffect(() => dataRepository.saveNotifications(notifications), [notifications]);

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0] || null;

  const pushNotification = (notif: Omit<PortalNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: PortalNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: formatTimestampNow(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

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
      createdAt: formatTimestampNow(),
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
        const updatedDisciplines = student.disciplines.map((d) =>
          d.id === disciplineId ? { ...d, grades: newGrades } : d
        );
        return {
          ...student,
          disciplines: updatedDisciplines,
          overallAverage: calculateOverallAverage(updatedDisciplines),
        };
      })
    );
    showToast('Nota gravada e média recalculada com sucesso!');
  };

  // ==========================================
  // MÓDULO DE PAUTAS GERAIS (EXCEL + PUBLICAÇÃO)
  // ==========================================
  const importPautaGeral = (params: {
    previewResult: PautaPreviewResult;
    context: PautaContextSelection;
    disciplines: string[];
    fileName: string;
    overwriteConfirmed?: boolean;
  }) => {
    const author = currentUser?.name || 'Secretaria Geral';
    const result = commitPautaImport({
      existingPautas: pautasGerais,
      previewResult: params.previewResult,
      context: params.context,
      disciplines: params.disciplines,
      fileName: params.fileName,
      author,
      overwriteConfirmed: params.overwriteConfirmed,
    });

    if (result.status === 'saved') {
      setPautasGerais(result.allPautas);
      setPautaAuditLogs((prev) => [result.auditLog, ...prev]);
      showToast(
        `Pauta Geral v${result.pauta.version} guardada como rascunho interno (${result.pauta.rows.length} estudantes).`
      );
    }

    return result;
  };

  const togglePublishPautaGeral = (pautaId: string) => {
    const target = pautasGerais.find((p) => p.id === pautaId);
    if (!target) return;

    const now = formatTimestampNow();
    const author = currentUser?.name || 'Secretaria Geral';
    const nextPublished = !target.published;

    const updatedPauta: PautaGeral = {
      ...target,
      published: nextPublished,
      publishedAt: nextPublished ? now : undefined,
      publishedBy: nextPublished ? author : undefined,
      updatedAt: now,
      updatedBy: author,
    };

    setPautasGerais((prev) => prev.map((p) => (p.id === pautaId ? updatedPauta : p)));

    // Sync grades to students ONLY when published
    if (nextPublished) {
      setStudents((prevStudents) => syncPublishedPautaToStudents(updatedPauta, prevStudents));
      for (const row of updatedPauta.rows) {
        pushNotification({
          recipientId: row.studentId,
          title: `Pauta Publicada · ${updatedPauta.period}`,
          message: `Os resultados da pauta geral de ${updatedPauta.courseName} (${updatedPauta.classId}) foram publicados pela Secretaria.`,
          type: 'minipauta',
          linkRoute: 'resultados',
        });
      }
    }

    const auditEntry: PautaGeralAuditLog = {
      id: `pg-log-${Date.now()}`,
      pautaId: updatedPauta.id,
      fileName: updatedPauta.sourceFileName,
      courseName: updatedPauta.courseName,
      classId: updatedPauta.classId,
      academicYear: updatedPauta.academicYear,
      period: updatedPauta.period,
      action: nextPublished ? 'Publicação' : 'Ocultação',
      processedCount: updatedPauta.rows.length,
      validCount: updatedPauta.rows.length,
      errorCount: 0,
      author,
      timestamp: now,
      details: nextPublished
        ? `Pauta Geral v${updatedPauta.version} publicada para consulta individual dos estudantes.`
        : `Publicação suspensa. A pauta voltou a rascunho interno.`,
    };
    setPautaAuditLogs((prev) => [auditEntry, ...prev]);

    showToast(
      nextPublished
        ? `Pauta Geral publicada no Portal do Estudante (${updatedPauta.classId}).`
        : 'Pauta Geral ocultada do Portal do Estudante.',
      nextPublished ? 'success' : 'info'
    );
  };

  const updatePautaGeralCellGrade = (
    pautaId: string,
    studentNumber: string,
    disciplineName: string,
    grade: number
  ) => {
    const safeGrade = Math.round(Math.min(20, Math.max(0, grade)) * 10) / 10;
    const now = formatTimestampNow();
    const author = currentUser?.name || 'Secretaria Geral';

    let updatedTarget: PautaGeral | null = null;
    setPautasGerais((prev) =>
      prev.map((pauta) => {
        if (pauta.id !== pautaId) return pauta;
        const nextRows = pauta.rows.map((row) => {
          if (row.studentNumber !== studentNumber) return row;
          const nextGrades = { ...row.grades, [disciplineName]: safeGrade };
          const vals = pauta.disciplines.map((d) => nextGrades[d] ?? 0);
          const avg =
            vals.length > 0
              ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
              : 0;
          return {
            ...row,
            grades: nextGrades,
            average: avg,
            status: determineAcademicStatus(avg),
          };
        });
        const nextSummary = summarizePautaRows(nextRows, pauta.disciplines);
        updatedTarget = {
          ...pauta,
          rows: nextRows,
          summary: nextSummary,
          updatedAt: now,
          updatedBy: author,
        };
        return updatedTarget;
      })
    );

    if (updatedTarget) {
      const targetRef: PautaGeral = updatedTarget;
      if (targetRef.published) {
        setStudents((prevStudents) => syncPublishedPautaToStudents(targetRef, prevStudents));
      }
      setPautaAuditLogs((prev) => [
        {
          id: `pg-log-${Date.now()}`,
          pautaId: targetRef.id,
          fileName: targetRef.sourceFileName,
          courseName: targetRef.courseName,
          classId: targetRef.classId,
          academicYear: targetRef.academicYear,
          period: targetRef.period,
          action: 'Edição Manual',
          processedCount: 1,
          validCount: 1,
          errorCount: 0,
          author,
          timestamp: now,
          details: `Nota de ${disciplineName} atualizada para ${safeGrade} na matrícula ${studentNumber}.`,
        },
        ...prev,
      ]);
      showToast(`Nota de ${disciplineName} (${studentNumber}) atualizada para ${safeGrade}.`);
    }
  };

  // ==========================================
  // MÓDULO DE MINIPAUTAS
  // ==========================================
  const togglePublishMinipauta = (minipautaId: string) => {
    const now = formatTimestampNow();
    const author = currentUser?.name || 'Secretaria Geral';
    setMinipautas((prev) =>
      prev.map((m) => {
        if (m.id !== minipautaId) return m;
        const nextPub = !m.published;
        setMinipautaAuditLogs((logs) => [
          {
            id: `mp-log-${Date.now()}`,
            minipautaId: m.id,
            disciplineName: m.disciplineName,
            classId: m.classId,
            action: nextPub ? 'Publicação' : 'Ocultação',
            details: nextPub
              ? 'Minipauta publicada para consulta no Portal do Estudante.'
              : 'Publicação suspensa pela Secretaria.',
            author,
            timestamp: now,
          },
          ...logs,
        ]);
        showToast(nextPub ? 'Minipauta publicada para estudantes.' : 'Minipauta ocultada.', 'info');
        return {
          ...m,
          published: nextPub,
          publishedAt: nextPub ? now : undefined,
          updatedAt: now,
          updatedBy: author,
        };
      })
    );
  };

  const importMinipautaEntries = (
    minipautaId: string,
    entries: MinipautaEntry[],
    sourceFile?: string
  ) => {
    const now = formatTimestampNow();
    const author = currentUser?.name || 'Secretaria Geral';
    setMinipautas((prev) =>
      prev.map((m) => {
        if (m.id !== minipautaId) return m;
        setMinipautaAuditLogs((logs) => [
          {
            id: `mp-log-${Date.now()}`,
            minipautaId: m.id,
            disciplineName: m.disciplineName,
            classId: m.classId,
            action: sourceFile ? 'Importação Excel/CSV' : 'Atualização de Notas',
            details: sourceFile
              ? `${entries.length} registos importados a partir de ${sourceFile}.`
              : `${entries.length} classificações atualizadas na minipauta.`,
            author,
            timestamp: now,
          },
          ...logs,
        ]);
        return { ...m, entries, updatedAt: now, updatedBy: author };
      })
    );
    showToast('Minipauta atualizada com sucesso!');
  };

  // ==========================================
  // SERVIÇOS DIGITAIS & COMPROVATIVOS
  // ==========================================
  const submitDeclarationRequest = (data: {
    type: DeclarationRequest['type'];
    purpose: string;
    observations?: string;
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const req: DeclarationRequest = {
      id: `dec-${Date.now()}`,
      requestCode: `DEC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      courseName: currentStudent.courseName,
      classId: currentStudent.classId,
      type: data.type,
      purpose: data.purpose,
      observations: data.observations,
      status: 'Pendente',
      createdAt: now,
      updatedAt: now,
    };
    setDeclarations((prev) => [req, ...prev]);
    showToast(`Pedido de declaração submetido (${req.requestCode}).`);
  };

  const updateDeclarationStatus = (
    id: string,
    status: RequestStatus,
    secretaryNote?: string,
    issuedDocumentUrl?: string,
    issuedDocumentName?: string
  ) => {
    const now = formatTimestampNow();
    setDeclarations((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              secretaryNote: secretaryNote ?? d.secretaryNote,
              issuedDocumentUrl: issuedDocumentUrl ?? d.issuedDocumentUrl,
              issuedDocumentName: issuedDocumentName ?? d.issuedDocumentName,
              updatedAt: now,
            }
          : d
      )
    );
    showToast(`Declaração atualizada para: ${status}`);
  };

  const submitCadernetaRequest = (data: {
    type: CadernetaRequest['type'];
    reason: string;
    observations?: string;
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const req: CadernetaRequest = {
      id: `cad-${Date.now()}`,
      requestCode: `CAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      courseName: currentStudent.courseName,
      classId: currentStudent.classId,
      type: data.type,
      reason: data.reason,
      observations: data.observations,
      status: 'Pendente',
      createdAt: now,
      updatedAt: now,
    };
    setCadernetas((prev) => [req, ...prev]);
    showToast(`Solicitação de caderneta submetida (${req.requestCode}).`);
  };

  const updateCadernetaStatus = (id: string, status: RequestStatus, secretaryNote?: string) => {
    const now = formatTimestampNow();
    setCadernetas((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status, secretaryNote: secretaryNote ?? c.secretaryNote, updatedAt: now } : c
      )
    );
    showToast(`Pedido de caderneta atualizado para: ${status}`);
  };

  const submitCertificateRequest = (data: {
    type: CertificateRequest['type'];
    purpose: string;
    observations?: string;
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const req: CertificateRequest = {
      id: `cert-${Date.now()}`,
      requestCode: `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      courseName: currentStudent.courseName,
      classId: currentStudent.classId,
      type: data.type,
      purpose: data.purpose,
      observations: data.observations,
      status: 'Pendente',
      createdAt: now,
      updatedAt: now,
    };
    setCertificates((prev) => [req, ...prev]);
    showToast(`Pedido de certificado submetido (${req.requestCode}).`);
  };

  const updateCertificateStatus = (
    id: string,
    status: RequestStatus,
    secretaryNote?: string,
    issuedDocumentUrl?: string,
    issuedDocumentName?: string
  ) => {
    const now = formatTimestampNow();
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              secretaryNote: secretaryNote ?? c.secretaryNote,
              issuedDocumentUrl: issuedDocumentUrl ?? c.issuedDocumentUrl,
              issuedDocumentName: issuedDocumentName ?? c.issuedDocumentName,
              updatedAt: now,
            }
          : c
      )
    );
    showToast(`Pedido de certificado atualizado para: ${status}`);
  };

  const submitAbsenceJustification = (data: {
    absenceDate: string;
    discipline: string;
    reason: AbsenceJustificationRequest['reason'];
    description: string;
    attachmentName?: string;
    attachmentUrl?: string;
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const req: AbsenceJustificationRequest = {
      id: `abs-${Date.now()}`,
      requestCode: `FAL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      courseName: currentStudent.courseName,
      classId: currentStudent.classId,
      absenceDate: data.absenceDate,
      discipline: data.discipline,
      reason: data.reason,
      description: data.description,
      attachmentName: data.attachmentName,
      attachmentUrl: data.attachmentUrl,
      status: 'Pendente',
      createdAt: now,
      updatedAt: now,
    };
    setAbsences((prev) => [req, ...prev]);
    showToast(`Justificação de falta submetida (${req.requestCode}).`);
  };

  const updateAbsenceStatus = (id: string, status: RequestStatus, secretaryNote?: string) => {
    const now = formatTimestampNow();
    setAbsences((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status, secretaryNote: secretaryNote ?? a.secretaryNote, updatedAt: now } : a
      )
    );
    showToast(`Justificação atualizada para: ${status}`);
  };

  const submitTransferRequest = (data: {
    destinationInstitution: string;
    reason: string;
    observations?: string;
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const req: TransferRequest = {
      id: `tr-${Date.now()}`,
      requestCode: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      currentCourse: currentStudent.courseName,
      currentClass: currentStudent.classId,
      destinationInstitution: data.destinationInstitution,
      reason: data.reason,
      observations: data.observations,
      status: 'Pendente',
      createdAt: now,
      updatedAt: now,
    };
    setTransfers((prev) => [req, ...prev]);
    showToast(`Pedido de transferência submetido (${req.requestCode}).`);
  };

  const updateTransferStatus = (id: string, status: RequestStatus, secretaryNote?: string) => {
    const now = formatTimestampNow();
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, secretaryNote: secretaryNote ?? t.secretaryNote, updatedAt: now } : t
      )
    );
    showToast(`Pedido de transferência atualizado para: ${status}`);
  };

  const submitPaymentReceipt = (data: {
    feeType: PaymentReceipt['feeType'];
    amountPaid: number;
    paymentDate: string;
    bankReference: string;
    observations?: string;
    receiptFileName: string;
    receiptFileUrl: string;
    receiptFileType: 'image' | 'pdf';
  }) => {
    if (!currentStudent) return;
    const now = formatTimestampNow();
    const rec: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      receiptCode: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentNumber: currentStudent.studentNumber,
      studentName: currentStudent.name,
      feeType: data.feeType,
      amountPaid: data.amountPaid,
      paymentDate: data.paymentDate,
      bankReference: data.bankReference,
      observations: data.observations,
      receiptFileName: data.receiptFileName,
      receiptFileUrl: data.receiptFileUrl,
      receiptFileType: data.receiptFileType,
      status: 'Aguardando validação',
      createdAt: now,
    };
    setPaymentReceipts((prev) => [rec, ...prev]);
    showToast(`Comprovativo submetido (${rec.receiptCode}). Aguarda validação da Secretaria.`);
  };

  const validatePaymentReceipt = (
    id: string,
    status: PaymentReceiptStatus,
    secretaryNote?: string
  ) => {
    const now = formatTimestampNow();
    const validator = currentUser?.name || 'Secretaria Geral';
    setPaymentReceipts((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              secretaryNote: secretaryNote ?? r.secretaryNote,
              validatedBy: validator,
              validatedAt: now,
            }
          : r
      )
    );
    showToast(`Comprovativo marcado como: ${status}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // ==========================================
  // NOTÍCIAS & GALERIA
  // ==========================================
  const addNews = (item: Omit<NewsItem, 'id'>) => {
    setNews((prev) => [{ ...item, id: `news-${Date.now()}` }, ...prev]);
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
    setGallery((prev) => [{ ...photo, id: `photo-${Date.now()}` }, ...prev]);
    showToast('Fotografia adicionada à galeria!');
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showToast('Fotografia removida da galeria!');
  };

  // ==========================================
  // AUTENTICAÇÃO & SESSÃO
  // ==========================================
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
        enrollmentStatus: found.enrollmentStatus,
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

  const loginAsSecretaria = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !pass) {
      return { success: false, error: 'Por favor preencha o e-mail e a palavra-passe.' };
    }
    if (email.trim().toLowerCase() !== 'secretaria@itpss.ao' || pass !== 'sec123') {
      return { success: false, error: 'Credenciais da Secretaria inválidas.' };
    }
    setCurrentUser(SECRETARIA_DEFAULT_USER);
    setActiveSection('admin');
    setAdminRoute('pautas-gerais');
    setIsAuthModalOpen(false);
    showToast('Sessão iniciada como Secretaria Geral Pedagógica.');
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
      classId: '10ª A',
      academicYear: '2026/2027',
      email: data.email.trim(),
      phone: data.phone.trim(),
      enrollmentStatus: 'Ativa',
      attendanceRate: 100,
      overallAverage: 0,
      disciplines: [
        { id: 'd1', name: 'Anatomia', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
        { id: 'd2', name: 'Fisiologia', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
        { id: 'd3', name: 'Farmacologia', grades: { periodo1: 0, periodo2: 0, periodo3: 0 } },
      ],
    };

    setStudents((prev) => [newStudent, ...prev]);
    selectStudent(newStudentId);
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
    dataRepository.resetAll();
    setCourses(INITIAL_COURSES);
    setPaymentItems(INITIAL_PAYMENTS);
    setStudents(INITIAL_STUDENTS);
    setClasses(INITIAL_CLASSES);
    setPreEnrollments(INITIAL_PRE_ENROLLMENTS);
    setNews(INITIAL_NEWS);
    setGallery(INITIAL_GALLERY);
    setPautasGerais(INITIAL_PAUTAS_GERAIS);
    setPautaAuditLogs(INITIAL_PAUTA_AUDIT_LOGS);
    setMinipautas(INITIAL_MINIPAUTAS);
    setMinipautaAuditLogs(INITIAL_MINIPAUTA_AUDIT_LOGS);
    setDeclarations(INITIAL_DECLARATIONS);
    setCadernetas(INITIAL_CADERNETAS);
    setCertificates(INITIAL_CERTIFICATES);
    setAbsences(INITIAL_ABSENCES);
    setTransfers(INITIAL_TRANSFERS);
    setPaymentReceipts(INITIAL_PAYMENT_RECEIPTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentStudentId('std-1');
    showToast('Dados de demonstração repostos com sucesso!', 'info');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_DEFAULT_USER);
      setActiveSection('admin');
      setAdminRoute('dashboard');
    } else if (role === 'secretaria') {
      setCurrentUser(SECRETARIA_DEFAULT_USER);
      setActiveSection('admin');
      setAdminRoute('pautas-gerais');
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
        loginAsSecretaria,
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
        classes,
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

        pautasGerais,
        pautaAuditLogs,
        importPautaGeral,
        togglePublishPautaGeral,
        updatePautaGeralCellGrade,

        minipautas,
        minipautaAuditLogs,
        togglePublishMinipauta,
        importMinipautaEntries,

        declarations,
        submitDeclarationRequest,
        updateDeclarationStatus,
        cadernetas,
        submitCadernetaRequest,
        updateCadernetaStatus,
        certificates,
        submitCertificateRequest,
        updateCertificateStatus,
        absences,
        submitAbsenceJustification,
        updateAbsenceStatus,
        transfers,
        submitTransferRequest,
        updateTransferStatus,
        paymentReceipts,
        submitPaymentReceipt,
        validatePaymentReceipt,
        notifications,
        markNotificationAsRead,

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
