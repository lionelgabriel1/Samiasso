import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Send, CheckCircle2, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INSTITUTION_INFO } from '../../data/initialData.ts';

export const ContactosPage: React.FC = () => {
  const { setPublicRoute, showToast } = useApp();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) {
      showToast('Por favor preencha todos os campos do formulário.', 'error');
      return;
    }
    setIsSent(true);
    showToast('Mensagem enviada com sucesso! A nossa secretaria responderá em breve.');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Header */}
      <div className="relative bg-[#10385F] text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/medical-staff.jpg"
            alt="Contactos ITPSS"
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
            <span className="text-[#F28C28] font-semibold">Contactos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
            Contactos
          </h1>
          <p className="text-base text-slate-200 max-w-xl">
            Estamos sempre disponíveis para ajudar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contacts & Text Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xs border border-slate-200/80 space-y-6">
              <h2 className="text-xl font-extrabold text-[#10385F]">
                Informações de contacto
              </h2>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#F28C28] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Linhas Telefónicas
                  </span>
                  <div className="space-y-1 mt-1 text-sm font-bold text-[#10385F]">
                    <a
                      href={`tel:${INSTITUTION_INFO.phone1Raw}`}
                      className="block hover:text-[#1456A0] transition-colors"
                    >
                      {INSTITUTION_INFO.phone1}
                    </a>
                    <a
                      href={`tel:${INSTITUTION_INFO.phone2Raw}`}
                      className="block hover:text-[#1456A0] transition-colors"
                    >
                      {INSTITUTION_INFO.phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* Text Location */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#1456A0] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Localização Oficial
                  </span>
                  <p className="text-sm font-semibold text-slate-700 mt-1 leading-snug">
                    {INSTITUTION_INFO.locationText}
                  </p>
                  <span className="text-xs text-slate-400 block mt-1">Luena • Província do Moxico • Angola</span>
                </div>
              </div>

              {/* WhatsApp direct buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Fale connosco no WhatsApp
                </span>

                <a
                  href={`https://wa.me/${INSTITUTION_INFO.phone1Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    {INSTITUTION_INFO.phone1}
                  </span>
                  <span className="text-[11px] text-emerald-700">Conversar →</span>
                </a>

                <a
                  href={`https://wa.me/${INSTITUTION_INFO.phone2Raw}?text=Olá,%20gostaria%20de%20informações%20sobre%20as%20matrículas%20no%20ITPSS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    {INSTITUTION_INFO.phone2}
                  </span>
                  <span className="text-[11px] text-emerald-700">Conversar →</span>
                </a>
              </div>
            </div>

            {/* School Campus Photo Frame */}
            <div className="rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 bg-white p-2">
              <img
                src="/images/campus-drone.jpg"
                alt="Instalações no Bairro Social"
                className="w-full h-44 object-cover rounded-2xl"
              />
              <p className="text-[11px] text-slate-500 text-center py-2 font-medium">
                Edifício escolar do ITPSS no Luena, Moxico
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-slate-200/80">
              <h2 className="text-2xl font-black text-[#10385F] mb-1">
                Envie uma mensagem
              </h2>
              <p className="text-slate-500 text-xs mb-8">
                Preencha o formulário abaixo e entraremos em contacto com a maior brevidade.
              </p>

              {isSent ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-black text-[#10385F]">
                    Mensagem Recebida com Sucesso!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto">
                    Agradecemos o seu contacto. A equipa de atendimento responderá brevemente.
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      setName('');
                      setContact('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 bg-[#1456A0] hover:bg-[#10385F] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Introduza o seu nome"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email ou telefone *
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Ex: +244 9... ou o seu email"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escreva a sua dúvida, pedido de esclarecimento ou informação sobre matrículas..."
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1456A0]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#F28C28] hover:bg-[#e07b16] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar mensagem</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
