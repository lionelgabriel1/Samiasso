import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Award,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Receipt,
  Eye,
  X,
  CreditCard,
  Building,
  Check,
  ChevronRight,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import {
  DeclarationRequest,
  DeclarationType,
  CadernetaRequest,
  CertificateRequest,
  CertificateType,
  AbsenceJustificationRequest,
  TransferRequest,
  PaymentReceipt,
  FeeType,
} from '../../types/index.ts';

// -------------------------------------------------------------
// 1. COMPONENTE: DECLARAÇÕES
// -------------------------------------------------------------
export const StudentDeclaracoes: React.FC = () => {
  const { currentStudent, declarations, submitDeclarationRequest } = useApp();
  const [docType, setDocType] = useState<DeclarationType>('Declaração com Notas');
  const [purpose, setPurpose] = useState('Efeito de Estágio');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DeclarationRequest | null>(null);

  if (!currentStudent) return null;

  const myDeclarations = declarations.filter((d) => d.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitDeclarationRequest({
        type: docType,
        purpose,
        observations: observations || undefined,
      });
      setIsSubmitting(false);
      setObservations('');
    }, 400);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Concluído':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Concluído</span>;
      case 'Em análise':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1456A0]">Em Análise</span>;
      case 'Rejeitado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Indeferido</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pendente</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Pedido de Declarações Oficiais</h2>
        <p className="text-xs text-slate-500">
          Solicite declarações de frequência, com notas ou para efeitos específicos emitidas pela Secretaria Geral
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário de Novo Pedido */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1456A0]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Nova Solicitação</h3>
              <p className="text-[11px] text-slate-400">Preencha os dados do documento pretendido</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Declaração</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DeclarationType)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Declaração com Notas">Declaração com Notas (Aproveitamento)</option>
                <option value="Declaração sem Notas">Declaração sem Notas (Frequência Escolar)</option>
                <option value="Declaração de Frequência">Declaração de Frequência Atual</option>
                <option value="Efeito de Trabalho">Declaração para Efeito de Trabalho</option>
                <option value="Efeito de Serviço Militar">Declaração para Serviço Militar</option>
                <option value="2ª Via de Declaração">2.ª Via de Declaração</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Efeito / Finalidade</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Efeito de Estágio">Efeito de Estágio Hospitalar</option>
                <option value="Visto / Embaixada">Visto / Serviços de Embaixada</option>
                <option value="Serviço Militar">Serviço Militar Obrigatório</option>
                <option value="Emprego / Trabalho">Emprego / Entidade Patronal</option>
                <option value="Outro Efeito Legal">Outro Efeito Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Observações ou Detalhes (Opcional)</label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Indique informações adicionais úteis para a emissão (ex: entidade requerente)..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#10385F]">
                <Clock className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Prazo estimado de emissão</span>
              </div>
              <p>24 a 48 horas úteis após confirmação do emolumento e conferência pedagógica.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A submeter...' : 'Submeter Pedido à Secretaria'}</span>
            </button>
          </form>
        </div>

        {/* Histórico de Pedidos */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Histórico de Declarações</h3>
              <p className="text-[11px] text-slate-400">Acompanhe o estado de processamento dos seus pedidos</p>
            </div>
            <span className="text-xs font-bold text-[#1456A0] bg-blue-50 px-2.5 py-1 rounded-lg">
              {myDeclarations.length} pedidos
            </span>
          </div>

          {myDeclarations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Ainda não efetuou nenhum pedido de declaração.
            </div>
          ) : (
            <div className="space-y-3">
              {myDeclarations.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F]">{item.type}</div>
                      <div className="text-[11px] text-slate-500">
                        Finalidade: <span className="font-medium text-slate-700">{item.purpose}</span> • {item.createdAt}
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  {item.observations && (
                    <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                      &quot;{item.observations}&quot;
                    </div>
                  )}

                  {item.secretaryNote && (
                    <div className="text-[11px] text-[#1456A0] bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                      <span className="font-bold">Despacho da Secretaria:</span> {item.secretaryNote}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-mono">Código: {item.requestCode}</span>
                    {item.issuedDocumentUrl ? (
                      <button
                        onClick={() => setSelectedDoc(item)}
                        className="px-3 py-1 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Documento</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Documento em preparação</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pré-visualização do Documento Emitido */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1456A0] text-white flex items-center justify-center font-bold text-xs">
                  ITPSS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#10385F]">Documento Emitido pela Secretaria</h3>
                  <p className="text-[10px] text-slate-400">Assinatura digital e carimbo institucional</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-4 font-serif">
              <div className="text-center space-y-1">
                <p className="font-bold uppercase tracking-wider text-[11px] text-[#10385F]">REPÚBLICA DE ANGOLA</p>
                <p className="font-bold uppercase tracking-wider text-[11px] text-[#10385F]">GOVERNO DA PROVÍNCIA DO BENGO</p>
                <p className="font-extrabold uppercase text-xs text-[#1456A0]">INSTITUTO TÉCNICO PRIVADO DE SAÚDE SAMIASSO (ITPSS)</p>
                <p className="text-[10px] text-slate-500 font-sans">Decreto Executivo n.º 39/23 • Samias - Panguila, Bengo</p>
              </div>

              <div className="border-t border-b border-slate-200 py-3 text-center">
                <h4 className="font-bold uppercase tracking-widest text-sm text-[#10385F]">{selectedDoc.type}</h4>
              </div>

              <p className="leading-relaxed text-justify text-slate-700">
                Para os devidos efeitos, certifica-se que <strong>{selectedDoc.studentName}</strong>, titular do N.º de Matrícula{' '}
                <strong>{selectedDoc.studentNumber}</strong>, está regularmente matriculado(a) no curso médio técnico de{' '}
                <strong>{selectedDoc.courseName}</strong>, neste Instituto Técnico, para os efeitos de{' '}
                <strong>{selectedDoc.purpose}</strong>.
              </p>

              <div className="pt-6 flex justify-between items-end text-center font-sans text-[10px] text-slate-600">
                <div>
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span>O Chefe da Secretaria</span>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1456A0] flex items-center justify-center text-[9px] font-bold text-[#1456A0] uppercase rotate-12">
                  ITPSS SELO
                </div>
                <div>
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span>A Direção Pedagógica</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#1456A0] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#10385F] transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. COMPONENTE: CADERNETAS
// -------------------------------------------------------------
export const StudentCadernetas: React.FC = () => {
  const { currentStudent, cadernetas, submitCadernetaRequest } = useApp();
  const [type, setType] = useState<'1ª Via (Ingresso)' | '2ª Via (Extravio / Deterioração)'>('1ª Via (Ingresso)');
  const [reason, setReason] = useState('Atribuição Inicial de Início de Ano Letivo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentStudent) return null;

  const myCadernetas = cadernetas.filter((c) => c.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitCadernetaRequest({
        type,
        reason,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Caderneta Escolar do Estudante</h2>
        <p className="text-xs text-slate-500">
          Solicitação de 1.ª via oficial ou emissão de 2.ª via por extravio, perda ou danificação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-orange-50 text-[#F28C28]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Requerer Caderneta</h3>
              <p className="text-[11px] text-slate-400">Documento de registo escolar contínuo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Via Pretendida</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('1ª Via (Ingresso)');
                    setReason('Atribuição Inicial de Início de Ano Letivo');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    type === '1ª Via (Ingresso)'
                      ? 'border-[#1456A0] bg-blue-50 text-[#1456A0]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  1.ª Via (Ingresso)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('2ª Via (Extravio / Deterioração)');
                    setReason('Extravio / Deterioração da caderneta anterior');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    type === '2ª Via (Extravio / Deterioração)'
                      ? 'border-[#F28C28] bg-orange-50 text-[#F28C28]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  2.ª Via (Extravio)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo / Justificação</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500">
              {type === '1ª Via (Ingresso)' ? (
                <p>A 1.ª via é atribuída sem encargos adicionais no início do ciclo formativo.</p>
              ) : (
                <p className="text-amber-700 font-medium">
                  A emissão de 2.ª via está sujeita à taxa de emolumento regulamentar após validação do comprovativo.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A registar pedido...' : 'Enviar Pedido de Caderneta'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Registo de Cadernetas Solicitadas</h3>
              <p className="text-[11px] text-slate-400">Estado de impressão e levantamento na secretaria</p>
            </div>
            <span className="text-xs font-bold text-[#F28C28] bg-orange-50 px-2.5 py-1 rounded-lg">
              {myCadernetas.length} caderneta(s)
            </span>
          </div>

          {myCadernetas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum registo de caderneta encontrado para este número de matrícula.
            </div>
          ) : (
            <div className="space-y-3">
              {myCadernetas.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F] flex items-center gap-2">
                        <span>Caderneta Escolar — {item.type}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-mono">
                          {item.requestCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Motivo: <span className="font-medium text-slate-700">{item.reason}</span> • {item.createdAt}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Concluído' || item.status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Em análise'
                          ? 'bg-blue-100 text-[#1456A0]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.secretaryNote && (
                    <div className="text-[11px] text-[#1456A0] bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                      <span className="font-bold">Observação da Secretaria:</span> {item.secretaryNote}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Estudante: {item.studentName} ({item.studentNumber})</span>
                    <span>Local de levantamento: Secretaria Geral</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. COMPONENTE: CERTIFICADOS
// -------------------------------------------------------------
export const StudentCertificados: React.FC = () => {
  const { currentStudent, certificates, submitCertificateRequest } = useApp();
  const [certType, setCertType] = useState<CertificateType>('Certificado de Habilitações Literárias');
  const [purpose, setPurpose] = useState('Ingresso no Ensino Superior');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentStudent) return null;

  const myCertificates = certificates.filter((c) => c.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitCertificateRequest({
        type: certType,
        purpose,
        observations: observations || undefined,
      });
      setIsSubmitting(false);
      setObservations('');
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Emissão de Certificados e Diplomas</h2>
        <p className="text-xs text-slate-500">
          Requeira Certificados de Habilitações Literárias, Conclusão de Curso Médio e Certidões de Notas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Requerimento de Certificado</h3>
              <p className="text-[11px] text-slate-400">Documento homologado pelo Gabinete Provincial</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Certificado</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Certificado de Habilitações Literárias">Certificado de Habilitações Literárias</option>
                <option value="Certificado de Conclusão de Curso (Técnico Médio)">Certificado de Conclusão de Curso (Técnico Médio)</option>
                <option value="Certidão de Notas Autenticada">Certidão de Notas Autenticada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Finalidade / Destino</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Ex: Ingresso no Ensino Superior, Ministério da Saúde..."
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Adicionais</label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Indique informações complementares se necessário..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A submeter...' : 'Submeter Pedido de Certificado'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Histórico de Certificados</h3>
              <p className="text-[11px] text-slate-400">Processamento e emissão ministerial</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {myCertificates.length} registo(s)
            </span>
          </div>

          {myCertificates.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Ainda não solicitou certificados ou diplomas.
            </div>
          ) : (
            <div className="space-y-3">
              {myCertificates.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F] flex items-center gap-2">
                        <span>{item.type}</span>
                        <span className="font-mono text-[10px] text-slate-400">{item.requestCode}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Finalidade: <span className="font-medium text-slate-700">{item.purpose}</span> • {item.createdAt}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Concluído'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Em análise'
                          ? 'bg-blue-100 text-[#1456A0]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.secretaryNote && (
                    <div className="text-[11px] text-[#1456A0] bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                      <span className="font-bold">Despacho da Secretaria:</span> {item.secretaryNote}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-mono">Processo: {item.requestCode}</span>
                    {item.issuedDocumentUrl ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pronto para levantamento na Secretaria
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Em homologação e aposição de selo branco</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. COMPONENTE: JUSTIFICAÇÃO DE FALTAS
// -------------------------------------------------------------
export const StudentFaltas: React.FC = () => {
  const { currentStudent, absences, submitAbsenceJustification } = useApp();
  const [absenceDate, setAbsenceDate] = useState('2025-05-12');
  const [discipline, setDiscipline] = useState('Anatomia e Fisiologia Humana');
  const [reason, setReason] = useState<AbsenceJustificationRequest['reason']>('Consulta / Motivo Médico');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentStudent) return null;

  const myAbsences = absences.filter((a) => a.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitAbsenceJustification({
        absenceDate,
        discipline,
        reason,
        description,
        attachmentName: fileName || undefined,
        attachmentUrl: fileName ? `/comprovativos/${fileName}` : undefined,
      });
      setIsSubmitting(false);
      setDescription('');
      setFileName('');
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Justificação de Faltas</h2>
        <p className="text-xs text-slate-500">
          Submeta a justificação de ausências a aulas ou estágios clínicos, anexando atestado médico ou documento comprovativo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Justificar Ausência</h3>
              <p className="text-[11px] text-slate-400">Prazo legal de submissão: até 5 dias após a falta</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Falta</label>
              <input
                type="date"
                required
                value={absenceDate}
                onChange={(e) => setAbsenceDate(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Disciplina / Estágio</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Anatomia e Fisiologia Humana">Anatomia e Fisiologia Humana</option>
                <option value="Enfermagem Fundamental">Enfermagem Fundamental</option>
                <option value="Bioquímica Clínica">Bioquímica Clínica</option>
                <option value="Microbiologia e Parasitologia">Microbiologia e Parasitologia</option>
                <option value="Estágio Hospitalar Curricular">Estágio Hospitalar Curricular</option>
                <option value="Todas as Aulas do Dia">Todas as Aulas do Dia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo Justificativo</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Consulta / Motivo Médico">Consulta / Motivo Médico</option>
                <option value="Assunto Familiar Urgente">Assunto Familiar Urgente</option>
                <option value="Compromisso Laboral">Compromisso Laboral</option>
                <option value="Falecimento / Luto">Falecimento / Luto</option>
                <option value="Outro Motivo">Outro Motivo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição Sumária</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva brevemente os factos..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            {/* Simulação de Upload de Atestado */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anexar Documento Comprovativo (Atestado / Declaração)
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-[#1456A0] rounded-xl p-3 text-center transition-colors">
                <input
                  type="file"
                  id="absence-file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="absence-file" className="cursor-pointer block">
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-[#1456A0] block">
                    {fileName ? fileName : 'Clique para selecionar o ficheiro (PDF ou Imagem)'}
                  </span>
                  <span className="text-[10px] text-slate-400">Tamanho máximo: 5 MB</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A submeter...' : 'Submeter Justificação'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Justificações Submetidas</h3>
              <p className="text-[11px] text-slate-400">Acompanhamento e parecer da Direção Pedagógica</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
              {myAbsences.length} falta(s)
            </span>
          </div>

          {myAbsences.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhuma justificação de falta submetida até ao momento.
            </div>
          ) : (
            <div className="space-y-3">
              {myAbsences.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F]">{item.discipline}</div>
                      <div className="text-[11px] text-slate-500">
                        Data da Ausência: <span className="font-semibold text-slate-700">{item.absenceDate}</span> • {item.reason}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejeitado'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status === 'Aprovado' ? 'Deferida' : item.status === 'Rejeitado' ? 'Indeferida' : 'Em Análise'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                    &quot;{item.description}&quot;
                  </p>

                  {item.secretaryNote && (
                    <div className="text-[11px] text-[#1456A0] bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                      <span className="font-bold">Parecer Pedagógico:</span> {item.secretaryNote}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Código: {item.requestCode}</span>
                    {item.attachmentUrl && (
                      <span className="text-blue-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Comprovativo médico anexado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. COMPONENTE: TRANSFERÊNCIAS
// -------------------------------------------------------------
export const StudentTransferencias: React.FC = () => {
  const { currentStudent, transfers, submitTransferRequest } = useApp();
  const [destInstitution, setDestInstitution] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [reason, setReason] = useState('Mudança de Residência Familiar');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentStudent) return null;

  const myTransfers = transfers.filter((t) => t.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitTransferRequest({
        destinationInstitution: `${destInstitution} (${destLocation})`,
        reason,
        observations: observations || undefined,
      });
      setIsSubmitting(false);
      setDestInstitution('');
      setDestLocation('');
      setObservations('');
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Processo de Transferência Escolar</h2>
        <p className="text-xs text-slate-500">
          Solicitação de guia de transferência e certificado de aproveitamento para outro estabelecimento de ensino médio de saúde
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Nova Solicitação de Transferência</h3>
              <p className="text-[11px] text-slate-400">Emissão de Guia Oficial e Histórico de Notas</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instituição de Destino</label>
              <input
                type="text"
                required
                value={destInstitution}
                onChange={(e) => setDestInstitution(e.target.value)}
                placeholder="Ex: Instituto Médio de Saúde de Luanda (IMS)"
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Província / Município de Destino</label>
              <input
                type="text"
                required
                value={destLocation}
                onChange={(e) => setDestLocation(e.target.value)}
                placeholder="Ex: Luanda - Maianga"
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo da Transferência</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Mudança de Residência Familiar">Mudança de Residência Familiar</option>
                <option value="Transferência por Motivos Profissionais">Transferência por Motivos Profissionais / Emprego</option>
                <option value="Incompatibilidade de Horário Laboral">Incompatibilidade de Horário Laboral</option>
                <option value="Outro Motivo Justificado">Outro Motivo Justificado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Observações ou Esclarecimentos</label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Detalhes adicionais..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
              <span className="font-bold block">Aviso Importante:</span>
              <p>A emissão da guia de transferência requer a liquidação integral de todas as propinas e emolumentos devidos.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A enviar pedido...' : 'Submeter Pedido de Transferência'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Processos de Transferência</h3>
              <p className="text-[11px] text-slate-400">Tramitação junto à Direção Pedagógica</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
              {myTransfers.length} processo(s)
            </span>
          </div>

          {myTransfers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum processo de transferência escolar ativo.
            </div>
          ) : (
            <div className="space-y-3">
              {myTransfers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F]">{item.destinationInstitution}</div>
                      <div className="text-[11px] text-slate-500">
                        Motivo: <span className="font-medium text-slate-700">{item.reason}</span> • {item.createdAt}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Concluído'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Em análise'
                          ? 'bg-blue-100 text-[#1456A0]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {item.secretaryNote && (
                    <div className="text-[11px] text-[#1456A0] bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                      <span className="font-bold">Despacho Institucional:</span> {item.secretaryNote}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Código: {item.requestCode}</span>
                    <span>Guia de Transferência e Histórico de Aproveitamento</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. COMPONENTE: EMOLUMENTOS E COMPROVATIVOS
// -------------------------------------------------------------
export const StudentPagamentos: React.FC = () => {
  const { currentStudent, paymentReceipts, submitPaymentReceipt } = useApp();

  const [feeType, setFeeType] = useState<FeeType>('Propinas');
  const [feeMonth, setFeeMonth] = useState('Maio');
  const [amount, setAmount] = useState('25000');
  const [paymentDate, setPaymentDate] = useState('2025-05-12');
  const [bankReference, setBankReference] = useState('');
  const [bankName, setBankName] = useState('BAI');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  if (!currentStudent) return null;

  const myReceipts = paymentReceipts.filter((r) => r.studentId === currentStudent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitPaymentReceipt({
        feeType,
        amountPaid: Number(amount) || 0,
        paymentDate,
        bankReference: bankReference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        observations: feeType === 'Propinas' ? `Propina ref. ao mês de ${feeMonth} (${bankName})` : `Banco: ${bankName}`,
        receiptFileName: selectedFileName || 'comprovativo-bancario.jpg',
        receiptFileUrl: selectedFileName ? `/comprovativos/${selectedFileName}` : '/images/bordereau-sample.jpg',
        receiptFileType: selectedFileName.endsWith('.pdf') ? 'pdf' : 'image',
      });
      setIsSubmitting(false);
      setBankReference('');
      setSelectedFileName('');
    }, 450);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Emolumentos e Submissão de Comprovativos</h2>
        <p className="text-xs text-slate-500">
          Envie o talão ou bordereau bancário de pagamento de propinas, taxas e declarações para conferência manual pela Secretaria
        </p>
      </div>

      {/* Institutional Warning Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-[#1456A0] text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 text-[#1456A0] mt-0.5" />
        <div>
          <span className="font-bold block">Conferência Manual Rigorosa pela Secretaria Geral:</span>
          <span>
            Os pagamentos são validados pelos operadores da Secretaria mediante reconciliação com o extrato bancário oficial do ITPSS.
            Por razões de segurança institucional, não existem cobranças diretas por cartão de crédito na plataforma.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário de Submissão de Comprovativo */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Submeter Comprovativo</h3>
              <p className="text-[11px] text-slate-400">Anexe a foto legível do talão de depósito ou transferência</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Emolumento / Taxa</label>
              <select
                value={feeType}
                onChange={(e) => {
                  const val = e.target.value as FeeType;
                  setFeeType(val);
                  if (val === 'Propinas') setAmount('25000');
                  else if (val === 'Matrículas') setAmount('15000');
                  else if (val === 'Inscrições') setAmount('10000');
                  else if (val === 'Emissão de Declarações') setAmount('3500');
                  else if (val === 'Cadernetas') setAmount('5000');
                  else if (val === 'Certificados') setAmount('8500');
                  else setAmount('5000');
                }}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Propinas">Propina Mensal Escolar</option>
                <option value="Matrículas">Taxa de Matrícula / Confirmação Anual</option>
                <option value="Inscrições">Taxa de Inscrição / Candidatura</option>
                <option value="Emissão de Declarações">Taxa de Emissão de Declaração</option>
                <option value="Cadernetas">Taxa de Emissão de Caderneta (2.ª Via)</option>
                <option value="Certificados">Taxa de Emissão de Certificado / Diploma</option>
                <option value="Outros Emolumentos">Outro Serviço Administrativo</option>
              </select>
            </div>

            {feeType === 'Propinas' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mês de Referência</label>
                <select
                  value={feeMonth}
                  onChange={(e) => setFeeMonth(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  <option value="Janeiro">Janeiro</option>
                  <option value="Fevereiro">Fevereiro</option>
                  <option value="Março">Março</option>
                  <option value="Abril">Abril</option>
                  <option value="Maio">Maio</option>
                  <option value="Junho">Junho</option>
                  <option value="Julho">Julho</option>
                  <option value="Agosto">Agosto</option>
                  <option value="Setembro">Setembro</option>
                  <option value="Outubro">Outubro</option>
                  <option value="Novembro">Novembro</option>
                  <option value="Dezembro">Dezembro</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Pago (Kz)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data do Pagamento</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Banco Utilizado</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full py-2 px-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                >
                  <option value="BAI">Banco BAI</option>
                  <option value="BFA">Banco BFA</option>
                  <option value="BIC">Banco BIC</option>
                  <option value="BPC">Banco BPC</option>
                  <option value="Millennium Atlântico">Millennium Atlântico</option>
                  <option value="Sol">Banco Sol</option>
                  <option value="Multicaixa Express">Multicaixa Express</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">N.º Bordereau / Referência</label>
                <input
                  type="text"
                  required
                  value={bankReference}
                  onChange={(e) => setBankReference(e.target.value)}
                  placeholder="Ex: 94827103"
                  className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                />
              </div>
            </div>

            {/* Simulação de Envio do Comprovativo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ficheiro do Comprovativo (Foto / Digitalização)
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-[#1456A0] rounded-xl p-3 text-center transition-colors">
                <input
                  type="file"
                  id="receipt-file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="receipt-file" className="cursor-pointer block">
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-[#1456A0] block">
                    {selectedFileName ? selectedFileName : 'Carregar Comprovativo Bancário'}
                  </span>
                  <span className="text-[10px] text-slate-400">Suporta JPG, PNG ou PDF</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#1456A0] hover:bg-[#10385F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'A registar comprovativo...' : 'Enviar para Conferência da Secretaria'}</span>
            </button>
          </form>
        </div>

        {/* Lista de Comprovativos Enviados */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-[#10385F]">Comprovativos Submetidos</h3>
              <p className="text-[11px] text-slate-400">Estado da validação bancária</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {myReceipts.length} registo(s)
            </span>
          </div>

          {myReceipts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Ainda não submeteu nenhum comprovativo de pagamento.
            </div>
          ) : (
            <div className="space-y-3">
              {myReceipts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#10385F]">{item.feeType}</div>
                      <div className="text-[11px] text-slate-500">
                        Código: <span className="font-mono text-slate-700 font-bold">{item.receiptCode}</span> • Ref: <span className="font-mono text-slate-700">{item.bankReference}</span> • {item.paymentDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-xs text-[#10385F] font-mono">
                        {item.amountPaid.toLocaleString()} Kz
                      </div>
                      <span
                        className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Validado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejeitado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {item.secretaryNote && (
                    <div
                      className={`text-[11px] p-2 rounded-xl border ${
                        item.status === 'Validado'
                          ? 'text-emerald-800 bg-emerald-50/70 border-emerald-100'
                          : 'text-rose-800 bg-rose-50/70 border-rose-100'
                      }`}
                    >
                      <span className="font-bold">Observação da Secretaria:</span> {item.secretaryNote}
                      {item.validatedBy && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Conferido por: {item.validatedBy} em {item.validatedAt}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">Ficheiro: {item.receiptFileName}</span>
                    <button
                      onClick={() => setSelectedReceipt(item)}
                      className="text-xs font-semibold text-[#1456A0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Ficha do Comprovativo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Ficha do Comprovativo */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-[#10385F]">Ficha de Validação de Comprovativo</h3>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estudante:</span>
                <span className="font-bold text-[#10385F]">{selectedReceipt.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">N.º Matrícula:</span>
                <span className="font-mono text-slate-700">{selectedReceipt.studentNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Emolumento:</span>
                <span className="font-semibold text-slate-700">{selectedReceipt.feeType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Montante Depositado:</span>
                <span className="font-black text-[#1456A0] font-mono">{selectedReceipt.amountPaid.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Código do Pedido:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.receiptCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bordereau / Ref:</span>
                <span className="font-mono font-bold text-slate-800">{selectedReceipt.bankReference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estado Atual:</span>
                <span className="font-bold text-[#10385F]">{selectedReceipt.status}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Comprovativo Digitalizado Anexado:</span>
              <div className="h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-mono">
                [Comprovativo: {selectedReceipt.receiptFileUrl}]
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 7. COMPONENTE: NOTIFICAÇÕES
// -------------------------------------------------------------
export const StudentNotificacoes: React.FC = () => {
  const { currentStudent, notifications, markNotificationAsRead } = useApp();

  if (!currentStudent) return null;

  const myNotifications = notifications.filter(
    (n) => n.recipientId === 'all' || n.recipientId === currentStudent.id
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Notificações do Portal</h2>
          <p className="text-xs text-slate-500">
            Avisos de publicação de notas, despacho de pedidos e validação de pagamentos
          </p>
        </div>
        <span className="text-xs font-bold text-[#1456A0] bg-blue-50 px-3 py-1 rounded-xl">
          {myNotifications.filter((n) => !n.read).length} por ler
        </span>
      </div>

      <div className="space-y-3">
        {myNotifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.read && markNotificationAsRead(n.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              n.read
                ? 'bg-white border-slate-200/80'
                : 'bg-blue-50/40 border-blue-200 shadow-xs ring-1 ring-blue-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    n.type === 'minipauta'
                      ? 'bg-emerald-500'
                      : n.type === 'pedido'
                      ? 'bg-blue-500'
                      : n.type === 'comprovativo'
                      ? 'bg-[#F28C28]'
                      : 'bg-purple-500'
                  }`}
                />
                <h4 className="font-bold text-xs text-[#10385F]">{n.title}</h4>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.createdAt}</span>
            </div>

            <p className="text-xs text-slate-600 mt-2 pl-4 leading-relaxed">{n.message}</p>

            <div className="mt-3 pl-4 flex items-center justify-between text-[11px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {n.type === 'minipauta'
                  ? 'Minipautas'
                  : n.type === 'comprovativo'
                  ? 'Tesouraria'
                  : n.type === 'pedido'
                  ? 'Secretaria Geral'
                  : 'Aviso Institucional'}
              </span>
              {!n.read && (
                <span className="text-xs font-bold text-[#1456A0]">Marcar como lida</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
