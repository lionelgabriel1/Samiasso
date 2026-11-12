import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Plus,
  Edit2,
  Key,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole } from '../../types/index.ts';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Ativo' | 'Inativo';
  lastAccess: string;
}

export const AdminUtilizadores: React.FC = () => {
  const { students } = useApp();

  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Initial user list combining management and sample students
  const [userList, setUserList] = useState<ManagedUser[]>([
    {
      id: 'usr-admin-1',
      name: 'Direção Geral ITPSS',
      email: 'admin@itpss.ao',
      role: 'admin',
      status: 'Ativo',
      lastAccess: 'Hoje às 09:14',
    },
    {
      id: 'usr-sec-1',
      name: 'Secretaria Geral Pedagógica',
      email: 'secretaria@itpss.ao',
      role: 'secretaria',
      status: 'Ativo',
      lastAccess: 'Hoje às 10:20',
    },
    {
      id: 'usr-sec-2',
      name: 'Atendimento e Tesouraria',
      email: 'tesouraria@itpss.ao',
      role: 'secretaria',
      status: 'Ativo',
      lastAccess: 'Ontem às 16:45',
    },
    {
      id: 'usr-stu-1',
      name: 'Ana Paula Silva',
      email: 'ana.silva@aluno.itpss.ao',
      role: 'student',
      status: 'Ativo',
      lastAccess: 'Hoje às 08:30',
    },
    {
      id: 'usr-stu-2',
      name: 'Carlos Manuel Bengo',
      email: 'carlos.bengo@aluno.itpss.ao',
      role: 'student',
      status: 'Ativo',
      lastAccess: '10/05/2025',
    },
    {
      id: 'usr-stu-3',
      name: 'Esperança Domingos',
      email: 'esperanca.domingos@aluno.itpss.ao',
      role: 'student',
      status: 'Ativo',
      lastAccess: '08/05/2025',
    },
  ]);

  const filteredUsers = userList.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
            <ShieldCheck className="w-3 h-3" />
            Administrador
          </span>
        );
      case 'secretaria':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1456A0] flex items-center gap-1 w-max">
            <Briefcase className="w-3 h-3" />
            Secretaria Escolar
          </span>
        );
      case 'student':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
            <GraduationCap className="w-3 h-3" />
            Estudante
          </span>
        );
      default:
        return <span className="text-slate-400 text-xs">Convidado</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão de Utilizadores e Acessos</h2>
          <p className="text-xs text-slate-500">
            Controlo de perfis, permissões e contas de Administradores, Secretaria Escolar e Alunos
          </p>
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
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          >
            <option value="all">Todos os Perfis ({userList.length})</option>
            <option value="admin">Administradores</option>
            <option value="secretaria">Secretaria Escolar</option>
            <option value="student">Estudantes</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">Utilizador</th>
                <th className="py-3.5 px-4">E-mail Institucional</th>
                <th className="py-3.5 px-4">Perfil de Acesso</th>
                <th className="py-3.5 px-4">Último Acesso</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#10385F]">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{user.lastAccess}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] font-semibold text-slate-400">Ativo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
