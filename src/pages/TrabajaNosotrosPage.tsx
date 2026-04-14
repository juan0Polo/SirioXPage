import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Monitor, Users, X, Upload, CheckCircle, Briefcase } from 'lucide-react';
import { api } from '../lib/api';
import { Vacante } from '../types';

const VACANTES_MOCK: Vacante[] = [
  { id: '1', titulo: 'Desarrollador Full Stack Senior', area: 'Ingeniería', modalidad: 'hibrido', ubicacion: 'Ciudad de México', descripcion: 'Buscamos un desarrollador senior con experiencia en React, Node.js y PostgreSQL para liderar proyectos tecnológicos de alto impacto.', requisitos: '5+ años de experiencia, dominio de React y Node.js, experiencia con bases de datos relacionales.', activa: true, created_by: '', created_at: '2026-04-01', updated_at: '' },
  { id: '2', titulo: 'UX/UI Designer', area: 'Diseño', modalidad: 'remoto', ubicacion: 'Remoto', descripcion: 'Diseñador apasionado por crear experiencias digitales memorables. Trabajarás con equipos multidisciplinarios en proyectos B2B innovadores.', requisitos: '3+ años en diseño de productos digitales, dominio de Figma, portafolio requerido.', activa: true, created_by: '', created_at: '2026-04-02', updated_at: '' },
  { id: '3', titulo: 'DevOps Engineer', area: 'Infraestructura', modalidad: 'hibrido', ubicacion: 'Bogotá', descripcion: 'Ingeniero DevOps para gestionar y optimizar nuestra infraestructura en la nube, pipelines CI/CD y seguridad de sistemas.', requisitos: 'Experiencia con AWS/GCP, Docker, Kubernetes y herramientas de CI/CD.', activa: true, created_by: '', created_at: '2026-04-03', updated_at: '' },
];

const MODALIDAD_LABELS = {
  remoto: { label: 'Remoto', color: '#059669' },
  presencial: { label: 'Presencial', color: '#2563EB' },
  hibrido: { label: 'Híbrido', color: '#D97706' },
};

export function TrabajaNosotrosPage() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [selected, setSelected] = useState<Vacante | null>(null);
  const [previewVacante, setPreviewVacante] = useState<Vacante | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVacantes();
  }, []);

  async function fetchVacantes() {
    try {
      const data = await api.vacantes.listPublic();
      setVacantes(data && data.length > 0 ? data as Vacante[] : VACANTES_MOCK);
    } catch {
      setVacantes(VACANTES_MOCK);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      if (cvFile) {
        const payload = new FormData();
        payload.append('vacante_id', selected.id);
        payload.append('nombre', formData.nombre);
        payload.append('email', formData.email);
        payload.append('telefono', formData.telefono);
        payload.append('mensaje', formData.mensaje);
        payload.append('cv', cvFile);
        await api.postulaciones.create(payload);
      } else {
        await api.postulaciones.create({
          vacante_id: selected.id,
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: formData.mensaje,
        });
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function openPostulacion(v: Vacante) {
    setSelected(v);
    setShowForm(true);
    setPreviewVacante(null);
    setSubmitted(false);
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
    setCvFile(null);
  }

  function truncate(text: string, length: number) {
    if (!text) return '';
    return text.length <= length ? text : `${text.slice(0, length).trim()}...`;
  }

  return (
    <div className="page">
      <section className="trabaja-hero">
        <div className="hero-overlay" />
        <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Equipo" />
        <div className="container hero-content-trabaja">
          <h1>Únete a nuestro equipo</h1>
          <p>En SIRIO X creemos que las mejores soluciones las construyen equipos diversos, apasionados y con libertad para innovar.</p>
          <div className="valores-trabaja">
            <div className="valor-pill"><Monitor size={16} /> Trabajo flexible</div>
            <div className="valor-pill"><Users size={16} /> Equipo colaborativo</div>
            <div className="valor-pill"><Briefcase size={16} /> Proyectos desafiantes</div>
          </div>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <span className="section-tag">Oportunidades</span>
            <h2>Vacantes activas</h2>
            <p style={{ color: 'var(--color-gray-500)' }}>Encuentra tu próximo reto profesional</p>
          </div>

          {loading ? (
            <div className="loading-state">Cargando vacantes...</div>
          ) : vacantes.length === 0 ? (
            <div className="sin-vacantes">
              <Briefcase size={48} />
              <h3>No tenemos vacantes abiertas en este momento</h3>
              <p>Pero siempre estamos buscando talento. ¡Envíanos tu hoja de vida!</p>
              <button className="btn btn-primary" onClick={() => { setSelected(null); setShowForm(true); setSubmitted(false); }}>
                Enviar CV espontáneo
              </button>
            </div>
          ) : (
            <div className="vacantes-list">
              {vacantes.map(v => {
                const mod = MODALIDAD_LABELS[v.modalidad];
                return (
                  <div key={v.id} className="vacante-card">
                    <div className="vacante-header">
                      <div>
                        <h3>{v.titulo}</h3>
                        <div className="vacante-meta">
                          <span className="meta-tag area-tag">{v.area}</span>
                          <span className="meta-tag" style={{ color: mod.color, background: `${mod.color}20` }}>
                            <Monitor size={12} /> {mod.label}
                          </span>
                          <span className="meta-tag">
                            <MapPin size={12} /> {v.ubicacion}
                          </span>
                        </div>
                      </div>
                      <div className="vacante-actions">
                        <button className="btn btn-secondary" onClick={() => setPreviewVacante(v)}>
                          Ver detalles
                        </button>
                        <button className="btn btn-primary" onClick={() => openPostulacion(v)}>
                          Postularme
                        </button>
                      </div>
                    </div>
                    <p className="vacante-summary">{truncate(v.descripcion, 120)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {previewVacante && (
        <div className="modal-overlay" onClick={() => setPreviewVacante(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPreviewVacante(null)}><X size={20} /></button>
            <h2>{previewVacante.titulo}</h2>
            <div className="vacante-meta" style={{ marginBottom: 'var(--spacing-md)' }}>
              <span className="meta-tag area-tag">{previewVacante.area}</span>
              <span className="meta-tag" style={{ color: MODALIDAD_LABELS[previewVacante.modalidad].color, background: `${MODALIDAD_LABELS[previewVacante.modalidad].color}20` }}>
                <Monitor size={12} /> {MODALIDAD_LABELS[previewVacante.modalidad].label}
              </span>
              <span className="meta-tag"><MapPin size={12} /> {previewVacante.ubicacion}</span>
            </div>
            <p className="vacante-desc">{previewVacante.descripcion}</p>
            {previewVacante.requisitos && (
              <div className="vacante-req"><strong>Requisitos</strong><p>{previewVacante.requisitos}</p></div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setPreviewVacante(null)}>Cerrar</button>
              <button className="btn btn-primary" onClick={() => { openPostulacion(previewVacante); }}>
                Postularme
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            {submitted ? (
              <div className="success-state">
                <CheckCircle size={56} className="success-icon" />
                <h3>¡Postulación enviada!</h3>
                <p>Hemos recibido tu información. Nuestro equipo de RRHH revisará tu perfil y se pondrá en contacto contigo.</p>
                <button className="btn btn-primary" onClick={() => setShowForm(false)}>Cerrar</button>
              </div>
            ) : (
              <>
                <h2>{selected ? `Postularme a: ${selected.titulo}` : 'Enviar hoja de vida'}</h2>
                <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-lg)' }}>
                  Completa el formulario y nos pondremos en contacto contigo.
                </p>
                <form onSubmit={handleSubmit} className="form">
                  <div className="form-group">
                    <label>Nombre completo *</label>
                    <input type="text" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} placeholder="Tu nombre" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="tu@email.com" />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input type="tel" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} placeholder="+1 234 567 890" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>CV (PDF) *</label>
                    <div className="file-upload">
                      <Upload size={20} />
                      <span>Arrastra tu CV aquí o haz clic para seleccionar</span>
                      <input type="file" accept=".pdf" required onChange={e => setCvFile(e.target.files?.[0] || null)} />
                    </div>
                    {cvFile && <p className="file-name">Archivo seleccionado: {cvFile.name}</p>}
                  </div>
                  <div className="form-group">
                    <label>Mensaje (opcional)</label>
                    <textarea rows={3} value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} placeholder="Cuéntanos por qué eres la persona ideal para este rol..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar postulación'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .trabaja-hero {
          position: relative; height: 480px;
          display: flex; align-items: center;
          overflow: hidden;
        }
        .trabaja-hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(7,21,38,0.85), rgba(21,50,89,0.75)); z-index: 1; }
        .hero-content-trabaja { position: relative; z-index: 2; color: white; }
        .hero-content-trabaja h1 { color: white; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: var(--spacing-md); }
        .hero-content-trabaja p { font-size: var(--font-size-lg); color: rgba(255,255,255,0.8); max-width: 600px; margin-bottom: var(--spacing-lg); }
        .valores-trabaja { display: flex; gap: var(--spacing-md); flex-wrap: wrap; }
        .valor-pill {
          display: flex; align-items: center; gap: var(--spacing-sm);
          background: rgba(109,180,242,0.15); border: 1px solid rgba(109,180,242,0.3);
          color: var(--color-sirius-light); padding: 8px 16px; border-radius: 100px;
          font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
        }

        .section-tag { display: inline-block; color: var(--color-orbit-blue); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--spacing-sm); }

        .page-content { padding: var(--spacing-3xl) 0; }
        .vacantes-list { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .vacante-card {
          background: white; border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl); padding: var(--spacing-xl);
          transition: all var(--transition-normal);
        }
        .vacante-card:hover { border-color: var(--color-sirius-light); box-shadow: var(--shadow-lg); }
        .vacante-header { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--spacing-lg); margin-bottom: var(--spacing-md); flex-wrap: wrap; }
        .vacante-header h3 { font-size: var(--font-size-xl); color: var(--color-midnight-navy); margin-bottom: var(--spacing-sm); }
        .vacante-meta { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; }
        .meta-tag {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 10px; border-radius: 100px;
          font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
        }
        .area-tag { background: rgba(55,114,166,0.1); color: var(--color-orbit-blue); }
        .meta-tag:not(.area-tag) { background: rgba(0,0,0,0.05); color: var(--color-gray-600); }
        .vacante-actions { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; align-items: center; }
        .vacante-summary { color: var(--color-gray-500); margin-bottom: var(--spacing-md); line-height: var(--line-height-relaxed); }
        .vacante-desc, .vacante-req p { color: var(--color-gray-500); margin-bottom: var(--spacing-sm); line-height: var(--line-height-relaxed); white-space: pre-wrap; }
        .vacante-req { font-size: var(--font-size-sm); color: var(--color-gray-500); }
        .modal-actions { display: flex; gap: var(--spacing-sm); justify-content: flex-end; margin-top: var(--spacing-lg); }

        .sin-vacantes { text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-400); }
        .sin-vacantes svg { margin: 0 auto var(--spacing-md); opacity: 0.3; }
        .sin-vacantes h3 { color: var(--color-gray-600); margin-bottom: var(--spacing-sm); }
        .sin-vacantes p { margin-bottom: var(--spacing-lg); }
        .loading-state { text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-500); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(7,21,38,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: var(--spacing-md); backdrop-filter: blur(4px); }
        .modal { background: white; border-radius: var(--radius-xl); padding: var(--spacing-2xl); max-width: 560px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto; }
        .modal-close { position: absolute; top: var(--spacing-md); right: var(--spacing-md); background: var(--color-gray-100); border: none; cursor: pointer; border-radius: var(--radius-md); padding: var(--spacing-xs); color: var(--color-gray-600); }
        .modal-close:hover { background: var(--color-gray-200); }
        .modal h2 { margin-bottom: var(--spacing-sm); font-size: var(--font-size-2xl); }

        .form { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
        .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
        .form-group label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-midnight-navy); }
        .form-group input, .form-group textarea {
          padding: var(--spacing-sm); border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md); font-size: var(--font-size-base);
          outline: none; transition: border-color var(--transition-fast);
          font-family: var(--font-family-sans);
        }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--color-orbit-blue); }
        .file-upload {
          display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm);
          padding: var(--spacing-lg); border: 2px dashed var(--color-gray-200);
          border-radius: var(--radius-md); cursor: pointer; position: relative;
          color: var(--color-gray-400); transition: all var(--transition-fast);
        }
        .file-upload:hover { border-color: var(--color-orbit-blue); color: var(--color-orbit-blue); }
        .file-upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .file-upload span { font-size: var(--font-size-sm); text-align: center; }

        .success-state { text-align: center; padding: var(--spacing-lg); }
        .success-icon { color: #059669; margin: 0 auto var(--spacing-md); }
        .success-state h3 { margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .success-state p { color: var(--color-gray-500); margin-bottom: var(--spacing-lg); }

        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } .vacante-header { flex-direction: column; } }
      `}</style>
    </div>
  );
}
