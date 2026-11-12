/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { Lightbox } from './components/common/Lightbox.tsx';
import { Toast } from './components/common/Toast.tsx';
import { AuthModal } from './components/common/AuthModal.tsx';
import { DemoPresentationBar } from './components/common/DemoPresentationBar.tsx';

// Public Pages
import { HomePage } from './pages/public/HomePage.tsx';
import { SobrePage } from './pages/public/SobrePage.tsx';
import { CursosPage } from './pages/public/CursosPage.tsx';
import { MatriculasPage } from './pages/public/MatriculasPage.tsx';
import { NoticiasPage } from './pages/public/NoticiasPage.tsx';
import { GaleriaPage } from './pages/public/GaleriaPage.tsx';
import { ContactosPage } from './pages/public/ContactosPage.tsx';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout.tsx';
import { AdminMinipautas } from './pages/admin/AdminMinipautas.tsx';
import { AdminServicos } from './pages/admin/AdminServicos.tsx';
import { AdminComprovativos } from './pages/admin/AdminComprovativos.tsx';
import { AdminUtilizadores } from './pages/admin/AdminUtilizadores.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminCursos } from './pages/admin/AdminCursos.tsx';
import { AdminPreInscricoes } from './pages/admin/AdminPreInscricoes.tsx';
import { AdminAlunos } from './pages/admin/AdminAlunos.tsx';
import { AdminNoticias } from './pages/admin/AdminNoticias.tsx';
import { AdminGaleria } from './pages/admin/AdminGaleria.tsx';
import { AdminDocentes, AdminTurmas, AdminConfiguracoes, AdminResultados, AdminAssiduidade } from './pages/admin/AdminAuxiliary.tsx';

// Student Pages
import { StudentLayout } from './pages/student/StudentLayout.tsx';
import { StudentDashboard } from './pages/student/StudentDashboard.tsx';
import { StudentResultados } from './pages/student/StudentResultados.tsx';
import { StudentDeclaracoes, StudentCadernetas, StudentCertificados, StudentFaltas, StudentTransferencias, StudentPagamentos, StudentNotificacoes } from './pages/student/StudentServicos.tsx';
import {
  StudentHorario,
  StudentAssiduidade,
  StudentComunicados,
  StudentPerfil,
} from './pages/student/StudentAuxiliary.tsx';

const AppContent: React.FC = () => {
  const { activeSection, publicRoute, adminRoute, studentRoute } = useApp();

  // Render Admin Section
  if (activeSection === 'admin') {
    return (
      <AdminLayout>
        <div key={adminRoute} className="animate-fade-in">
          {adminRoute === 'dashboard' && <AdminDashboard />}
          {adminRoute === 'cursos' && <AdminCursos />}
          {adminRoute === 'matriculas' && <AdminPreInscricoes />}
          {adminRoute === 'alunos' && <AdminAlunos />}
          {adminRoute === 'resultados' && <AdminResultados />}
          {adminRoute === 'assiduidade' && <AdminAssiduidade />}
          {adminRoute === 'noticias' && <AdminNoticias />}
          {adminRoute === 'galeria' && <AdminGaleria />}
          {adminRoute === 'docentes' && <AdminDocentes />}
          {adminRoute === 'turmas' && <AdminTurmas />}
          {adminRoute === 'configuracoes' && <AdminConfiguracoes />}
          {adminRoute === 'minipautas' && <AdminMinipautas />}
          {adminRoute === 'comprovativos' && <AdminComprovativos />}
          {['declaracoes', 'cadernetas', 'certificados', 'faltas', 'transferencias'].includes(adminRoute) && <AdminServicos />}
          {adminRoute === 'utilizadores' && <AdminUtilizadores />}
        </div>
      </AdminLayout>
    );
  }

  // Render Student Section
  if (activeSection === 'student') {
    return (
      <StudentLayout>
        <div key={studentRoute} className="animate-fade-in">
          {studentRoute === 'visao-geral' && <StudentDashboard />}
          {studentRoute === 'resultados' && <StudentResultados />}
          {studentRoute === 'horario' && <StudentHorario />}
          {studentRoute === 'assiduidade' && <StudentAssiduidade />}
          {studentRoute === 'comunicados' && <StudentComunicados />}
          {studentRoute === 'perfil' && <StudentPerfil />}
          {studentRoute === 'pedidos' && <StudentDeclaracoes />}
          {studentRoute === 'cadernetas' && <StudentCadernetas />}
          {studentRoute === 'certificados' && <StudentCertificados />}
          {studentRoute === 'faltas' && <StudentFaltas />}
          {studentRoute === 'transferencias' && <StudentTransferencias />}
          {studentRoute === 'pagamentos' && <StudentPagamentos />}
          {studentRoute === 'notificacoes' && <StudentNotificacoes />}
        </div>
      </StudentLayout>
    );
  }

  // Default: Public Portal
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-[#10385F]">
      <Header />
      <main className="flex-1">
        <div key={publicRoute} className="animate-fade-in">
          {publicRoute === 'home' && <HomePage />}
          {publicRoute === 'sobre' && <SobrePage />}
          {publicRoute === 'cursos' && <CursosPage />}
          {publicRoute === 'matriculas' && <MatriculasPage />}
          {publicRoute === 'noticias' && <NoticiasPage />}
          {publicRoute === 'galeria' && <GaleriaPage />}
          {publicRoute === 'contactos' && <ContactosPage />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DemoPresentationBar />
      <AppContent />
      <Lightbox />
      <AuthModal />
      <Toast />
    </AppProvider>
  );
}
