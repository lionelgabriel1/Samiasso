import React from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext.tsx';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    courses,
    preEnrollments,
    pautasGerais,
    minipautas,
    declarations,
    cadernetas,
    certificates,
    absences,
    transfers,
    paymentReceipts,
    setAdminRoute,
  } = useApp();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalCourses = courses.length;
  const totalPreEnrollments = preEnrollments.length;

  const pendingServicesCount =
    declarations.filter((d) => d.status === 'Pendente').length +
    cadernetas.filter((c) => c.status === 'Pendente').length +
    certificates.filter((c) => c.status === 'Pendente').length +
    absences.filter((a) => a.status === 'Pendente').length +
    transfers.filter((t) => t.status === 'Pendente').length;

  const pendingReceiptsCount = paymentReceipts.filter((r) => r.status === 'Aguardando validação').length;
  const publishedMinipautasCount = minipautas.filter((m) => m.published).length;
  const publishedPautasCount = pautasGerais.filter((p) => p.published).length;

  // 1. Line Chart Data: Evolução das Matrículas (Jan - Dez)
  const enrollmentEvolutionData = [
    { month: 'Jan', matriculas: 5 },
    { month: 'Fev', matriculas: 12 },
    { month: 'Mar', matriculas: 18 },
    { month: 'Abr', matriculas: 22 },
    { month: 'Mai', matriculas: 29 },
    { month: 'Jun', matriculas: 25 },
    { month: 'Jul', matriculas: 19 },
    { month: 'Ago', matriculas: 24 },
    { month: 'Set', matriculas: 28 },
    { month: 'Out', matriculas: 31 },
    { month: 'Nov', matriculas: 20 },
    { month: 'Dez', matriculas: 15 },
  ];

  // 2. Pie Chart Data: Distribuição por Curso matching mockup percentages
  const courseDistributionData = [
    { name: 'Enfermagem Geral', value: 42, color: '#1456A0' },
    { name: 'Análises Clínicas', value: 34, color: '#F28C28' },
    { name: 'Cardiopneumologia', value: 24, color: '#38bdf8' },
  ];

  // 3. Bar Chart Data: Resultados por Período
  const periodResultsData = [
    { period: '1º Período', aprovados: 78, exame: 15, reprovados: 7 },
    { period: '2º Período', aprovados: 82, exame: 12, reprovados: 6 },
    { period: '3º Período', aprovados: 88, exame: 8, reprovados: 4 },
  ];

  // 4. Progress data: Assiduidade por Turma matching mockup
  const classAttendanceData = [
    { className: '10º A', rate: 92 },
    { className: '10º B', rate: 88 },
    { className: '11º A', rate: 85 },
    { className: '11º B', rate: 90 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bem-vindo ao painel administrativo e pedagógico do ITPSS
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAdminRoute('pautas-gerais')}
            className="px-3.5 py-2 bg-[#10385F] hover:bg-[#1456A0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Pautas Gerais ({publishedPautasCount} publicadas)</span>
          </button>

          <button
            onClick={() => setAdminRoute('minipautas')}
            className="px-3.5 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Minipautas ({publishedMinipautasCount} publicadas)</span>
          </button>

          <button
            onClick={() => setAdminRoute('comprovativos')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Validar Comprovativos ({pendingReceiptsCount})</span>
          </button>

          <button
            onClick={() => setAdminRoute('declaracoes')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Serviços Digitais ({pendingServicesCount})</span>
          </button>

          <button
            onClick={() => setAdminRoute('matriculas')}
            className="px-3.5 py-2 bg-[#F28C28] hover:bg-[#e07b16] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Pré-Inscrições ({preEnrollments.length})</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards matching mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total de Alunos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total de alunos</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#1456A0]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{totalStudents}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            +8% este trimestre
          </span>
        </div>

        {/* Docentes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Docentes</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{totalTeachers}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Corpo clínico ativo</span>
        </div>

        {/* Turmas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Turmas</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{totalClasses}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">10ª e 11ª classes</span>
        </div>

        {/* Cursos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Cursos</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-[#F28C28]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#10385F]">{totalCourses}</div>
          <span className="text-[10px] text-[#1456A0] font-bold mt-1 block">
            Especializações saúde
          </span>
        </div>

        {/* Pedidos de matrícula */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pedidos de matrículas</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-[#10385F]">{totalPreEnrollments}</div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              Novas
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {preEnrollments.filter((p) => p.status === 'Pendente').length} pendentes de contacto
          </span>
        </div>
      </div>

      {/* Row 1 Charts: Evolução das Matrículas & Distribuição por Curso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#10385F]">Evolução das matrículas</h3>
              <p className="text-xs text-slate-400">Distribuição mensal ao longo do ano letivo</p>
            </div>
            <span className="text-xs font-bold text-[#1456A0] bg-blue-50 px-2.5 py-1 rounded-lg">
              Pico: 29 em Maio
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#10385F',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="matriculas"
                  name="Matrículas"
                  stroke="#1456A0"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#F28C28', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Distribuição por curso */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#10385F]">Distribuição por curso</h3>
            <p className="text-xs text-slate-400">Percentagem de alunos matriculados</p>
          </div>

          <div className="h-56 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {courseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Percentagem']}
                  contentStyle={{
                    backgroundColor: '#10385F',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-xl font-black text-[#10385F] block">{totalStudents}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">alunos</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {courseDistributionData.map((course) => (
              <div key={course.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: course.color }} />
                  <span className="text-slate-600 font-medium">{course.name}</span>
                </div>
                <span className="font-bold text-[#10385F]">{course.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Resultados por Período & Assiduidade por Turma */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Resultados por Período */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#10385F]">Resultados por período</h3>
              <p className="text-xs text-slate-400">Rendimento académico trimestral</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodResultsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{
                    backgroundColor: '#10385F',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="aprovados" name="Aprovados" fill="#1456A0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exame" name="Em exame" fill="#F28C28" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reprovados" name="Reprovados" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Bars: Assiduidade por Turma */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#10385F]">Assiduidade por turma</h3>
            <p className="text-xs text-slate-400">Taxa de presença às aulas e estágios</p>
          </div>

          <div className="space-y-4 my-auto py-4">
            {classAttendanceData.map((item) => (
              <div key={item.className} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#10385F]">{item.className}</span>
                  <span className="font-extrabold text-[#1456A0]">{item.rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1456A0] to-[#38bdf8] rounded-full transition-all duration-500"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Média geral do Instituto: <strong className="text-emerald-600">89%</strong></span>
            <span className="text-[11px] text-slate-400">Meta: &gt;85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
