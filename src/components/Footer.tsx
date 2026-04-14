import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Facebook, Youtube } from 'lucide-react';
import '../styles/footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SIRIO X</h3>
          <p>Soluciones tecnológicas innovadoras para tu empresa.</p>
          <div className="social-links">
            <a href="#" aria-label="LinkedIn">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="GitHub">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Navegación</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/trabaja-con-nosotros">Trabaja con nosotros</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contacto</h4>
          <div className="contact-info">
            <a href="mailto:jppolo@sirio-x.com" className="contact-link">
              <Mail size={16} />
              <span>jppolo@sirio-x.com</span>
            </a>
            <a href="tel:+1234567890" className="contact-link">
              <Phone size={16} />
              <span>+57 3248332777</span>
            </a>
            <div className="contact-link">
              <MapPin size={16} />
              <span>Bogotá, Colombia</span>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4>Suscripción</h4>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tu correo"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 SIRIO X. Todos los derechos reservados.</p>
        {/* <div className="footer-links">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Cookies</a>
        </div> */}
      </div>
    </footer>
  );
}
