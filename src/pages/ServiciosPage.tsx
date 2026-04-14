import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Code, Globe, Database, Shield, Smartphone, BarChart } from 'lucide-react';
import { api } from '../lib/api';
import { Servicio } from '../types';

const ICONS = [Code, Globe, Database, Shield, Smartphone, BarChart];

const SERVICIOS_MOCK: Servicio[] = [
  { id: '1', titulo: 'Desarrollo Web', descripcion: 'Plataformas web modernas y escalables con las últimas tecnologías.', descripcion_larga: 'Desarrollamos aplicaciones web completas utilizando frameworks modernos como React, Angular y Vue. Nuestro equipo crea soluciones escalables, seguras y con una experiencia de usuario excepcional.', icono_url: '', activo: true, orden: 1, created_at: '', updated_at: '' },
  { id: '2', titulo: 'Software Empresarial', descripcion: 'Sistemas ERP, CRM y herramientas de gestión a medida para tu empresa.', descripcion_larga: 'Diseñamos e implementamos sistemas empresariales personalizados que optimizan tus procesos internos, mejoran la productividad y reducen costos operativos significativamente.', icono_url: '', activo: true, orden: 2, created_at: '', updated_at: '' },
  { id: '3', titulo: 'API e Integraciones', descripcion: 'Conectamos tus sistemas y aplicaciones con APIs robustas y seguras.', descripcion_larga: 'Desarrollamos APIs RESTful y GraphQL, e integramos servicios de terceros para crear ecosistemas tecnológicos conectados y eficientes.', icono_url: '', activo: true, orden: 3, created_at: '', updated_at: '' },
  { id: '4', titulo: 'Aplicaciones Móviles', descripcion: 'Apps iOS y Android con diseño nativo y performance óptima.', descripcion_larga: 'Creamos aplicaciones móviles nativas e híbridas con React Native y Flutter que ofrecen experiencias fluidas y engagement excepcional para tus usuarios.', icono_url: '', activo: true, orden: 4, created_at: '', updated_at: '' },
  { id: '5', titulo: 'Ciberseguridad', descripcion: 'Protegemos tus sistemas con auditorías, pentesting y soluciones de seguridad.', descripcion_larga: 'Ofrecemos servicios completos de ciberseguridad: auditorías de seguridad, pruebas de penetración, implementación de protocolos de seguridad y capacitación de equipos.', icono_url: '', activo: true, orden: 5, created_at: '', updated_at: '' },
  { id: '6', titulo: 'Analítica de Datos', descripcion: 'Dashboards e inteligencia de negocios para decisiones basadas en datos.', descripcion_larga: 'Transformamos tus datos en insights accionables mediante dashboards interactivos, reportes automatizados y modelos de machine learning aplicados a tu negocio.', icono_url: '', activo: true, orden: 6, created_at: '', updated_at: '' },
];

export function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selected, setSelected] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicios();
  }, []);

  async function fetchServicios() {
    try {
      const data = await api.servicios.listPublic();
      setServicios(data && data.length > 0 ? data as Servicio[] : SERVICIOS_MOCK);
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setServicios(SERVICIOS_MOCK);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <ChevronRight size={14} />
            <span>Servicios</span>
          </nav>
          <h1>Nuestros servicios</h1>
          <p>Soluciones tecnológicas completas para cada etapa de tu transformación digital.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">Cargando servicios...</div>
          ) : (
            <div className="servicios-grid">
              {servicios.map((s, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <div key={s.id} className="card service-card">
                    <div className="card-icon">
                      <Icon size={28} />
                    </div>
                    <h3>{s.titulo}</h3>
                    <p>{s.descripcion}</p>
                    <button className="btn-ver-mas" onClick={() => setSelected(s)}>
                      Ver más <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="page-cta-bottom">
        <div className="container">
          <div className="cta-bottom-content">
            <h3>¿No encuentras lo que buscas?</h3>
            <p>Cuéntanos tu proyecto y diseñamos una solución a medida para ti.</p>
            <Link to="/contacto" className="btn btn-primary">
              Contáctanos <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Code size={32} />
            </div>
            <h2>{selected.titulo}</h2>
            <p className="modal-desc">{selected.descripcion_larga || selected.descripcion}</p>
            <div className="modal-benefits">
              <h4>Beneficios clave</h4>
              <ul>
                <li>Solución completamente personalizada para tu negocio</li>
                <li>Equipo de expertos con amplia experiencia sectorial</li>
                <li>Soporte técnico continuo post-entrega</li>
                <li>Metodología ágil con entregables frecuentes</li>
              </ul>
            </div>
            <Link to="/contacto" className="btn btn-primary" onClick={() => setSelected(null)}>
              Solicitar información
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .page-hero {
          background: linear-gradient(135deg, var(--color-midnight-navy), var(--color-stellar-blue));
          padding: var(--spacing-3xl) 0 var(--spacing-2xl);
          color: white;
        }
        .page-hero h1 { color: white; margin-bottom: var(--spacing-sm); }
        .page-hero p { color: rgba(255,255,255,0.75); font-size: var(--font-size-lg); }
        .breadcrumb {
          display: flex; align-items: center; gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-sm); color: rgba(255,255,255,0.6);
        }
        .breadcrumb a { color: var(--color-sirius-light); }
        .breadcrumb span { color: rgba(255,255,255,0.6); }

        .page-content { padding: var(--spacing-3xl) 0; }
        .servicios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }
        .card {
          background: var(--color-white);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          transition: all var(--transition-normal);
        }
        .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: var(--color-sirius-light); }
        .card-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, rgba(55,114,166,0.1), rgba(109,180,242,0.15));
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-orbit-blue);
          margin-bottom: var(--spacing-md);
        }
        .card h3 { font-size: var(--font-size-xl); margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .card p { color: var(--color-gray-500); margin-bottom: var(--spacing-md); line-height: var(--line-height-relaxed); }
        .btn-ver-mas {
          display: inline-flex; align-items: center; gap: 4px;
          color: var(--color-orbit-blue); font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm); background: none; border: none; cursor: pointer;
          padding: 0; transition: gap var(--transition-fast);
        }
        .btn-ver-mas:hover { gap: 8px; }

        .page-cta-bottom { padding: var(--spacing-3xl) 0; background: var(--color-gray-100); }
        .cta-bottom-content { text-align: center; }
        .cta-bottom-content h3 { margin-bottom: var(--spacing-sm); }
        .cta-bottom-content p { color: var(--color-gray-500); margin-bottom: var(--spacing-lg); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(7,21,38,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: var(--spacing-md);
          backdrop-filter: blur(4px);
        }
        .modal {
          background: white; border-radius: var(--radius-xl);
          padding: var(--spacing-2xl); max-width: 700px; width: 100%;
          position: relative; max-height: 90vh; overflow-y: auto;
        }
        .modal-close {
          position: absolute; top: var(--spacing-md); right: var(--spacing-md);
          background: var(--color-gray-100); border: none; cursor: pointer;
          border-radius: var(--radius-md); padding: var(--spacing-xs);
          color: var(--color-gray-600); transition: all var(--transition-fast);
        }
        .modal-close:hover { background: var(--color-gray-200); }
        .modal-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light));
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: white; margin-bottom: var(--spacing-md);
        }
        .modal h2 { margin-bottom: var(--spacing-md); }
        .modal-desc { color: var(--color-gray-500); margin-bottom: var(--spacing-lg); line-height: var(--line-height-relaxed); white-space: pre-wrap; }
        .modal-benefits h4 { margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .modal-benefits ul { list-style: none; margin-bottom: var(--spacing-lg); }
        .modal-benefits li {
          padding: var(--spacing-xs) 0;
          color: var(--color-gray-500);
          padding-left: 1.5rem;
          position: relative;
        }
        .modal-benefits li::before {
          content: '✓'; position: absolute; left: 0;
          color: var(--color-orbit-blue); font-weight: bold;
        }

        .loading-state { text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-500); }

        @media (max-width: 1024px) { .servicios-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .servicios-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
