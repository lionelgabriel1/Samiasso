import React, { useState } from 'react';
import {
  FileCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Phone,
  Info,
  Calendar,
  Shield,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';

export const MatriculasPage: React.FC = () => {
  const {
    courses,
    submitPreEnrollment,
    setPublicRoute,
    setActiveSection,
    setAdminRoute,
    selectedCourseForEnrollment,
    setSelectedCourseForEnrollment,
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [classLevel, setClassLevel] = useState<'10ª' | '11ª' | ''>('10ª');
  const [courseId, setCourseId] = useState(
    selectedCourseForEnrollment || courses[0]?.id || 'enfermagem-geral'
  );
  const [message, setMessage] = useState('');

  // Update courseId if selectedCourseForEnrollment changed
  React.useEffect(() => {
    if (selectedCourseForEnrollment) {
      setCourseId(selectedCourseForEnrollment);
    }
  }, [selectedCourseForEnrollment]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = submitPreEnrollment({
      fullName,
      phone,
      classLevel: classLevel as '10ª' | '11ª',
      courseId,
      message,
    });

    if (result.success && result.code) {
      setSubmittedCode(result.code);
      setFullName('');
      setPhone('');
      setMessage('');
    } else if (result.errors) {
      setFormErrors(result.errors);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/campus-drone.jpg"
            alt="Matrículas ITPSS"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10385F] via-[#10385F]/90 to-[#10385F]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <button
              onClick={() => setPublicRoute('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Início
            </button>
            <span>&gt;</span>
            <span className="text-[#F28C28] font-semibold">Matrículas</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Matrículas e Pré-Inscrições
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Abertas para a 10.ª e 11.ª classes nos cursos técnicos de saúde.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Instructions and Clarification */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/80 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F28C28] text-xs font-bold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Ano Letivo 2026</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#10385F]">
                Processo de Ingresso
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                O preenchimento deste formulário constitui um <strong>pedido de pré-inscrição</strong> para reserva de vaga. A confirmação oficial da matrícula requer a validação documental presencial na secretaria pedagógica do ITPSS no Luena.
              </p>

              {/* Steps */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1456A0] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#10385F]">Submissão Online</h4>
                    <p className="text-xs text-slate-500">
                      Preencha os seus dados pessoais, contacto e curso pretendido.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1456A0] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#10385F]">Contacto da Secretaria</h4>
                    <p className="text-xs text-slate-500">
                      A nossa equipa contacta o encarregado ou estudante para agendamento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1456A0] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#10385F]">Formalização Presencial</h4>
                    <p className="text-xs text-slate-500">
                      Entrega dos certificados físicos e assinatura da ficha de inscrição.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Disclaimer Notice */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                <Info className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Aviso Importante:</strong> A submissão deste pedido não constitui confirmação de matrícula oficial definitiva. As vagas são preenchidas conforme a ordem de confirmação física e capacidade das turmas.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Ficha de Inscrição: <strong>Gratuita</strong></span>
                <span className="text-[#1456A0] font-semibold">Licença {INSTITUTION_INFO.license}</span>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-[#10385F] text-white p-6 rounded-3xl shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#F28C28]">Precisa de apoio imediato?</h3>
              <p className="text-xs text-slate-300">
                Contacte diretamente a secretaria escolar através dos nossos números oficiais:
              </p>
              <div className="space-y-1 text-xs">
                <a href={`tel:${INSTITUTION_INFO.phone1Raw}`} className="block text-white font-bold hover:underline">
                  {INSTITUTION_INFO.phone1}
                </a>
                <a href={`tel:${INSTITUTION_INFO.phone2Raw}`} className="block text-white font-bold hover:underline">
                  {INSTITUTION_INFO.phone2}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Enrollment Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200/80">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1456A0] block mb-1">
                  Formulário Oficial
                </span>
                <h2 className="text-2xl font-black text-[#10385F]">
                  Ficha de Pré-Inscrição
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Todos os campos assinalados com (*) são de preenchimento obrigatório.
                </p>
              </div>

              {submittedCode ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black text-[#10385F]">
                    Pedido de Pré-Inscrição Registado!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    O seu pedido foi recebido pelo sistema de secretaria do ITPSS e já está disponível para consulta administrativa.
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Código de Protocolo
                    </span>
                    <span className="text-xl font-mono font-black text-[#1456A0] tracking-wider">
                      {submittedCode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Guarde este código. A nossa secretaria entrará em contacto pelo número informado.
                  </p>

                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedCode(null)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Nova Inscrição
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('admin');
                        setAdminRoute('matriculas');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Ver no Painel Administrativo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPublicRoute('home')}
                      className="px-5 py-2.5 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nome Completo do Candidato *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Manuel António da Silva"
                      className={`w-full px-4 py-3 text-sm rounded-xl border ${
                        formErrors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#1456A0]`}
                    />
                    {formErrors.fullName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Número de Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +244 938 000 000"
                      className={`w-full px-4 py-3 text-sm rounded-xl border ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#1456A0]`}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Class and Course */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Classe Pretendida *
                      </label>
                      <select
                        required
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value as '10ª' | '11ª')}
                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white ${
                          formErrors.classLevel ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                        } focus:outline-none focus:ring-2 focus:ring-[#1456A0]`}
                      >
                        <option value="10ª">10.ª Classe</option>
                        <option value="11ª">11.ª Classe</option>
                      </select>
                      {formErrors.classLevel && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.classLevel}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Curso de Interesse *
                      </label>
                      <select
                        required
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className={`w-full px-4 py-3 text-sm rounded-xl border bg-white ${
                          formErrors.courseId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                        } focus:outline-none focus:ring-2 focus:ring-[#1456A0]`}
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.courseId && (
                        <p className="text-xs text-rose-600 mt-1">{formErrors.courseId}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mensagem ou Observações (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Indique o turno de preferência (Manhã/Tarde) ou informações sobre transferências escolares..."
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-[#F28C28] hover:bg-[#e07b16] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submeter Pedido de Pré-Inscrição</span>
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Ficha de inscrição gratuita. Processamento imediato na secretaria.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
