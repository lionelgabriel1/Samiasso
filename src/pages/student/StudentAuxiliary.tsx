import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Bell, User as UserIcon, Printer, Shield, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Logo } from '../../components/common/Logo.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';

export const StudentHorario: React.FC = () => {
  const { currentStudent, schedule } = useApp();

  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Horário Escolar Semanal</h2>
        <p className="text-xs text-slate-500">
          Aulas teóricas e práticas laboratoriais para a turma {currentStudent?.classId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayClasses = schedule.filter((s) => s.day === day || day === 'Segunda-feira');
          return (
            <div key={day} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-[#10385F]">{day}</h3>
                <span className="text-[10px] font-bold text-[#1456A0] bg-blue-50 px-2 py-0.5 rounded">
                  Manhã
                </span>
              </div>

              <div className="space-y-3">
                {dayClasses.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#1456A0] font-mono font-bold text-[11px]">
                      <span>{item.time}</span>
                      <span className="bg-white px-2 py-0.5 rounded border text-[10px] text-slate-600">
                        {item.room}
                      </span>
                    </div>
                    <div className="font-extrabold text-[#10385F] text-xs">{item.subject}</div>
                    <div className="text-[10px] text-slate-400">{item.teacher}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StudentAssiduidade: React.FC = () => {
  const { currentStudent } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Registo de Assiduidade</h2>
        <p className="text-xs text-slate-500">Controlo de presenças às aulas e estágios hospitalares</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center">
          <span className="text-xs font-semibold text-slate-500 block">Taxa de Presença</span>
          <span className="text-4xl font-black text-emerald-600 mt-1 block">
            {currentStudent?.attendanceRate}%
          </span>
          <span className="text-[10px] text-slate-400">Regularidade comprovada</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center">
          <span className="text-xs font-semibold text-slate-500 block">Faltas Justificadas</span>
          <span className="text-4xl font-black text-[#1456A0] mt-1 block">2</span>
          <span className="text-[10px] text-slate-400">Atestados médicos validados</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center">
          <span className="text-xs font-semibold text-slate-500 block">Faltas Injustificadas</span>
          <span className="text-4xl font-black text-slate-700 mt-1 block">1</span>
          <span className="text-[10px] text-slate-400">Limite de faltas: 15%</span>
        </div>
      </div>
    </div>
  );
};

export const StudentComunicados: React.FC = () => {
  const { notices } = useApp();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Comunicados e Avisos do Estudante</h2>
        <p className="text-xs text-slate-500">Informações afixadas pela Direção Pedagógica e Secretaria</p>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-[#F28C28] uppercase">{notice.category}</span>
              <span>{notice.date}</span>
            </div>
            <h3 className="font-extrabold text-base text-[#10385F]">{notice.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentPerfil: React.FC = () => {
  const { currentStudent } = useApp();

  if (!currentStudent) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Cartão Oficial de Estudante</h2>
          <p className="text-xs text-slate-500">Identificação estudantil oficial do ITPSS</p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Printer className="w-4 h-4 text-[#1456A0]" />
          <span>Imprimir Cartão</span>
        </button>
      </div>

      {/* Student Badge Card */}
      <div className="bg-gradient-to-br from-[#10385F] via-[#1456A0] to-[#0f427c] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/20">
        {/* Subtle watermark background */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none w-64 h-64">
          <img src="/images/itpss-logo.svg" alt="" className="w-full h-full" />
        </div>

        <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4 mb-6">
          <Logo size="sm" light={true} />
          <span className="bg-[#F28C28] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
            Cartão de Estudante
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-4 flex flex-col items-center">
            <div className="w-28 h-32 rounded-2xl bg-white/10 border-2 border-white/30 flex items-center justify-center text-4xl font-black text-white shadow-inner">
              {currentStudent.name.charAt(0)}
            </div>
            <span className="text-[10px] text-slate-300 mt-2 font-mono">{currentStudent.studentNumber}</span>
          </div>

          <div className="sm:col-span-8 space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Nome Completo</span>
              <span className="text-lg font-black text-white block">{currentStudent.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-semibold block">Curso</span>
                <span className="font-bold text-white block truncate">{currentStudent.courseName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-semibold block">Turma</span>
                <span className="font-bold text-white block">{currentStudent.classId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-semibold block">Ano Académico</span>
                <span className="font-bold text-white block">{currentStudent.academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-semibold block">Licença</span>
                <span className="font-bold text-white block">{INSTITUTION_INFO.license}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
