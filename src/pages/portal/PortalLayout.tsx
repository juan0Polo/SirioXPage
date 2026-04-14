import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, BookOpen, Briefcase, Users, FileText, Mail, MessageSquare, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/portal', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin', 'editor', 'rrhh'] },
  { path: '/portal/servicios', label: 'Servicios', icon: <Layers size={18} />, roles: ['admin', 'editor'] },
  { path: '/portal/blog', label: 'Blog', icon: <BookOpen size={18} />, roles: ['admin', 'editor'] },
  { path: '/portal/vacantes', label: 'Vacantes', icon: <Briefcase size={18} />, roles: ['admin', 'rrhh'] },
  { path: '/portal/postulaciones', label: 'Postulaciones', icon: <FileText size={18} />, roles: ['admin', 'rrhh'] },
  { path: '/portal/contactos', label: 'Contactos', icon: <MessageSquare size={18} />, roles: ['admin'] },
  { path: '/portal/notificaciones-contacto', label: 'Notificaciones', icon: <Mail size={18} />, roles: ['admin'] },
  { path: '/portal/campanas-email', label: 'Campañas Email', icon: <Mail size={18} />, roles: ['admin'] },
  { path: '/portal/usuarios', label: 'Usuarios', icon: <Users size={18} />, roles: ['admin'] },
];

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const allowedItems = NAV_ITEMS.filter(item =>
    user ? item.roles.includes(user.rol) : false
  );

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const isActive = (path: string) => {
    if (path === '/portal') return location.pathname === '/portal';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="portal-layout">
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <Link to="/" className="sidebar-logo">
              <div className="sidebar-logo-icon">S</div>
              <span>SIRIO X</span>
            </Link>
          )}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {allowedItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
              {sidebarOpen && isActive(item.path) && <ChevronRight size={14} className="sidebar-arrow" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && user && (
            <div className="sidebar-user">
              <div className="user-avatar">{user.nombre?.[0] || user.email[0].toUpperCase()}</div>
              <div className="user-info">
                <strong>{user.nombre || user.email}</strong>
                <span className={`role-badge ${user.rol}`}>{user.rol}</span>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-header">
          <div className="portal-breadcrumb">
            <span>Portal de administración</span>
          </div>
          <div className="portal-header-actions">
            <Link to="/" className="view-site-btn" target="_blank">
              Ver sitio
            </Link>
          </div>
        </header>
        <div className="portal-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .portal-layout {
          display: flex; min-height: 100vh;
          background: var(--color-gray-100);
          font-family: var(--font-family-sans);
        }
        .portal-sidebar {
          display: flex; flex-direction: column;
          background: var(--color-midnight-navy);
          transition: width var(--transition-normal);
          flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .portal-sidebar.open { width: 260px; }
        .portal-sidebar.closed { width: 64px; }

        .sidebar-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--spacing-md); border-bottom: 1px solid rgba(255,255,255,0.08);
          min-height: 64px;
        }
        .sidebar-logo { display: flex; align-items: center; gap: var(--spacing-sm); text-decoration: none; }
        .sidebar-logo-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light));
          border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: var(--font-size-base);
        }
        .sidebar-logo span { color: white; font-weight: var(--font-weight-bold); font-size: var(--font-size-lg); white-space: nowrap; }
        .sidebar-toggle { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.6); padding: 4px; border-radius: var(--radius-sm); transition: color var(--transition-fast); }
        .sidebar-toggle:hover { color: white; }

        .sidebar-nav { flex: 1; padding: var(--spacing-md) 0; display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link {
          display: flex; align-items: center; gap: var(--spacing-sm);
          padding: 10px var(--spacing-md); color: rgba(255,255,255,0.6);
          text-decoration: none; border-radius: var(--radius-md);
          margin: 0 var(--spacing-sm); transition: all var(--transition-fast);
          font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
          white-space: nowrap; position: relative;
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.08); color: white; }
        .sidebar-link.active { background: var(--color-orbit-blue); color: white; }
        .sidebar-arrow { margin-left: auto; flex-shrink: 0; }

        .sidebar-footer { padding: var(--spacing-md); border-top: 1px solid rgba(255,255,255,0.08); }
        .sidebar-user { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); }
        .user-avatar { width: 36px; height: 36px; flex-shrink: 0; background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: var(--font-size-sm); }
        .user-info { overflow: hidden; }
        .user-info strong { display: block; color: white; font-size: var(--font-size-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .role-badge { display: inline-block; font-size: 10px; font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 6px; border-radius: 100px; }
        .role-badge.admin { background: rgba(109,180,242,0.2); color: var(--color-sirius-light); }
        .role-badge.editor { background: rgba(251,191,36,0.2); color: #FBB924; }
        .role-badge.rrhh { background: rgba(52,211,153,0.2); color: #34D399; }

        .logout-btn { display: flex; align-items: center; gap: var(--spacing-sm); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.5); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); padding: 8px var(--spacing-sm); border-radius: var(--radius-sm); width: 100%; transition: all var(--transition-fast); }
        .logout-btn:hover { color: #FC8181; background: rgba(252,129,129,0.1); }

        .portal-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .portal-header { background: white; border-bottom: 1px solid var(--color-gray-200); padding: 0 var(--spacing-xl); height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .portal-breadcrumb { color: var(--color-gray-500); font-size: var(--font-size-sm); }
        .view-site-btn { font-size: var(--font-size-sm); color: var(--color-orbit-blue); font-weight: var(--font-weight-semibold); text-decoration: none; padding: 6px 12px; border: 1px solid var(--color-orbit-blue); border-radius: var(--radius-md); transition: all var(--transition-fast); }
        .view-site-btn:hover { background: var(--color-orbit-blue); color: white; }
        .portal-content { padding: var(--spacing-xl); }

        @media (max-width: 768px) {
          .portal-sidebar.open { width: 240px; position: fixed; z-index: 1000; height: 100vh; }
        }
      `}</style>
    </div>
  );
}
