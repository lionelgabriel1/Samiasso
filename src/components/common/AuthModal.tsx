import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, GraduationCap, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginAsAdmin,
    loginAsSecretaria,
    loginAsStudent,
    registerStudent,
    courses,
  } = useApp();

  // Student Login Form
  const [studentInput, setStudentInput] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPass, setShowStudentPass] = useState(false);

  // Admin Login Form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Student Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCourseId, setRegCourseId] = useState(courses[0]?.id || 'enfermagem-geral');
  const [regClassLevel, setRegClassLevel] = useState('10.ª Classe');
  const [regPass, setRegPass] = useState('');

  // Status
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginAsStudent(studentInput, studentPassword);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao iniciar sessão.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    let res;
    if (adminEmail.toLowerCase().includes('sec')) {
      res = await loginAsSecretaria(adminEmail, adminPassword);
    } else {
      res = await loginAsAdmin(adminEmail, adminPassword);
    }
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao iniciar sessão.');
    }
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await registerStudent({
      name: regName,
      email: regEmail,
      phone: regPhone,
      courseId: regCourseId,
      classLevel: regClassLevel,
      pass: regPass,
    });
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Erro ao criar conta.');
    }
  };

  const fillDemoStudent = () => {
    setStudentInput('2024-0142');
    setStudentPassword('senha123');
    setErrorMsg('');
  };

  const fillDemoAdmin = () => {
    setAdminEmail('admin@itpss.ao');
    setAdminPassword('admin123');
    setErrorMsg('');
  };

  const fillDemoSecretaria = () => {
    setAdminEmail('secretaria@itpss.ao');
    setAdminPassword('sec123');
    setErrorMsg('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#10385F] text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F28C28] flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight">
                Acesso Seguro ITPSS
              </h2>
              <p className="text-xs text-slate-300">
                Instituto Técnico Privado de Saúde Samiasso
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-6 bg-[#0b2743] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('student-login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'student-login'
                  ? 'bg-[#1456A0] text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Aluno (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('student-register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'student-register'
                  ? 'bg-[#1456A0] text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Novo Aluno
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authModalTab === 'admin'
                  ? 'bg-[#F28C28] text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Administrador
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-semibold">Atenção:</span> {errorMsg}
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN */}
          {authModalTab === 'student-login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="text-center mb-3">
                <span className="inline-block p-2 rounded-full bg-blue-50 text-[#1456A0] mb-1">
                  <GraduationCap className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-[#10385F]">Portal do Estudante</h3>
                <p className="text-xs text-slate-500">
                  Consulte notas, horário escolar, faltas e comunicados
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  N.º de Matrícula ou E-mail
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Ex: 2024-0142 ou ana.silva@..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showStudentPass ? 'text' : 'password'}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Introduza a sua senha"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPass(!showStudentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showStudentPass ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showStudentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  {isSubmitting ? 'A verificar...' : 'Entrar no Portal do Estudante'}
                </button>

                <button
                  type="button"
                  onClick={fillDemoStudent}
                  className="w-full py-2 text-xs font-medium text-[#1456A0] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  Usar conta de demonstração (Ana Silva — 10ª A)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT REGISTRATION */}
          {authModalTab === 'student-register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3">
              <div className="text-center mb-2">
                <h3 className="font-bold text-[#10385F] text-sm">Criar Acesso de Aluno</h3>
                <p className="text-xs text-slate-500">
                  Registe-se para aceder à sua pauta e serviços escolares
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nome e Sobrenome"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aluno@exemplo.com"
                      className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Telefone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+244 9..."
                      className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Curso</label>
                  <select
                    value={regCourseId}
                    onChange={(e) => setRegCourseId(e.target.value)}
                    className="w-full py-2 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Classe</label>
                  <select
                    value={regClassLevel}
                    onChange={(e) => setRegClassLevel(e.target.value)}
                    className="w-full py-2 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                  >
                    <option value="10.ª Classe">10.ª Classe</option>
                    <option value="11.ª Classe">11.ª Classe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Criar Palavra-passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'A criar conta...' : 'Concluir Registo de Aluno'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ADMIN LOGIN */}
          {authModalTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="text-center mb-3">
                <span className="inline-block p-2 rounded-full bg-amber-50 text-[#F28C28] mb-1">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-[#10385F]">Painel de Gestão e Secretaria</h3>
                <p className="text-xs text-slate-500">
                  Acesso reservado à direção, professores e administração
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  E-mail Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@itpss.ao"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Palavra-passe do Administrador
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Palavra-passe de gestão"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showAdminPass ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#F28C28] hover:bg-[#e07b16] text-white font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isSubmitting ? 'A autenticar...' : 'Entrar no Painel Administrativo'}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={fillDemoSecretaria}
                    className="py-2 text-[11px] font-semibold text-[#1456A0] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Acesso Secretaria (Demo)
                  </button>

                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="py-2 text-[11px] font-semibold text-[#F28C28] bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Acesso Direção (Demo)
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
