import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Clock,
  ClipboardList,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Globe,
  Menu,
  X,
  FileSpreadsheet,
  FileText,
  Receipt,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { useApp, AdminRoute } from '../../context/AppContext.tsx';
import { Logo } from '../../components/common/Logo.tsx';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminRoute,
    setAdminRoute,
    setActiveSection,
    currentUser,
    logout,
    preEnrollments,
    declarations,
    cadernetas,
    certificates,
    absences,
    transfers,
    paymentReceipts,
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const pendingPreEnrollmentsCount = preEnrollments.filter((p) => p.status === 'Pendente').length;
  const pendingDeclarationsCount = declarations.filter((d) => d.status === 'Pendente').length;
  const pendingCadernetasCount = cadernetas.filter((c) => c.status === 'Pendente').length;
  const pendingCertificatesCount = certificates.filter((c) => c.status === 'Pendente').length;
  const pendingAbsencesCount = absences.filter((a) => a.status === 'Pendente').length;
  const pendingTransfersCount = transfers.filter((t) => t.status === 'Pendente').length;
  const pendingReceiptsCount = paymentReceipts.filter((r) => r.status === 'Aguardando validação').length;

  const menuItems: { id: AdminRoute; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'minipautas', label: 'Minipautas', icon: <FileSpreadsheet className="w-5 h-5" /> },
    {
      id: 'comprovativos',
      label: 'Comprovativos / Emolumentos',
      icon: <Receipt className="w-5 h-5" />,
      badge: pendingReceiptsCount,
    },
    {
      id: 'declaracoes',
      label: 'Declarações',
      icon: <FileText className="w-5 h-5" />,
      badge: pendingDeclarationsCount,
    },
    {
      id: 'cadernetas',
      label: 'Cadernetas',
      icon: <BookOpen className="w-5 h-5" />,
      badge: pendingCadernetasCount,
    },
    {
      id: 'certificados',
      label: 'Certificados',
      icon: <Award className="w-5 h-5" />,
      badge: pendingCertificatesCount,
    },
    {
      id: 'faltas',
      label: 'Justificação de Faltas',
      icon: <Clock className="w-5 h-5" />,
      badge: pendingAbsencesCount,
    },
    {
      id: 'transferencias',
      label: 'Transferências',
      icon: <Building className="w-5 h-5" />,
      badge: pendingTransfersCount,
    },
    { id: 'alunos', label: 'Estudantes', icon: <Users className="w-5 h-5" /> },
    { id: 'turmas', label: 'Turmas & Classes', icon: <Calendar className="w-5 h-5" /> },
    { id: 'docentes', label: 'Docentes', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'cursos', label: 'Cursos Médios', icon: <BookOpen className="w-5 h-5" /> },
    {
      id: 'matriculas',
      label: 'Pré-Inscrições',
      icon: <ClipboardList className="w-5 h-5" />,
      badge: pendingPreEnrollmentsCount,
    },
    { id: 'utilizadores', label: 'Utilizadores & Perfis', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'noticias', label: 'Notícias & Avisos', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'galeria', label: 'Galeria Fotográfica', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNav = (id: AdminRoute) => {
    setAdminRoute(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row text-[#10385F]">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col bg-[#10385F] text-white transition-all duration-300 relative border-r border-[#0b2743] shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo and Brand */}
        <div className="h-20 flex items-center px-4 border-b border-white/10 justify-between">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Logo size="sm" light={true} />
            </div>
          ) : (
            <div className="mx-auto">
              <Logo size="sm" showText={false} />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav aria-label="Menu administrativo" className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = adminRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-[#1456A0] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>

                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#F28C28] text-white' : 'bg-[#F28C28] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile and Site Link */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Quick link to public website */}
          <button
            onClick={() => setActiveSection('public')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Ver Website Público"
          >
            <Globe className="w-4 h-4 text-[#F28C28]" />
            {!isSidebarCollapsed && <span>Website Público</span>}
          </button>

          {/* Admin User Card */}
          <div className="p-2.5 rounded-xl bg-[#0b2743] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#1456A0] text-white flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              {!isSidebarCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {currentUser?.name || 'Administrador'}
                  </div>
                  <div className="text-[10px] text-slate-400">Admin ITPSS</div>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                title="Terminar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE HEADER & DRAWER */}
      <div className="lg:hidden bg-[#10385F] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow">
        <Logo size="sm" light={true} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('public')}
            className="p-2 text-slate-300 hover:text-white text-xs font-medium"
            title="Ver Website"
          >
            <Globe className="w-5 h-5 text-[#F28C28]" />
          </button>

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
            aria-label="Abrir navegação administrativa"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isMobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex lg:hidden animate-in fade-in"
        >
          <div className="w-72 bg-[#10385F] text-white h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <Logo size="sm" light={true} />
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = adminRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#1456A0] text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F28C28] text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={() => {
                  setActiveSection('public');
                  setIsMobileDrawerOpen(false);
                }}
                className="text-xs text-[#F28C28] font-bold flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span>Website Público</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsMobileDrawerOpen(false);
                }}
                className="text-xs text-rose-300 hover:underline"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN ADMIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-[#10385F] capitalize">
              {adminRoute.replace('-', ' ')}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold">
              <span>Modo Demonstração</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Switcher buttons */}
            <button
              onClick={() => setActiveSection('student')}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1456A0] text-xs font-bold rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Ver Área do Aluno</span>
            </button>

            <button
              onClick={() => setActiveSection('public')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Ver Site Público</span>
            </button>

            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#10385F] text-white font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <span className="text-xs font-bold text-[#10385F] hidden md:inline">
                Admin ITPSS
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
