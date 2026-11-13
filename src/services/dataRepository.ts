import {
  Course,
  PaymentItem,
  Student,
  ClassRoom,
  PreEnrollment,
  NewsItem,
  GalleryPhoto,
  Minipauta,
  MinipautaAuditLog,
  PautaGeral,
  PautaGeralAuditLog,
  DeclarationRequest,
  CadernetaRequest,
  CertificateRequest,
  AbsenceJustificationRequest,
  TransferRequest,
  PaymentReceipt,
  PortalNotification,
} from '../types/index.ts';
import {
  INITIAL_COURSES,
  INITIAL_PAYMENTS,
  INITIAL_STUDENTS,
  INITIAL_CLASSES,
  INITIAL_PRE_ENROLLMENTS,
  INITIAL_NEWS,
  INITIAL_GALLERY,
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

export const STORAGE_KEYS = {
  courses: 'itpss_courses',
  payments: 'itpss_payments',
  students: 'itpss_students',
  classes: 'itpss_classes',
  preEnrollments: 'itpss_pre_enrollments',
  news: 'itpss_news',
  gallery: 'itpss_gallery',
  minipautas: 'itpss_minipautas',
  minipautaLogs: 'itpss_minipauta_logs',
  pautasGerais: 'itpss_pautas_gerais',
  pautaAuditLogs: 'itpss_pauta_audit_logs',
  declarations: 'itpss_declarations',
  cadernetas: 'itpss_cadernetas',
  certificates: 'itpss_certificates',
  absences: 'itpss_absences',
  transfers: 'itpss_transfers',
  paymentReceipts: 'itpss_payment_receipts',
  notifications: 'itpss_notifications',
} as const;

export interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getBrowserStorage(): StorageBackend {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  const memory = new Map<string, string>();
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => {
      memory.set(k, v);
    },
    removeItem: (k) => {
      memory.delete(k);
    },
  };
}

export function createDataRepository(storage: StorageBackend = getBrowserStorage()) {
  function load<T>(key: string, fallback: T): T {
    try {
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save<T>(key: string, value: T): void {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota errors in restricted environments
    }
  }

  return {
    loadCourses: () => load<Course[]>(STORAGE_KEYS.courses, INITIAL_COURSES),
    saveCourses: (v: Course[]) => save(STORAGE_KEYS.courses, v),

    loadPayments: () => load<PaymentItem[]>(STORAGE_KEYS.payments, INITIAL_PAYMENTS),
    savePayments: (v: PaymentItem[]) => save(STORAGE_KEYS.payments, v),

    loadStudents: () => load<Student[]>(STORAGE_KEYS.students, INITIAL_STUDENTS),
    saveStudents: (v: Student[]) => save(STORAGE_KEYS.students, v),

    loadClasses: () => load<ClassRoom[]>(STORAGE_KEYS.classes, INITIAL_CLASSES),
    saveClasses: (v: ClassRoom[]) => save(STORAGE_KEYS.classes, v),

    loadPreEnrollments: () => load<PreEnrollment[]>(STORAGE_KEYS.preEnrollments, INITIAL_PRE_ENROLLMENTS),
    savePreEnrollments: (v: PreEnrollment[]) => save(STORAGE_KEYS.preEnrollments, v),

    loadNews: () => load<NewsItem[]>(STORAGE_KEYS.news, INITIAL_NEWS),
    saveNews: (v: NewsItem[]) => save(STORAGE_KEYS.news, v),

    loadGallery: () => load<GalleryPhoto[]>(STORAGE_KEYS.gallery, INITIAL_GALLERY),
    saveGallery: (v: GalleryPhoto[]) => save(STORAGE_KEYS.gallery, v),

    loadMinipautas: () => load<Minipauta[]>(STORAGE_KEYS.minipautas, INITIAL_MINIPAUTAS),
    saveMinipautas: (v: Minipauta[]) => save(STORAGE_KEYS.minipautas, v),

    loadMinipautaLogs: () => load<MinipautaAuditLog[]>(STORAGE_KEYS.minipautaLogs, INITIAL_MINIPAUTA_AUDIT_LOGS),
    saveMinipautaLogs: (v: MinipautaAuditLog[]) => save(STORAGE_KEYS.minipautaLogs, v),

    loadPautasGerais: () => load<PautaGeral[]>(STORAGE_KEYS.pautasGerais, INITIAL_PAUTAS_GERAIS),
    savePautasGerais: (v: PautaGeral[]) => save(STORAGE_KEYS.pautasGerais, v),

    loadPautaAuditLogs: () => load<PautaGeralAuditLog[]>(STORAGE_KEYS.pautaAuditLogs, INITIAL_PAUTA_AUDIT_LOGS),
    savePautaAuditLogs: (v: PautaGeralAuditLog[]) => save(STORAGE_KEYS.pautaAuditLogs, v),

    loadDeclarations: () => load<DeclarationRequest[]>(STORAGE_KEYS.declarations, INITIAL_DECLARATIONS),
    saveDeclarations: (v: DeclarationRequest[]) => save(STORAGE_KEYS.declarations, v),

    loadCadernetas: () => load<CadernetaRequest[]>(STORAGE_KEYS.cadernetas, INITIAL_CADERNETAS),
    saveCadernetas: (v: CadernetaRequest[]) => save(STORAGE_KEYS.cadernetas, v),

    loadCertificates: () => load<CertificateRequest[]>(STORAGE_KEYS.certificates, INITIAL_CERTIFICATES),
    saveCertificates: (v: CertificateRequest[]) => save(STORAGE_KEYS.certificates, v),

    loadAbsences: () => load<AbsenceJustificationRequest[]>(STORAGE_KEYS.absences, INITIAL_ABSENCES),
    saveAbsences: (v: AbsenceJustificationRequest[]) => save(STORAGE_KEYS.absences, v),

    loadTransfers: () => load<TransferRequest[]>(STORAGE_KEYS.transfers, INITIAL_TRANSFERS),
    saveTransfers: (v: TransferRequest[]) => save(STORAGE_KEYS.transfers, v),

    loadPaymentReceipts: () => load<PaymentReceipt[]>(STORAGE_KEYS.paymentReceipts, INITIAL_PAYMENT_RECEIPTS),
    savePaymentReceipts: (v: PaymentReceipt[]) => save(STORAGE_KEYS.paymentReceipts, v),

    loadNotifications: () => load<PortalNotification[]>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS),
    saveNotifications: (v: PortalNotification[]) => save(STORAGE_KEYS.notifications, v),

    resetAll: () => {
      Object.values(STORAGE_KEYS).forEach((key) => storage.removeItem(key));
    },
  };
}

export const dataRepository = createDataRepository();
