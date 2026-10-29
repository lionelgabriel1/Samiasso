import React, { useState } from 'react';
import { BookOpen, Edit2, Check, X, CreditCard, AlertCircle, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Course, PaymentItem } from '../../types/index.ts';
import { formatKwanza } from '../../utils/academic.ts';

export const AdminCursos: React.FC = () => {
  const { courses, updateCourse, paymentItems, updatePaymentItem } = useApp();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentItem | null>(null);

  const [feeInput, setFeeInput] = useState<number>(0);
  const [descInput, setDescInput] = useState<string>('');
  const [focusInput, setFocusInput] = useState<string>('');

  const [paymentPriceInput, setPaymentPriceInput] = useState<number>(0);

  const startEditCourse = (c: Course) => {
    setEditingCourse(c);
    setFeeInput(c.monthlyFee);
    setDescInput(c.description);
    setFocusInput(c.practicalFocus);
  };

  const saveCourse = () => {
    if (!editingCourse) return;
    updateCourse({
      ...editingCourse,
      monthlyFee: Number(feeInput),
      description: descInput,
      practicalFocus: focusInput,
    });
    setEditingCourse(null);
  };

  const startEditPayment = (p: PaymentItem) => {
    setEditingPayment(p);
    setPaymentPriceInput(p.price);
  };

  const savePayment = () => {
    if (!editingPayment) return;
    updatePaymentItem({
      ...editingPayment,
      price: Number(paymentPriceInput),
    });
    setEditingPayment(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#10385F]">Gestão de Cursos e Emolumentos</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atualize mensalidades e informações oficiais. As alterações refletem-se instantaneamente no website público.
          </p>
        </div>
      </div>

      {/* Course Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-[#10385F]">
                Editar Curso: {editingCourse.name}
              </h3>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mensalidade Oficial (em Kwanzas) *
              </label>
              <input
                type="number"
                value={feeInput}
                onChange={(e) => setFeeInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Valor formatado: <strong>{formatKwanza(feeInput)}/mês</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrição Curta
              </label>
              <textarea
                rows={2}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Foco Prático e Laboratorial
              </label>
              <textarea
                rows={2}
                value={focusInput}
                onChange={(e) => setFocusInput(e.target.value)}
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={saveCourse}
                className="px-5 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#F28C28] bg-orange-50 px-2.5 py-1 rounded-md">
                  Técnico de Saúde
                </span>
                <button
                  onClick={() => startEditCourse(course)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#1456A0] hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Editar curso"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#10385F]">{course.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Mensalidade no Site
                </span>
                <span className="text-xl font-black text-[#1456A0]">
                  {formatKwanza(course.monthlyFee)}
                  <span className="text-xs font-normal text-slate-400">/mês</span>
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Classes: 10ª e 11ª</span>
              <button
                onClick={() => startEditCourse(course)}
                className="font-bold text-[#1456A0] hover:underline cursor-pointer"
              >
                Editar Preço →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Outros Valores Section */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-[#10385F]">Outros Valores e Emolumentos</h3>
          <p className="text-xs text-slate-500">Valores de bata, cartão de estudante e ficha de inscrição</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-[#10385F]">{item.name}</h4>
                <div className="text-lg font-black text-[#1456A0] mt-0.5">
                  {formatKwanza(item.price)}
                </div>
                <span className="text-[10px] text-slate-500">{item.frequency}</span>
              </div>

              <button
                onClick={() => startEditPayment(item)}
                className="p-2 rounded-xl bg-white text-slate-600 hover:text-[#1456A0] shadow-2xs hover:shadow cursor-pointer"
                title="Editar valor"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#10385F]">
              Editar Valor: {editingPayment.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Novo Preço (em Kwanzas, 0 para Grátis)
              </label>
              <input
                type="number"
                value={paymentPriceInput}
                onChange={(e) => setPaymentPriceInput(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Exibição: <strong>{formatKwanza(paymentPriceInput)}</strong>
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingPayment(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={savePayment}
                className="px-4 py-2 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
