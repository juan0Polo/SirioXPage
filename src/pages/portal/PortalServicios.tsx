import React, { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { Servicio } from '../../types';

const EMPTY: Partial<Servicio> = { titulo: '', descripcion: '', descripcion_larga: '', icono_url: '', activo: true, orden: 0 };

export function PortalServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Servicio>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchServicios(); }, []);

  async function fetchServicios() {
    try {
      const data = await api.servicios.list();
      setServicios(data as Servicio[]);
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
      const payload = { titulo: editing.titulo, descripcion: editing.descripcion, descripcion_larga: editing.descripcion_larga, icono_url: editing.icono_url, activo: editing.activo, orden: editing.orden };
      if (editing.id) {
        await api.servicios.update(editing.id, payload);
      } else {
        await api.servicios.create(payload);
      }
      await fetchServicios();
      setShowForm(false);
      setEditing(EMPTY);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(s: Servicio) {
    const payload = {
      titulo: s.titulo,
      descripcion: s.descripcion,
      descripcion_larga: s.descripcion_larga,
      icono_url: s.icono_url,
      activo: !s.activo,
      orden: s.orden,
    };
    await api.servicios.update(s.id, payload);
    setServicios(prev => prev.map(x => x.id === s.id ? { ...x, activo: !x.activo } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este servicio?')) return;
    await api.servicios.remove(id);
    setServicios(prev => prev.filter(x => x.id !== id));
  }

  function openEdit(s: Servicio) { setEditing(s); setShowForm(true); }
  function openNew() { setEditing(EMPTY); setShowForm(true); }

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Gestión de servicios</h1>
          <p>Administra los servicios que aparecen en el sitio público.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Nuevo servicio
        </button>
      </div>

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">No hay servicios. Crea el primero.</td></tr>
              ) : servicios.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.titulo}</strong></td>
                  <td className="truncate-cell">{s.descripcion}</td>
                  <td>{s.orden}</td>
                  <td>
                    <button className={`status-toggle ${s.activo ? 'active' : ''}`} onClick={() => toggleActivo(s)}>
                      {s.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(s)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing.id ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>Título *</label>
                <input type="text" required value={editing.titulo} onChange={e => setEditing({ ...editing, titulo: e.target.value })} placeholder="Nombre del servicio" />
              </div>
              <div className="form-group">
                <label>Descripción corta *</label>
                <textarea rows={2} required value={editing.descripcion} onChange={e => setEditing({ ...editing, descripcion: e.target.value })} placeholder="Descripción breve para tarjetas" />
              </div>
              <div className="form-group">
                <label>Descripción larga</label>
                <textarea rows={4} value={editing.descripcion_larga} onChange={e => setEditing({ ...editing, descripcion_larga: e.target.value })} placeholder="Descripción completa del servicio" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>URL del ícono</label>
                  <input type="text" value={editing.icono_url} onChange={e => setEditing({ ...editing, icono_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label>Orden</label>
                  <input type="number" min={0} value={editing.orden} onChange={e => setEditing({ ...editing, orden: Number(e.target.value) })} />
                </div>
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

      <style>{`${PORTAL_STYLES}`}</style>
    </div>
  );
}

export const PORTAL_STYLES = `
  .portal-page { max-width: 1100px; }
  .portal-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-xl); gap: var(--spacing-lg); flex-wrap: wrap; }
  .portal-page-header h1 { font-size: var(--font-size-3xl); margin-bottom: 4px; }
  .portal-page-header p { color: var(--color-gray-500); }

  .data-table-wrap { background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-gray-200); overflow: hidden; }
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th { background: var(--color-gray-100); padding: var(--spacing-md); text-align: left; font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-gray-600); border-bottom: 1px solid var(--color-gray-200); }
  .data-table td { padding: var(--spacing-md); border-bottom: 1px solid var(--color-gray-100); font-size: var(--font-size-sm); color: var(--color-gray-600); vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--color-gray-100); }
  .truncate-cell { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .empty-row { text-align: center; color: var(--color-gray-400); padding: var(--spacing-3xl) !important; }

  .status-toggle { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-gray-400); transition: color var(--transition-fast); }
  .status-toggle.active { color: #059669; }

  .action-btns { display: flex; gap: var(--spacing-xs); }
  .action-btn { width: 32px; height: 32px; border: none; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); }
  .action-btn.edit { background: rgba(55,114,166,0.1); color: var(--color-orbit-blue); }
  .action-btn.edit:hover { background: var(--color-orbit-blue); color: white; }
  .action-btn.delete { background: rgba(220,38,38,0.1); color: #DC2626; }
  .action-btn.delete:hover { background: #DC2626; color: white; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(7,21,38,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: var(--spacing-md); backdrop-filter: blur(4px); }
  .modal { background: white; border-radius: var(--radius-xl); padding: var(--spacing-2xl); max-width: 580px; width: 100%; max-height: 90vh; overflow-y: auto; }
  .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-xl); }
  .modal-head h2 { font-size: var(--font-size-2xl); }
  .modal-close { background: var(--color-gray-100); border: none; cursor: pointer; border-radius: var(--radius-md); padding: var(--spacing-xs); color: var(--color-gray-600); }

  .form { display: flex; flex-direction: column; gap: var(--spacing-md); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
  .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
  .form-group label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-midnight-navy); }
  .form-group input, .form-group textarea, .form-group select { padding: var(--spacing-sm); border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: var(--font-size-sm); outline: none; transition: border-color var(--transition-fast); font-family: var(--font-family-sans); resize: vertical; }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--color-orbit-blue); }
  .form-actions { display: flex; gap: var(--spacing-md); justify-content: flex-end; padding-top: var(--spacing-md); border-top: 1px solid var(--color-gray-100); }

  .loading-state { text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-400); }
`;
