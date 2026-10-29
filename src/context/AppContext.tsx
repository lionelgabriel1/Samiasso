import React, { createContext, useContext, useState, useEffect } from 'react';
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
  validatePreEnrollment,
} from '../utils/academic.ts';

export type PublicRoute = 'home' | 'sobre' | 'cursos' | 'matriculas' | 'noticias' | 'galeria' | 'contactos';
export type AdminRoute = 'dashboard' | 'alunos' | 'docentes' | 'cursos' | 'turmas' | 'resultados' | 'assiduidade' | 'matriculas' | 'noticias' | 'galeria' | 'configuracoes';
export type StudentRoute = 'visao-geral' | 'resultados' | 'horario' | 'assiduidade' | 'comunicados' | 'perfil';

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
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('itpss_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>(() => {
    const saved = localStorage.getItem('itpss_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('itpss_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [preEnrollments, setPreEnrollments] = useState<PreEnrollment[]>(() => {
    const saved = localStorage.getItem('itpss_pre_enrollments');
    return saved ? JSON.parse(saved) : INITIAL_PRE_ENROLLMENTS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('itpss_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('itpss_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [notices] = useState<Notice[]>(INITIAL_NOTICES);

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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('itpss_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('itpss_pre_enrollments', JSON.stringify(preEnrollments));
  }, [preEnrollments]);

  useEffect(() => {
    localStorage.setItem('itpss_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('itpss_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('itpss_gallery', JSON.stringify(gallery));
  }, [gallery]);

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
    localStorage.removeItem('itpss_courses');
    localStorage.removeItem('itpss_payments');
    localStorage.removeItem('itpss_students');
    localStorage.removeItem('itpss_news');
    localStorage.removeItem('itpss_gallery');
    localStorage.removeItem('itpss_pre_enrollments');

    setCourses(INITIAL_COURSES);
    setPaymentItems(INITIAL_PAYMENTS);
    setStudents(INITIAL_STUDENTS);
    setNews(INITIAL_NEWS);
    setGallery(INITIAL_GALLERY);
    setPreEnrollments(INITIAL_PRE_ENROLLMENTS);
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
