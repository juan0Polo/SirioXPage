import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Linkedin, Twitter, Github, Facebook, Youtube } from 'lucide-react';
import { api } from '../lib/api';

export function ContactoPage() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.contactos.create({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || null,
        mensaje: formData.mensaje,
      });
      setSubmitted(true);
    } catch {
      setError('Ocurrió un error al enviar el mensaje. Por favor intenta de nuevo.');
    }
    setSubmitting(false);
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Contáctanos</h1>
          <p>¿Tienes un proyecto en mente? Cuéntanos. Estamos listos para ayudarte a hacerlo realidad.</p>
        </div>
      </section>

      <section className="contacto-section">
        <div className="container">
          <div className="contacto-grid">
            <div className="contacto-info">
              <h2>Hablemos</h2>
              <p>Agenda una llamada, envíanos un mensaje o visítanos. Respondemos en menos de 24 horas en días hábiles.</p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon"><Mail size={20} /></div>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:jppolo@sirio-x.com">jppolo@sirio-x.com</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Phone size={20} /></div>
                  <div>
                    <strong>Teléfono</strong>
                    <a href="tel:+573248332777">+57 3248332777</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><MapPin size={20} /></div>
                  <div>
                    <strong>Oficina principal</strong>
                    <span>Calle 114a No. 78 - 21<br />Bogotá DC, Colombia</span>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <p>Síguenos en redes sociales</p>
                <div className="social-icons">
                  <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                  <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
                </div>
              </div>

              {/* <div className="mapa-placeholder">
                <MapPin size={32} />
                <span>Ciudad de México, México</span>
              </div> */}
            </div>

            <div className="contacto-form-wrap">
              {submitted ? (
                <div className="success-card">
                  <CheckCircle size={56} className="success-icon" />
                  <h3>¡Mensaje enviado!</h3>
                  <p>Gracias por contactarnos. Nuestro equipo revisará tu mensaje y te responderá en menos de 24 horas.</p>
                  <button className="btn btn-primary" onClick={() => { setSubmitted(false); setFormData({ nombre: '', email: '', telefono: '', mensaje: '' }); }}>
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <>
                  <h3>Envíanos un mensaje</h3>
                  <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Tu nombre" />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="tu@email.com" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Teléfono (opcional)</label>
                      <input type="tel" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} placeholder="+1 234 567 890" />
                    </div>
                    <div className="form-group">
                      <label>Mensaje *</label>
                      <textarea rows={5} required value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} placeholder="Cuéntanos sobre tu proyecto, necesidades o preguntas..." />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                      {submitting ? 'Enviando...' : <><Send size={18} /> Enviar mensaje</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .page-hero { background: linear-gradient(135deg, var(--color-midnight-navy), var(--color-stellar-blue)); padding: var(--spacing-3xl) 0 var(--spacing-2xl); color: white; }
        .page-hero h1 { color: white; margin-bottom: var(--spacing-sm); }
        .page-hero p { color: rgba(255,255,255,0.75); font-size: var(--font-size-lg); }

        .contacto-section { padding: var(--spacing-3xl) 0; }
        .contacto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); }
        .contacto-info h2 { margin-bottom: var(--spacing-md); }
        .contacto-info > p { color: var(--color-gray-500); margin-bottom: var(--spacing-xl); line-height: var(--line-height-relaxed); }

        .info-items { display: flex; flex-direction: column; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl); }
        .info-item { display: flex; align-items: flex-start; gap: var(--spacing-md); }
        .info-icon { width: 44px; height: 44px; background: linear-gradient(135deg, rgba(55,114,166,0.1), rgba(109,180,242,0.15)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-orbit-blue); flex-shrink: 0; }
        .info-item strong { display: block; color: var(--color-midnight-navy); font-size: var(--font-size-sm); margin-bottom: 2px; }
        .info-item a, .info-item span { color: var(--color-gray-500); font-size: var(--font-size-sm); line-height: 1.6; }
        .info-item a:hover { color: var(--color-orbit-blue); }

        .social-section p { font-size: var(--font-size-sm); color: var(--color-gray-400); margin-bottom: var(--spacing-sm); }
        .social-icons { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
        .social-icons a { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--color-gray-100); border-radius: var(--radius-md); color: var(--color-gray-600); transition: all var(--transition-fast); }
        .social-icons a:hover { background: var(--color-orbit-blue); color: white; }

        .mapa-placeholder { background: var(--color-gray-100); border-radius: var(--radius-xl); height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--spacing-sm); color: var(--color-gray-400); border: 2px dashed var(--color-gray-200); }

        .contacto-form-wrap { background: white; border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); padding: var(--spacing-2xl); box-shadow: var(--shadow-lg); }
        .contacto-form-wrap h3 { margin-bottom: var(--spacing-lg); font-size: var(--font-size-2xl); }

        .form { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
        .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
        .form-group label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-midnight-navy); }
        .form-group input, .form-group textarea { padding: var(--spacing-sm); border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--font-size-base); outline: none; transition: border-color var(--transition-fast); font-family: var(--font-family-sans); resize: vertical; }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--color-orbit-blue); }
        .error-msg { background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius-md); padding: var(--spacing-sm); color: #DC2626; font-size: var(--font-size-sm); }

        .success-card { text-align: center; padding: var(--spacing-xl); }
        .success-icon { color: #059669; margin: 0 auto var(--spacing-md); }
        .success-card h3 { margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .success-card p { color: var(--color-gray-500); margin-bottom: var(--spacing-xl); }

        @media (max-width: 768px) { .contacto-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
