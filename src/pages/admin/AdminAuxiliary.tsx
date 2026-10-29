import React from 'react';
import { Users, Calendar, Clock, Settings, Shield, MapPin, Phone, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';

export const AdminDocentes: React.FC = () => {
  const { teachers } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Corpo Docente</h2>
          <p className="text-xs text-slate-500">Professores e instrutores clínicos credenciados no ITPSS</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <th className="py-3.5 px-4">Docente</th>
              <th className="py-3.5 px-4">Disciplina Principal</th>
              <th className="py-3.5 px-4">Contacto</th>
              <th className="py-3.5 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-[#10385F]">{teacher.name}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-700">{teacher.subject}</td>
                <td className="py-3.5 px-4 text-[#1456A0]">{teacher.phone}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {teacher.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminTurmas: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Turmas e Salas de Aula</h2>
        <p className="text-xs text-slate-500">Distribuição letiva do ano 2026 por classes e turnos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: '10.ª Classe A', course: 'Enfermagem Geral', shift: 'Manhã', students: 34, room: 'Sala 12' },
          { name: '10.ª Classe B', course: 'Análises Clínicas', shift: 'Manhã', students: 32, room: 'Laboratório 01' },
          { name: '11.ª Classe A', course: 'Cardiopneumologia', shift: 'Tarde', students: 28, room: 'Sala 08' },
          { name: '11.ª Classe B', course: 'Enfermagem Geral', shift: 'Tarde', students: 30, room: 'Sala 09' },
        ].map((cls, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1456A0] bg-blue-50 px-2 py-0.5 rounded">
                {cls.shift}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{cls.room}</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#10385F]">{cls.name}</h3>
              <p className="text-xs text-slate-500">{cls.course}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total inscritos:</span>
              <span className="font-black text-[#10385F]">{cls.students} alunos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminConfiguracoes: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-black text-[#10385F]">Configurações da Instituição</h2>
        <p className="text-xs text-slate-500">Dados oficiais e credenciamento oficial do ITPSS</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#1456A0] text-white flex items-center justify-center font-bold">
            ITPSS
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#10385F]">{INSTITUTION_INFO.name}</h3>
            <span className="text-xs text-slate-400">Licença Oficial: {INSTITUTION_INFO.license}</span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 block mb-1">Localização Oficial</label>
            <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-700">
              {INSTITUTION_INFO.locationText}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-400 block mb-1">Telefone Principal</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-[#1456A0]">
                {INSTITUTION_INFO.phone1}
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-400 block mb-1">Telefone Secundário</label>
              <div className="p-3 bg-slate-50 rounded-xl font-bold text-[#1456A0]">
                {INSTITUTION_INFO.phone2}
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Sistema parametrizado de acordo com as normas pedagógicas oficiais em Angola.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
