import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/header.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">S</div>
          <span className="logo-text">SIRIO X</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/servicios"
            className={`nav-link ${isActive('/servicios') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Servicios
          </Link>
          <Link
            to="/blog"
            className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/trabaja-con-nosotros"
            className={`nav-link ${isActive('/trabaja-con-nosotros') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Trabaja con nosotros
          </Link>
          <Link
            to="/sobre-nosotros"
            className={`nav-link ${isActive('/sobre-nosotros') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            className={`nav-link ${isActive('/contacto') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </Link>
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Ingresar
            </Link>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
