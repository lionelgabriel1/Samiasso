import React, { useState } from 'react';
import {
  LayoutDashboard,
  Award,
  Calendar,
  Clock,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { useApp, StudentRoute } from '../../context/AppContext.tsx';
import { Logo } from '../../components/common/Logo.tsx';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const {
    studentRoute,
    setStudentRoute,
    setActiveSection,
    currentStudent,
    students,
    selectStudent,
    logout,
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuItems: { id: StudentRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'resultados', label: 'Resultados (Notas)', icon: <Award className="w-5 h-5" /> },
    { id: 'horario', label: 'Horário', icon: <Calendar className="w-5 h-5" /> },
    { id: 'assiduidade', label: 'Assiduidade', icon: <Clock className="w-5 h-5" /> },
    { id: 'comunicados', label: 'Comunicados', icon: <Bell className="w-5 h-5" /> },
    { id: 'perfil', label: 'Perfil e Cartão', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const handleNav = (id: StudentRoute) => {
    setStudentRoute(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col lg:flex-row text-[#10385F] pt-9">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col bg-[#10385F] text-white transition-all duration-300 relative border-r border-[#0b2743] shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-4 border-b border-white/10 justify-between">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
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
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Student Profile Snippet in Sidebar matching mockup */}
        {!isSidebarCollapsed && currentStudent && (
          <div className="p-4 mx-2 mt-3 rounded-2xl bg-[#0b2743] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1456A0] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/20">
              {currentStudent.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-xs text-white truncate">{currentStudent.name}</h4>
              <span className="text-[10px] text-slate-400 block truncate">
                {currentStudent.classId} • {currentStudent.studentNumber}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav aria-label="Menu do estudante" className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = studentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1456A0] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isSidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Switcher & Logout */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Student Switcher dropdown for quick demo inspection */}
          {!isSidebarCollapsed && (
            <div className="px-2 py-1">
              <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                Mudar Aluno (Demo):
              </label>
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => selectStudent(e.target.value)}
                className="w-full text-[11px] bg-[#0b2743] border border-white/10 rounded-lg p-1.5 text-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.classId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setActiveSection('public')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Voltar ao Website Público"
          >
            <Globe className="w-4 h-4 text-[#F28C28]" />
            {!isSidebarCollapsed && <span>Website Público</span>}
          </button>

          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Sair</span>}
          </button>
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
            aria-label="Abrir navegação do estudante"
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
                const isActive = studentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#1456A0] text-white' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
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

      {/* 3. MAIN STUDENT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-extrabold text-[#10385F] uppercase tracking-wider">
              Portal do Estudante
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1456A0] border border-blue-200/80 text-[10px] font-bold">
              <span>Perfil de Exemplo</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-[#10385F] block">
                {currentStudent?.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentStudent?.courseName} • {currentStudent?.classId}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#1456A0] text-white font-bold text-xs flex items-center justify-center border border-slate-200">
              {currentStudent?.name.charAt(0)}
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
