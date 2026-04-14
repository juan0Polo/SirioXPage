import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServiciosPage } from './pages/ServiciosPage';
import { BlogPage } from './pages/BlogPage';
import { BlogArticuloPage } from './pages/BlogArticuloPage';
import { TrabajaNosotrosPage } from './pages/TrabajaNosotrosPage';
import { SobreNosotrosPage } from './pages/SobreNosotrosPage';
import { ContactoPage } from './pages/ContactoPage';
import { LoginPage } from './pages/LoginPage';
import { PortalLayout } from './pages/portal/PortalLayout';
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalServicios } from './pages/portal/PortalServicios';
import { PortalBlog } from './pages/portal/PortalBlog';
import { PortalVacantes } from './pages/portal/PortalVacantes';
import { PortalPostulaciones } from './pages/portal/PortalPostulaciones';
import { PortalNotificacionesContacto } from './pages/portal/PortalNotificacionesContacto';
import { PortalContactos } from './pages/portal/PortalContactos';
import { PortalUsuarios } from './pages/portal/PortalUsuarios';
import { PortalCampanasEmail } from './pages/portal/PortalCampanasEmail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/servicios" element={<PublicLayout><ServiciosPage /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogArticuloPage /></PublicLayout>} />
          <Route path="/trabaja-con-nosotros" element={<PublicLayout><TrabajaNosotrosPage /></PublicLayout>} />
          <Route path="/sobre-nosotros" element={<PublicLayout><SobreNosotrosPage /></PublicLayout>} />
          <Route path="/contacto" element={<PublicLayout><ContactoPage /></PublicLayout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/portal" element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
            <Route index element={<PortalDashboard />} />
            <Route path="servicios" element={<PortalServicios />} />
            <Route path="blog" element={<PortalBlog />} />
            <Route path="vacantes" element={<PortalVacantes />} />
            <Route path="postulaciones" element={<PortalPostulaciones />} />
            <Route path="contactos" element={<PortalContactos />} />
            <Route path="notificaciones-contacto" element={<PortalNotificacionesContacto />} />
            <Route path="usuarios" element={<PortalUsuarios />} />
            <Route path="campanas-email" element={<PortalCampanasEmail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
