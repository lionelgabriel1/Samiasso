import React, { useState } from 'react';
import { Users, Search, Filter, Edit3, Award, GraduationCap, CheckCircle2, ChevronRight, X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Student } from '../../types/index.ts';
import { calculateOverallAverage, determineAcademicStatus } from '../../utils/academic.ts';

export const AdminAlunos: React.FC = () => {
  const { students, courses, updateStudentGrade, setAdminRoute } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Todos');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Grade edit states
  const [gradeChanges, setGradeChanges] = useState<{
    disciplineId: string;
    periodo1: number;
    periodo2: number;
    periodo3: number;
  } | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchCourse = selectedCourse === 'Todos' || s.courseId === selectedCourse;
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.classId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCourse && matchQuery;
  });

  const handleOpenGrades = (student: Student) => {
    setEditingStudent(student);
  };

  const handleSaveGrades = (disciplineId: string, p1: number, p2: number, p3: number) => {
    if (!editingStudent) return;
    updateStudentGrade(editingStudent.id, disciplineId, {
      periodo1: Number(p1),
      periodo2: Number(p2),
      periodo3: Number(p3),
    });
    // refresh local editing student
    const updated = students.find((s) => s.id === editingStudent.id);
    if (updated) {
      setEditingStudent(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão de Alunos e Pautas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta de fichas de estudantes, assiduidade e lançamento de notas com recálculo automático
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome ou n.º de matrícula..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="Todos">Todos os Cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">N.º Matrícula</th>
                <th className="py-3.5 px-4">Nome do Aluno</th>
                <th className="py-3.5 px-4">Curso</th>
                <th className="py-3.5 px-4">Turma / Ano</th>
                <th className="py-3.5 px-4">Média Atual</th>
                <th className="py-3.5 px-4">Assiduidade</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1456A0]">
                    {student.studentNumber}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#10385F]">
                    {student.name}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {student.courseName}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{student.classId}</span>
                    <span className="text-[10px] text-slate-400 block">{student.academicYear}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`font-black text-sm ${
                        student.overallAverage >= 9.5
                          ? 'text-emerald-600'
                          : student.overallAverage >= 7.0
                          ? 'text-[#F28C28]'
                          : 'text-rose-600'
                      }`}
                    >
                      {student.overallAverage.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {determineAcademicStatus(student.overallAverage)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {student.attendanceRate}%
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenGrades(student)}
                      className="px-3 py-1.5 bg-[#1456A0] hover:bg-[#10385F] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Lançar / Ver Notas</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Management Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-[#1456A0]">
                  {editingStudent.studentNumber}
                </span>
                <h3 className="text-xl font-black text-[#10385F]">
                  Pauta Trimestral: {editingStudent.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingStudent.courseName} • Turma {editingStudent.classId}
                </p>
              </div>

              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Overall calculated average badge */}
            <div className="p-4 bg-blue-50 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-[#1456A0] font-bold block">
                  Média Global Recalculada
                </span>
                <span className="text-2xl font-black text-[#10385F]">
                  {editingStudent.overallAverage.toFixed(1)}{' '}
                  <span className="text-xs font-semibold text-slate-500">Valores</span>
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    editingStudent.overallAverage >= 9.5
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {determineAcademicStatus(editingStudent.overallAverage)}
                </span>
              </div>
            </div>

            {/* Disciplines Grade Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Notas por Disciplina (Escala 0 a 20)
              </h4>

              <div className="space-y-3">
                {editingStudent.disciplines.map((disc) => {
                  const avg = (
                    (disc.grades.periodo1 + disc.grades.periodo2 + disc.grades.periodo3) /
                    3
                  ).toFixed(1);

                  return (
                    <div
                      key={disc.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h5 className="font-bold text-xs text-[#10385F]">{disc.name}</h5>
                        {disc.teacher && (
                          <span className="text-[10px] text-slate-400">{disc.teacher}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block text-center">1º P</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            defaultValue={disc.grades.periodo1}
                            id={`p1-${disc.id}`}
                            className="w-12 text-center py-1 text-xs font-bold border rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block text-center">2º P</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            defaultValue={disc.grades.periodo2}
                            id={`p2-${disc.id}`}
                            className="w-12 text-center py-1 text-xs font-bold border rounded-lg bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block text-center">3º P</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            defaultValue={disc.grades.periodo3}
                            id={`p3-${disc.id}`}
                            className="w-12 text-center py-1 text-xs font-bold border rounded-lg bg-white"
                          />
                        </div>

                        <div className="pl-2">
                          <label className="text-[10px] text-slate-400 block text-center">Média</label>
                          <span className="text-xs font-black text-[#1456A0] px-2 py-1 bg-white rounded-lg border block text-center">
                            {avg}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const p1 = (document.getElementById(`p1-${disc.id}`) as HTMLInputElement)?.value;
                            const p2 = (document.getElementById(`p2-${disc.id}`) as HTMLInputElement)?.value;
                            const p3 = (document.getElementById(`p3-${disc.id}`) as HTMLInputElement)?.value;
                            handleSaveGrades(disc.id, Number(p1), Number(p2), Number(p3));
                          }}
                          className="p-1.5 bg-[#1456A0] hover:bg-[#10385F] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer mt-3"
                          title="Gravar nota desta disciplina"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Alterações sincronizadas com o Portal do Aluno
              </span>
              <button
                onClick={() => setEditingStudent(null)}
                className="px-5 py-2.5 bg-[#10385F] text-white text-xs font-bold rounded-xl"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
