import React, { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';
import { api } from '../../lib/api';
import { Postulacion, Vacante } from '../../types';
import { PORTAL_STYLES } from './PortalServicios';

const ESTADO_LABELS = {
  en_revision: { label: 'En revisión', color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
  apto: { label: 'Apto', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  descartado: { label: 'Descartado', color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
};

export function PortalPostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Postulacion | null>(null);
  const [filtroVacante, setFiltroVacante] = useState('');

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [posts, vacs] = await Promise.all([
        api.postulaciones.list(),
        api.vacantes.list(),
      ]);
      setPostulaciones(posts as Postulacion[]);
      setVacantes(vacs as Vacante[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateEstado(id: string, estado: Postulacion['estado']) {
    await api.postulaciones.updateEstado(id, estado);
    setPostulaciones(prev => prev.map(x => x.id === id ? { ...x, estado } : x));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, estado } : null);
  }

  function getVacanteTitulo(id: string) {
    return vacantes.find(v => v.id === id)?.titulo || 'Vacante desconocida';
  }

  function formatFecha(f: string) {
    return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const filtradas = filtroVacante ? postulaciones.filter(p => p.vacante_id === filtroVacante) : postulaciones;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const apiHost = apiBase.replace(/\/api\/?$/, '');

  function getCvUrl(cvUrl: string) {
    if (!cvUrl) return cvUrl;
    return cvUrl.startsWith('http') ? cvUrl : `${apiHost}${cvUrl}`;
  }

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Postulaciones</h1>
          <p>Revisa y gestiona los candidatos por vacante.</p>
        </div>
        <div className="filter-group">
          <select value={filtroVacante} onChange={e => setFiltroVacante(e.target.value)} className="filter-select">
            <option value="">Todas las vacantes</option>
            {vacantes.map(v => <option key={v.id} value={v.id}>{v.titulo}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidato</th>
                <th>Vacante</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">No hay postulaciones {filtroVacante ? 'para esta vacante' : 'registradas'}.</td></tr>
              ) : filtradas.map(p => {
                const est = ESTADO_LABELS[p.estado];
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.nombre}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>{p.email}</div>
                    </td>
                    <td className="truncate-cell" style={{ maxWidth: 200 }}>{getVacanteTitulo(p.vacante_id)}</td>
                    <td>{formatFecha(p.created_at)}</td>
                    <td>
                      <select
                        value={p.estado}
                        onChange={e => updateEstado(p.id, e.target.value as Postulacion['estado'])}
                        className="estado-select"
                        style={{ color: est.color, background: est.bg }}
                      >
                        <option value="en_revision">En revisión</option>
                        <option value="apto">Apto</option>
                        <option value="descartado">Descartado</option>
                      </select>
                    </td>
                    <td>
                      <button className="action-btn edit" onClick={() => setSelected(p)}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Detalle del candidato</h2>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="candidato-detail">
              <div className="candidato-header">
                <div className="candidato-avatar">{selected.nombre[0]}</div>
                <div>
                  <h3>{selected.nombre}</h3>
                  <span>{getVacanteTitulo(selected.vacante_id)}</span>
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-item"><label>Email</label><span>{selected.email}</span></div>
                <div className="detail-item"><label>Teléfono</label><span>{selected.telefono || 'No indicado'}</span></div>
                <div className="detail-item"><label>Fecha</label><span>{formatFecha(selected.created_at)}</span></div>
                <div className="detail-item"><label>Estado actual</label>
                  <select value={selected.estado} onChange={e => updateEstado(selected.id, e.target.value as Postulacion['estado'])} className="estado-select" style={{ color: ESTADO_LABELS[selected.estado].color, background: ESTADO_LABELS[selected.estado].bg }}>
                    <option value="en_revision">En revisión</option>
                    <option value="apto">Apto</option>
                    <option value="descartado">Descartado</option>
                  </select>
                </div>
              </div>
              {selected.mensaje && (
                <div className="detail-mensaje">
                  <label>Mensaje</label>
                  <p>{selected.mensaje}</p>
                </div>
              )}
              {selected.cv_url && (
                <a href={getCvUrl(selected.cv_url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)' }}>
                  Ver CV
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`${PORTAL_STYLES}
        .filter-group { display: flex; gap: var(--spacing-sm); }
        .filter-select { padding: var(--spacing-sm) var(--spacing-md); border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--font-size-sm); outline: none; background: white; }
        .estado-select { padding: 4px 8px; border-radius: 100px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; outline: none; }
        .candidato-detail { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .candidato-header { display: flex; align-items: center; gap: var(--spacing-md); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--color-gray-100); }
        .candidato-avatar { width: 56px; height: 56px; background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: var(--font-size-xl); flex-shrink: 0; }
        .candidato-header h3 { margin-bottom: 4px; }
        .candidato-header span { color: var(--color-gray-500); font-size: var(--font-size-sm); }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
        .detail-item { display: flex; flex-direction: column; gap: 4px; }
        .detail-item label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-gray-400); }
        .detail-item span { font-size: var(--font-size-sm); color: var(--color-gray-600); }
        .detail-mensaje { display: flex; flex-direction: column; gap: var(--spacing-sm); }
        .detail-mensaje label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-gray-400); }
        .detail-mensaje p { font-size: var(--font-size-sm); color: var(--color-gray-600); background: var(--color-gray-100); padding: var(--spacing-md); border-radius: var(--radius-md); line-height: var(--line-height-relaxed); }
      `}</style>
    </div>
  );
}
