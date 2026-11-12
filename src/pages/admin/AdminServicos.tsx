import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Award,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Send,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import {
  DeclarationRequest,
  CadernetaRequest,
  CertificateRequest,
  AbsenceJustificationRequest,
  TransferRequest,
  RequestStatus,
} from '../../types/index.ts';

export const AdminServicos: React.FC = () => {
  const {
    adminRoute,
    declarations,
    updateDeclarationStatus,
    cadernetas,
    updateCadernetaStatus,
    certificates,
    updateCertificateStatus,
    absences,
    updateAbsenceStatus,
    transfers,
    updateTransferStatus,
  } = useApp();

  // Internal tab state if user accessed generic or specific route
  const [activeTab, setActiveTab] = useState<
    'declaracoes' | 'cadernetas' | 'certificados' | 'faltas' | 'transferencias'
  >(
    adminRoute === 'declaracoes'
      ? 'declaracoes'
      : adminRoute === 'cadernetas'
      ? 'cadernetas'
      : adminRoute === 'certificados'
      ? 'certificados'
      : adminRoute === 'faltas'
      ? 'faltas'
      : adminRoute === 'transferencias'
      ? 'transferencias'
      : 'declaracoes'
  );

  // Sync tab with adminRoute if changed from menu
  React.useEffect(() => {
    if (['declaracoes', 'cadernetas', 'certificados', 'faltas', 'transferencias'].includes(adminRoute)) {
      setActiveTab(adminRoute as any);
    }
  }, [adminRoute]);

  // Modal State for Action
  const [modalItem, setModalItem] = useState<{
    type: 'declaration' | 'caderneta' | 'certificate' | 'absence' | 'transfer';
    data: any;
  } | null>(null);

  const [modalStatus, setModalStatus] = useState<RequestStatus>('Aprovado');
  const [modalNotes, setModalNotes] = useState('');

  const openActionModal = (type: any, item: any) => {
    setModalItem({ type, data: item });
    setModalStatus(item.status === 'Pendente' ? 'Aprovado' : item.status);
    setModalNotes(item.secretaryNote || '');
  };

  const handleConfirmAction = () => {
    if (!modalItem) return;

    if (modalItem.type === 'declaration') {
      updateDeclarationStatus(
        modalItem.data.id,
        modalStatus,
        modalNotes,
        undefined,
        undefined
      );
    } else if (modalItem.type === 'caderneta') {
      updateCadernetaStatus(modalItem.data.id, modalStatus, modalNotes);
    } else if (modalItem.type === 'certificate') {
      updateCertificateStatus(
        modalItem.data.id,
        modalStatus,
        modalNotes,
        undefined,
        undefined
      );
    } else if (modalItem.type === 'absence') {
      updateAbsenceStatus(modalItem.data.id, modalStatus, modalNotes);
    } else if (modalItem.type === 'transfer') {
      updateTransferStatus(modalItem.data.id, modalStatus, modalNotes);
    }

    setModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão de Serviços Digitais da Secretaria</h2>
          <p className="text-xs text-slate-500">
            Apreciação, despacho e emissão de declarações, cadernetas, certificados, justificação de faltas e transferências
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('declaracoes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'declaracoes'
              ? 'bg-[#1456A0] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Declarações ({declarations.filter((d) => d.status === 'Pendente').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cadernetas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'cadernetas'
              ? 'bg-[#1456A0] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cadernetas ({cadernetas.filter((c) => c.status === 'Pendente').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificados')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'certificados'
              ? 'bg-[#1456A0] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificados ({certificates.filter((c) => c.status === 'Pendente').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faltas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'faltas'
              ? 'bg-[#1456A0] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Justificação de Faltas ({absences.filter((a) => a.status === 'Pendente').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transferencias')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'transferencias'
              ? 'bg-[#1456A0] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Transferências ({transfers.filter((t) => t.status === 'Pendente').length})</span>
        </button>
      </div>

      {/* 1. TAB: DECLARAÇÕES */}
      {activeTab === 'declaracoes' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#10385F]">
              Pedidos de Declaração Submetidos ({declarations.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Tipo de Declaração</th>
                  <th className="py-3 px-4">Finalidade</th>
                  <th className="py-3 px-4">Código / Data</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {declarations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10385F]">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.studentNumber} • {item.courseName}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.type}</td>
                    <td className="py-3 px-4 text-slate-600">{item.purpose}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{item.requestCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Concluído' || item.status === 'Aprovado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Em análise'
                            ? 'bg-blue-100 text-[#1456A0]'
                            : item.status === 'Rejeitado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openActionModal('declaration', item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#1456A0] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Despachar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TAB: CADERNETAS */}
      {activeTab === 'cadernetas' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#10385F]">
              Pedidos de Caderneta Escolar ({cadernetas.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Via Solicitada</th>
                  <th className="py-3 px-4">Motivo</th>
                  <th className="py-3 px-4">Código / Data</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cadernetas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10385F]">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.studentNumber} • {item.courseName}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1456A0]">{item.type}</td>
                    <td className="py-3 px-4 text-slate-600">{item.reason}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{item.requestCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Concluído' || item.status === 'Aprovado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Em análise'
                            ? 'bg-blue-100 text-[#1456A0]'
                            : item.status === 'Rejeitado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openActionModal('caderneta', item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#1456A0] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Despachar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: CERTIFICADOS */}
      {activeTab === 'certificados' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#10385F]">
              Processos de Certificados e Diplomas ({certificates.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Finalidade</th>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10385F]">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.studentNumber} • {item.courseName}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.type}</td>
                    <td className="py-3 px-4 text-slate-600">{item.purpose}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.requestCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Concluído'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Em análise'
                            ? 'bg-blue-100 text-[#1456A0]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openActionModal('certificate', item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#1456A0] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Despachar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: FALTAS */}
      {activeTab === 'faltas' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#10385F]">
              Justificações de Ausências Submetidas ({absences.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Disciplina</th>
                  <th className="py-3 px-4">Data da Falta</th>
                  <th className="py-3 px-4">Motivo / Descrição</th>
                  <th className="py-3 px-4">Anexo</th>
                  <th className="py-3 px-4">Decisão</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absences.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10385F]">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.studentNumber} • {item.courseName}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{item.discipline}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{item.absenceDate}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-700">{item.reason}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      {item.attachmentUrl ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1456A0] border border-blue-200">
                          Atestado Anexo
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Sem anexo</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Aprovado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejeitado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'Aprovado' ? 'Deferida' : item.status === 'Rejeitado' ? 'Indeferida' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openActionModal('absence', item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#1456A0] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Avaliar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB: TRANSFERÊNCIAS */}
      {activeTab === 'transferencias' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-xs text-[#10385F]">
              Processos de Transferência Escolar ({transfers.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3 px-4">Estudante</th>
                  <th className="py-3 px-4">Instituição de Destino</th>
                  <th className="py-3 px-4">Motivo</th>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#10385F]">{item.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.studentNumber} • {item.currentCourse}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#10385F]">{item.destinationInstitution}</td>
                    <td className="py-3 px-4 text-slate-600">{item.reason}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{item.requestCode}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Concluído'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Em análise'
                            ? 'bg-blue-100 text-[#1456A0]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openActionModal('transfer', item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-[#1456A0] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Despachar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTION MODAL FOR DISPATCH / REVIEW */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalItem(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#10385F]">
                Despacho da Secretaria — Código: {modalItem.data.requestCode}
              </h3>
              <button onClick={() => setModalItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Estudante:</span>{' '}
                <strong className="text-[#10385F]">{modalItem.data.studentName}</strong> ({modalItem.data.studentNumber})
              </div>
              <div>
                <span className="text-slate-500">Curso:</span> {modalItem.data.courseName || modalItem.data.currentCourse}
              </div>
              {modalItem.data.type && (
                <div>
                  <span className="text-slate-500">Documento / Serviço:</span> {modalItem.data.type}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Decisão / Novo Estado</label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value as RequestStatus)}
                className="w-full py-2.5 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              >
                <option value="Em análise">Em Análise / Tramitação</option>
                <option value="Aprovado">Aprovado / Deferido</option>
                <option value="Concluído">Concluído (Documento Pronto)</option>
                <option value="Rejeitado">Indeferido / Rejeitado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parecer / Observação da Secretaria (Visível ao Aluno)
              </label>
              <textarea
                rows={3}
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                placeholder="Indique os motivos do despacho ou instruções para levantamento presencial..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Gravar Despacho e Notificar Aluno</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
