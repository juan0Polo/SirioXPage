import React, { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Vacante } from '../../types';
import { PORTAL_STYLES } from './PortalServicios';

const EMPTY: Partial<Vacante> = { titulo: '', area: '', modalidad: 'hibrido', ubicacion: '', descripcion: '', requisitos: '', activa: true };

export function PortalVacantes() {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Vacante>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchVacantes(); }, []);

  async function fetchVacantes() {
    try {
      const data = await api.vacantes.list();
      setVacantes(data as Vacante[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { titulo: editing.titulo, area: editing.area, modalidad: editing.modalidad, ubicacion: editing.ubicacion, descripcion: editing.descripcion, requisitos: editing.requisitos, activa: editing.activa };
      if (editing.id) {
        await api.vacantes.update(editing.id, payload);
      } else {
        await api.vacantes.create(payload);
      }
      await fetchVacantes();
      setShowForm(false);
      setEditing(EMPTY);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(v: Vacante) {
    const payload = {
      titulo: v.titulo,
      area: v.area,
      modalidad: v.modalidad,
      ubicacion: v.ubicacion,
      descripcion: v.descripcion,
      requisitos: v.requisitos,
      activa: !v.activa,
    };
    await api.vacantes.update(v.id, payload);
    setVacantes(prev => prev.map(x => x.id === v.id ? { ...x, activa: !x.activa } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta vacante? También se eliminarán las postulaciones asociadas.')) return;
    await api.vacantes.remove(id);
    setVacantes(prev => prev.filter(x => x.id !== id));
  }

  const MOD_LABELS = { remoto: 'Remoto', presencial: 'Presencial', hibrido: 'Híbrido' };

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Gestión de vacantes</h1>
          <p>Publica y administra las posiciones de trabajo abiertas.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(EMPTY); setShowForm(true); }}>
          <Plus size={18} /> Nueva vacante
        </button>
      </div>

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cargo</th>
                <th>Área</th>
                <th>Modalidad</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacantes.length === 0 ? (
                <tr><td colSpan={6} className="empty-row">No hay vacantes. Crea la primera.</td></tr>
              ) : vacantes.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.titulo}</strong></td>
                  <td>{v.area}</td>
                  <td><span className={`mod-badge mod-${v.modalidad}`}>{MOD_LABELS[v.modalidad]}</span></td>
                  <td>{v.ubicacion}</td>
                  <td>
                    <button className={`status-toggle ${v.activa ? 'active' : ''}`} onClick={() => toggleActiva(v)}>
                      {v.activa ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      {v.activa ? 'Activa' : 'Cerrada'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => { setEditing(v); setShowForm(true); }}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(v.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing.id ? 'Editar vacante' : 'Nueva vacante'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>Título del cargo *</label>
                <input type="text" required value={editing.titulo} onChange={e => setEditing({ ...editing, titulo: e.target.value })} placeholder="Ej. Desarrollador Full Stack Senior" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Área *</label>
                  <input type="text" required value={editing.area} onChange={e => setEditing({ ...editing, area: e.target.value })} placeholder="Ingeniería, Diseño, RRHH..." />
                </div>
                <div className="form-group">
                  <label>Modalidad *</label>
                  <select value={editing.modalidad} onChange={e => setEditing({ ...editing, modalidad: e.target.value as Vacante['modalidad'] })}>
                    <option value="remoto">Remoto</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input type="text" value={editing.ubicacion} onChange={e => setEditing({ ...editing, ubicacion: e.target.value })} placeholder="Ciudad, País" />
              </div>
              <div className="form-group">
                <label>Descripción del cargo *</label>
                <textarea rows={4} required value={editing.descripcion} onChange={e => setEditing({ ...editing, descripcion: e.target.value })} placeholder="Describe el rol, responsabilidades y el equipo..." />
              </div>
              <div className="form-group">
                <label>Requisitos</label>
                <textarea rows={3} value={editing.requisitos} onChange={e => setEditing({ ...editing, requisitos: e.target.value })} placeholder="Experiencia requerida, habilidades, educación..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`${PORTAL_STYLES}
        .mod-badge { display: inline-block; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
        .mod-remoto { background: rgba(5,150,105,0.1); color: #059669; }
        .mod-presencial { background: rgba(37,99,235,0.1); color: #2563EB; }
        .mod-hibrido { background: rgba(217,119,6,0.1); color: #D97706; }
      `}</style>
    </div>
  );
}
