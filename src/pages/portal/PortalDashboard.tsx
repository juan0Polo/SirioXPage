import React, { useEffect, useState } from 'react';
import { Layers, BookOpen, Briefcase, FileText, Users, TrendingUp } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  servicios: number;
  articulos: number;
  vacantes: number;
  postulaciones: number;
  contactos: number;
}

const ACTIVIDAD_MOCK = [
  { accion: 'Nueva postulación recibida', detalle: 'Desarrollador Full Stack Senior', tiempo: 'Hace 2 horas' },
  { accion: 'Artículo publicado', detalle: 'El futuro del desarrollo web en 2026', tiempo: 'Hace 5 horas' },
  { accion: 'Vacante creada', detalle: 'UX/UI Designer', tiempo: 'Hace 1 día' },
  { accion: 'Servicio actualizado', detalle: 'Desarrollo Web', tiempo: 'Hace 2 días' },
  { accion: 'Nuevo contacto', detalle: 'Carlos M. - Consulta de proyecto', tiempo: 'Hace 3 días' },
];

export function PortalDashboard() {
  const [stats, setStats] = useState<Stats>({ servicios: 0, articulos: 0, vacantes: 0, postulaciones: 0, contactos: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await api.usuarios.stats();
      setStats(data as unknown as Stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const METRIC_CARDS = [
    { label: 'Servicios activos', value: stats.servicios, icon: <Layers size={24} />, color: '#3772A6', bg: 'rgba(55,114,166,0.1)' },
    { label: 'Artículos publicados', value: stats.articulos, icon: <BookOpen size={24} />, color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)' },
    { label: 'Vacantes activas', value: stats.vacantes, icon: <Briefcase size={24} />, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Postulaciones', value: stats.postulaciones, icon: <FileText size={24} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Contactos recibidos', value: stats.contactos, icon: <Users size={24} />, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
  ];

  return (
    <div className="dashboard">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Bienvenido de vuelta, <strong>{user?.nombre || user?.email}</strong></p>
      </div>

      {loading ? (
        <div className="loading-state">Cargando métricas...</div>
      ) : (
        <div className="metrics-grid">
          {METRIC_CARDS.map((m, i) => (
            <div key={i} className="metric-card">
              <div className="metric-icon" style={{ background: m.bg, color: m.color }}>
                {m.icon}
              </div>
              <div className="metric-info">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="actividad-card">
          <div className="card-header">
            <h3><TrendingUp size={18} /> Actividad reciente</h3>
          </div>
          <div className="actividad-list">
            {ACTIVIDAD_MOCK.map((a, i) => (
              <div key={i} className="actividad-item">
                <div className="actividad-dot" />
                <div className="actividad-info">
                  <strong>{a.accion}</strong>
                  <span>{a.detalle}</span>
                </div>
                <span className="actividad-tiempo">{a.tiempo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-card">
          <div className="card-header">
            <h3>Acciones rápidas</h3>
          </div>
          <div className="quick-actions">
            <a href="/portal/servicios" className="quick-action">
              <Layers size={20} />
              <div>
                <strong>Nuevo servicio</strong>
                <span>Agrega un servicio al sitio</span>
              </div>
            </a>
            <a href="/portal/blog" className="quick-action">
              <BookOpen size={20} />
              <div>
                <strong>Nuevo artículo</strong>
                <span>Publica en el blog</span>
              </div>
            </a>
            <a href="/portal/vacantes" className="quick-action">
              <Briefcase size={20} />
              <div>
                <strong>Nueva vacante</strong>
                <span>Publica una posición</span>
              </div>
            </a>
            <a href="/portal/postulaciones" className="quick-action">
              <FileText size={20} />
              <div>
                <strong>Ver postulaciones</strong>
                <span>Revisa candidatos</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard { max-width: 1200px; }
        .page-title { margin-bottom: var(--spacing-xl); }
        .page-title h1 { font-size: var(--font-size-3xl); margin-bottom: 4px; }
        .page-title p { color: var(--color-gray-500); }

        .metrics-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
        .metric-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-md); border: 1px solid var(--color-gray-200); transition: all var(--transition-normal); }
        .metric-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .metric-icon { width: 48px; height: 48px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .metric-value { display: block; font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-midnight-navy); line-height: 1; }
        .metric-label { font-size: var(--font-size-xs); color: var(--color-gray-400); font-weight: var(--font-weight-semibold); }

        .dashboard-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--spacing-lg); }
        .actividad-card, .quick-actions-card { background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-gray-200); overflow: hidden; }
        .card-header { padding: var(--spacing-lg); border-bottom: 1px solid var(--color-gray-100); }
        .card-header h3 { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--font-size-lg); color: var(--color-midnight-navy); }

        .actividad-list { padding: var(--spacing-sm); }
        .actividad-item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); transition: background var(--transition-fast); }
        .actividad-item:hover { background: var(--color-gray-100); }
        .actividad-dot { width: 8px; height: 8px; background: var(--color-orbit-blue); border-radius: 50%; flex-shrink: 0; }
        .actividad-info { flex: 1; min-width: 0; }
        .actividad-info strong { display: block; font-size: var(--font-size-sm); color: var(--color-midnight-navy); }
        .actividad-info span { font-size: var(--font-size-xs); color: var(--color-gray-400); }
        .actividad-tiempo { font-size: var(--font-size-xs); color: var(--color-gray-400); white-space: nowrap; flex-shrink: 0; }

        .quick-actions { padding: var(--spacing-sm); display: flex; flex-direction: column; gap: 2px; }
        .quick-action { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); border-radius: var(--radius-md); text-decoration: none; color: var(--color-gray-600); transition: all var(--transition-fast); }
        .quick-action:hover { background: var(--color-gray-100); color: var(--color-orbit-blue); }
        .quick-action svg { color: var(--color-orbit-blue); flex-shrink: 0; }
        .quick-action strong { display: block; font-size: var(--font-size-sm); color: var(--color-midnight-navy); }
        .quick-action span { font-size: var(--font-size-xs); color: var(--color-gray-400); }

        .loading-state { text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-400); }

        @media (max-width: 1200px) { .metrics-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .metrics-grid { grid-template-columns: repeat(2, 1fr); } .dashboard-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .metrics-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
