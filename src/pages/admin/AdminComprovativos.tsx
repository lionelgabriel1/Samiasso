import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Check,
  X,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  Building,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { PaymentReceipt, PaymentReceiptStatus } from '../../types/index.ts';

export const AdminComprovativos: React.FC = () => {
  const { paymentReceipts, validatePaymentReceipt, currentUser } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected receipt for validation modal
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [validationDecision, setValidationDecision] = useState<PaymentReceiptStatus>('Validado');
  const [validationNote, setValidationNote] = useState('');

  // Filtered receipts
  const filteredReceipts = paymentReceipts.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bankReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receiptCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = paymentReceipts.filter((r) => r.status === 'Aguardando validação').length;
  const validatedCount = paymentReceipts.filter((r) => r.status === 'Validado').length;
  const rejectedCount = paymentReceipts.filter((r) => r.status === 'Rejeitado').length;

  const totalValidatedKz = paymentReceipts
    .filter((r) => r.status === 'Validado')
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const openValidationModal = (receipt: PaymentReceipt, defaultStatus: PaymentReceiptStatus = 'Validado') => {
    setSelectedReceipt(receipt);
    setValidationDecision(defaultStatus);
    setValidationNote(
      defaultStatus === 'Validado'
        ? 'Comprovativo conferido pela Secretaria durante a demonstração.'
        : 'Comprovativo ilegível ou dados insuficientes para validação.'
    );
  };

  const handleConfirmValidation = () => {
    if (!selectedReceipt) return;
    validatePaymentReceipt(selectedReceipt.id, validationDecision, validationNote);
    setSelectedReceipt(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Receção e Validação de Comprovativos</h2>
          <p className="text-xs text-slate-500">
            Conferência de depósitos, transferências e pagamentos de propinas e emolumentos da Secretaria
          </p>
        </div>

        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Validação Manual</span>
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Aguardando Validação</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{pendingCount}</div>
          <span className="text-[10px] text-amber-700 font-bold mt-1 block">Atenção requerida</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Comprovativos Validados</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{validatedCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Conferência bancária OK</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Rejeitados / Devolvidos</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{rejectedCount}</div>
          <span className="text-[10px] text-rose-600 font-bold mt-1 block">Notificados para regularizar</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Validado (Kz)</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#1456A0]">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#1456A0] font-mono">
            {totalValidatedKz.toLocaleString()} Kz
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Entrada em caixa conferida</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar aluno, matrícula ou ref..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          >
            <option value="all">Todos os Estados ({paymentReceipts.length})</option>
            <option value="Aguardando validação">Apenas Pendentes ({pendingCount})</option>
            <option value="Validado">Apenas Validados ({validatedCount})</option>
            <option value="Rejeitado">Apenas Rejeitados ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Estudante</th>
                <th className="py-3.5 px-4">Emolumento</th>
                <th className="py-3.5 px-4">Montante</th>
                <th className="py-3.5 px-4">Código / Ref</th>
                <th className="py-3.5 px-4">Data Pagamento</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#10385F]">{item.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {item.studentNumber}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">{item.feeType}</td>

                  <td className="py-3.5 px-4 font-black font-mono text-[#10385F]">
                    {item.amountPaid.toLocaleString()} Kz
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 font-bold">{item.receiptCode}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Ref: {item.bankReference}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{item.paymentDate}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Validado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Rejeitado'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openValidationModal(item, 'Validado')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Validar Comprovativo"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Validar</span>
                      </button>

                      <button
                        onClick={() => openValidationModal(item, 'Rejeitado')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title="Rejeitar Comprovativo"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Rejeitar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VALIDATION DECISION MODAL */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1456A0]" />
                <h3 className="font-bold text-base text-[#10385F]">
                  Conferência de Comprovativo Bancário — {selectedReceipt.receiptCode}
                </h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">Estudante Requerente</span>
                  <span className="font-bold text-[#10385F]">{selectedReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">N.º de Matrícula</span>
                  <span className="font-mono font-bold text-slate-700">{selectedReceipt.studentNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Emolumento / Serviço</span>
                  <span className="font-semibold text-slate-700">{selectedReceipt.feeType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Montante Declarado</span>
                  <span className="font-mono font-black text-emerald-700 text-sm">
                    {selectedReceipt.amountPaid.toLocaleString()} Kz
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Ficheiro Anexado</span>
                  <span className="font-medium text-slate-700">{selectedReceipt.receiptFileName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">N.º Bordereau / Referência</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReceipt.bankReference}</span>
                </div>
              </div>
            </div>

            {/* Document preview simulation */}
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500">
              <span className="font-semibold text-[#10385F] block mb-1">
                Ficheiro Digitalizado do Comprovativo
              </span>
              <div className="min-h-28 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                {selectedReceipt.receiptFileType === 'image' ? (
                  <img src={selectedReceipt.receiptFileUrl} alt="Comprovativo enviado pelo estudante" className="max-h-72 w-full object-contain" />
                ) : (
                  <iframe src={selectedReceipt.receiptFileUrl} title="Comprovativo PDF" className="w-full h-72" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parecer da Secretaria</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValidationDecision('Validado');
                    setValidationNote('Comprovativo conferido pela Secretaria durante a demonstração.');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    validationDecision === 'Validado'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Validar e Confirmar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setValidationDecision('Rejeitado');
                    setValidationNote('Bordereau ilegível ou referência bancária não localizada.');
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    validationDecision === 'Rejeitado'
                      ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Rejeitar Comprovativo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observação Registada pela Secretaria (Visível no Portal do Estudante)
              </label>
              <textarea
                rows={2}
                value={validationNote}
                onChange={(e) => setValidationNote(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-200"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmValidation}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Validação e Notificar Aluno</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
