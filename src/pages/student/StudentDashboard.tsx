import React from 'react';
import {
  Award,
  Clock,
  Calendar,
  Bell,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  FileText,
  FileCheck2,
  CalendarX,
  ArrowRightLeft,
  Receipt,
  UserCheck,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { calculateDisciplineAverage, determineAcademicStatus } from '../../utils/academic.ts';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    schedule,
    notices,
    setStudentRoute,
    declarations,
    cadernetas,
    certificates,
    absences,
    transfers,
    paymentReceipts,
    minipautas,
    notifications,
  } = useApp();

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">A carregar dados do estudante...</div>;
  }

  // Filter requests belonging exclusively to current student (Strict Data Isolation)
  const myDeclarations = declarations.filter((d) => d.studentId === currentStudent.id);
  const myCadernetas = cadernetas.filter((c) => c.studentId === currentStudent.id);
  const myCertificates = certificates.filter((c) => c.studentId === currentStudent.id);
  const myAbsences = absences.filter((a) => a.studentId === currentStudent.id);
  const myTransfers = transfers.filter((t) => t.studentId === currentStudent.id);
  const myReceipts = paymentReceipts.filter((p) => p.studentId === currentStudent.id);
  const myNotifications = notifications.filter(
    (n) => n.recipientId === currentStudent.id || n.recipientId === 'all'
  );
  const unreadNotifs = myNotifications.filter((n) => !n.read).length;

  const totalPendingRequests =
    myDeclarations.filter((d) => d.status === 'Pendente' || d.status === 'Em análise').length +
    myCadernetas.filter((c) => c.status === 'Pendente' || c.status === 'Em análise').length +
    myCertificates.filter((c) => c.status === 'Pendente' || c.status === 'Em análise').length +
    myAbsences.filter((a) => a.status === 'Pendente' || a.status === 'Em análise').length +
    myTransfers.filter((t) => t.status === 'Pendente' || t.status === 'Em análise').length;

  const myReceiptsPending = myReceipts.filter((r) => r.status === 'Aguardando validação').length;

  // Published minipautas count for student's class
  const publishedMinipautas = minipautas.filter(
    (p) => p.classId === currentStudent.classId && p.published
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. STUDENT INSTITUTIONAL ID CARD (All 7 required items) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Estado da Matrícula: {currentStudent.enrollmentStatus || 'Ativa'}</span>
              <span className="text-emerald-300">•</span>
              <span>Ano Letivo: {currentStudent.academicYear}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10385F] tracking-tight font-heading">
              {currentStudent.name}
            </h2>

            {/* Official Student Credentials Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  N.º de Matrícula
                </span>
                <span className="font-mono font-black text-[#1456A0] text-sm">
                  {currentStudent.studentNumber}
                </span>
              </div>

              <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Curso Técnico
                </span>
                <span className="font-bold text-[#10385F] truncate block">
                  {currentStudent.courseName}
                </span>
              </div>

              <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Turma & Classe
                </span>
                <span className="font-bold text-[#10385F]">
                  {currentStudent.classId} • {currentStudent.classLevel}
                </span>
              </div>

              <div className="p-3 bg-[#F4F6F9] rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Contacto Oficial
                </span>
                <span className="font-bold text-slate-600 truncate block">
                  {currentStudent.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 min-w-32 text-center shadow-xs">
              <span className="text-[10px] font-bold text-[#1456A0] uppercase tracking-wider block">
                Média Geral
              </span>
              <div className="text-3xl font-black text-[#10385F] mt-0.5">
                {currentStudent.overallAverage.toFixed(1)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">
                {determineAcademicStatus(currentStudent.overallAverage)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 min-w-32 text-center shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Assiduidade
              </span>
              <div className="text-3xl font-black text-emerald-800 mt-0.5">
                {currentStudent.attendanceRate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">Regular</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DIGITAL SERVICES HUB (Direct 1-Click Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#10385F] font-heading">
              Serviços Digitais e Requerimentos
            </h3>
            <p className="text-xs text-slate-500">
              Aceda a todos os serviços da secretaria do ITPSS diretamente a partir da sua conta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Service 1: Minipautas */}
          <button
            onClick={() => setStudentRoute('resultados')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Minipautas & Notas
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Consulte as notas trimestrais homologadas e publicadas pela secretaria.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1456A0]">
              <span>{publishedMinipautas.length} pautas ativas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 2: Declarações */}
          <button
            onClick={() => setStudentRoute('pedidos')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F28C28] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Declarações Escolares
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Solicite declarações com notas, sem notas, de frequência ou trabalho.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#F28C28]">
              <span>{myDeclarations.length} pedidos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 3: Cadernetas */}
          <button
            onClick={() => setStudentRoute('cadernetas')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Cadernetas de Saúde
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Emissão de 1.ª via de ingresso ou 2.ª via por extravio.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
              <span>{myCadernetas.length} solicitações</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 4: Certificados */}
          <button
            onClick={() => setStudentRoute('certificados')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Certificados & Diplomas
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Habilitações literárias, conclusão de curso e certidões autenticadas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
              <span>{myCertificates.length} pedidos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 5: Justificação de Faltas */}
          <button
            onClick={() => setStudentRoute('faltas')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CalendarX className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Justificar Faltas
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Submissão de atestados médicos e justificações nos prazos regulamentares.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
              <span>{myAbsences.length} registos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 6: Transferências */}
          <button
            onClick={() => setStudentRoute('transferencias')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                Transferências Escolares
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Solicitação de guia de transferência e historial para outras instituições.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-600">
              <span>{myTransfers.length} pedidos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Service 7: Comprovativos de Pagamento */}
          <button
            onClick={() => setStudentRoute('pagamentos')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#1456A0] hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between sm:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F28C28] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-[#10385F] group-hover:text-[#1456A0] transition-colors">
                  Envio de Comprovativos de Pagamento (Emolumentos)
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Envie o talhão de depósito bancário ou transferência (BFA, BAI, BPC) para validação manual pela secretaria. Propinas, matrículas, declarações e cadernetas.
                </p>
              </div>

              {myReceiptsPending > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                  {myReceiptsPending} em validação
                </span>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1456A0]">
              <span>Histórico de {myReceipts.length} comprovativos</span>
              <span className="flex items-center gap-1 text-[#F28C28]">
                <span>Submeter novo comprovativo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. RECENT STATUS TRACKER (Orders, Documents & Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Estado dos Pedidos Recentes */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#10385F] font-heading">
                Acompanhamento de Solicitações
              </h3>
              <p className="text-xs text-slate-400">
                Estado dos seus pedidos de declarações, cadernetas e certificados
              </p>
            </div>
            {totalPendingRequests > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {totalPendingRequests} em análise
              </span>
            )}
          </div>

          <div className="space-y-3">
            {myDeclarations.length === 0 && myCadernetas.length === 0 && myCertificates.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Ainda não tem pedidos submetidos. Selecione um serviço acima para solicitar.
              </div>
            ) : (
              [...myDeclarations, ...myCadernetas, ...myCertificates]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1456A0] text-[11px]">
                          {req.requestCode}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-[#10385F]">{req.type}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Submetido em: {req.createdAt}
                      </span>
                      {req.secretaryNote && (
                        <p className="text-[11px] text-blue-800 bg-blue-50/80 p-2 rounded-lg mt-2 border border-blue-100">
                          <strong>Secretaria:</strong> {req.secretaryNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                          req.status === 'Concluído'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Aprovado'
                            ? 'bg-blue-100 text-blue-800'
                            : req.status === 'Em análise'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'Rejeitado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {req.status}
                      </span>

                      {'issuedDocumentUrl' in req && req.issuedDocumentUrl && req.status === 'Concluído' && (
                        <a
                          href={req.issuedDocumentUrl}
                          download
                          className="p-1.5 rounded-lg bg-[#1456A0] hover:bg-[#10385F] text-white flex items-center gap-1 text-[11px] font-bold shadow-xs"
                          title="Descarregar Documento Emitido"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right Column: Notificações & Horário */}
        <div className="lg:col-span-5 space-y-6">
          {/* Central de Notificações */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#F28C28]" />
                <h3 className="text-base font-extrabold text-[#10385F] font-heading">Notificações</h3>
              </div>
              <button
                onClick={() => setStudentRoute('notificacoes')}
                className="text-xs font-bold text-[#1456A0] hover:underline cursor-pointer"
              >
                Ver todas ({myNotifications.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {myNotifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-2xl border text-xs transition-colors ${
                    !notif.read
                      ? 'bg-blue-50/60 border-blue-200 text-[#10385F]'
                      : 'bg-[#F4F6F9] border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-[11px] text-[#1456A0]">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Horários */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#10385F] font-heading">
                Próximas Aulas
              </h3>
              <button
                onClick={() => setStudentRoute('horario')}
                className="text-xs font-bold text-[#1456A0] hover:underline cursor-pointer"
              >
                Horário completo
              </button>
            </div>

            <div className="space-y-2">
              {schedule.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-extrabold text-[#10385F] block">{item.subject}</span>
                    <span className="text-[10px] text-slate-400">
                      {item.time} • {item.day}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 font-mono">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
