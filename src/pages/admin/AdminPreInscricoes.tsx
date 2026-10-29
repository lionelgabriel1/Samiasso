import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Phone,
  PhoneCall,
  User,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { PreEnrollment } from '../../types/index.ts';

export const AdminPreInscricoes: React.FC = () => {
  const { preEnrollments, updatePreEnrollmentStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todas');
  const [selectedRecord, setSelectedRecord] = useState<PreEnrollment | null>(null);

  const filteredRecords = preEnrollments.filter((item) => {
    const matchStatus = statusFilter === 'Todas' || item.status === statusFilter;
    const matchQuery =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const getStatusBadge = (status: PreEnrollment['status']) => {
    switch (status) {
      case 'Pendente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contactado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aprovado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelado':
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">
            Gestão de Pedidos de Matrícula e Pré-Inscrições
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Candidaturas recebidas diretamente a partir do portal público do ITPSS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#10385F] text-white px-3 py-1.5 rounded-xl font-bold">
            Total: {preEnrollments.length}
          </span>
          <span className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-xl font-bold">
            Pendentes: {preEnrollments.filter((p) => p.status === 'Pendente').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por candidato, telefone ou código..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['Todas', 'Pendente', 'Contactado', 'Aprovado', 'Cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'bg-[#1456A0] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Código / Data</th>
                <th className="py-3.5 px-4">Candidato</th>
                <th className="py-3.5 px-4">Telefone</th>
                <th className="py-3.5 px-4">Classe</th>
                <th className="py-3.5 px-4">Curso Pretendido</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum pedido de pré-inscrição encontrado.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#10385F] block">
                        {record.code}
                      </span>
                      <span className="text-[10px] text-slate-400">{record.createdAt}</span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#10385F]">
                      {record.fullName}
                    </td>

                    <td className="py-3.5 px-4">
                      <a
                        href={`tel:${record.phone.replace(/[\s-]/g, '')}`}
                        className="text-[#1456A0] font-medium hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#F28C28]" />
                        <span>{record.phone}</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4 font-medium">{record.classLevel}</td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {record.courseName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          value={record.status}
                          onChange={(e) =>
                            updatePreEnrollmentStatus(
                              record.id,
                              e.target.value as PreEnrollment['status']
                            )
                          }
                          className="py-1 px-2 text-[11px] rounded-lg border border-slate-200 bg-white font-medium text-slate-700 cursor-pointer"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Contactado">Contactado</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>

                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#F28C28] block">
                  {selectedRecord.code}
                </span>
                <h3 className="font-extrabold text-base text-[#10385F]">
                  Ficha do Candidato
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-medium">Nome Completo:</span>
                <span className="text-sm font-bold text-[#10385F] block">{selectedRecord.fullName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Contacto:</span>
                  <span className="font-bold text-[#1456A0]">{selectedRecord.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Classe:</span>
                  <span className="font-bold text-slate-800">{selectedRecord.classLevel}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Curso Pretendido:</span>
                <span className="font-bold text-[#10385F]">{selectedRecord.courseName}</span>
              </div>

              {selectedRecord.message && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Mensagem do Candidato:</span>
                  <p className="text-slate-700 italic mt-0.5">{selectedRecord.message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-[#1456A0] text-white rounded-xl text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
