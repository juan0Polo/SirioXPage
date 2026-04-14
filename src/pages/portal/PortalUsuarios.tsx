import React, { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Usuario } from '../../types';
import { PORTAL_STYLES } from './PortalServicios';

const EMPTY: Partial<Usuario> & { password?: string } = { nombre: '', email: '', rol: 'editor', activo: true, password: 'Temporal2026!' };

export function PortalUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Usuario> & { password?: string }>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchUsuarios(); }, []);

  async function fetchUsuarios() {
    try {
      const data = await api.usuarios.list();
      setUsuarios(data as Usuario[]);
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
      if (editing.id) {
        await api.usuarios.update(editing.id, { nombre: editing.nombre, rol: editing.rol, activo: editing.activo });
      } else {
        await api.usuarios.create({ nombre: editing.nombre, email: editing.email, rol: editing.rol, activo: editing.activo, password: editing.password });
      }
      await fetchUsuarios();
      setShowForm(false);
      setEditing(EMPTY);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(u: Usuario) {
    await api.usuarios.update(u.id, { activo: !u.activo });
    setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, activo: !x.activo } : x));
  }

  const ROL_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    admin: { label: 'Administrador', color: '#3772A6', bg: 'rgba(55,114,166,0.1)' },
    editor: { label: 'Editor', color: '#D97706', bg: 'rgba(217,119,6,0.1)' },
    rrhh: { label: 'RRHH', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  };

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Administración de usuarios</h1>
          <p>Gestiona los accesos y roles del portal.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(EMPTY); setShowForm(true); }}>
          <Plus size={18} /> Nuevo usuario
        </button>
      </div>

      <div className="roles-info">
        {Object.entries(ROL_LABELS).map(([key, val]) => (
          <div key={key} className="role-info-item" style={{ background: val.bg }}>
            <span style={{ color: val.color, fontWeight: 700 }}>{val.label}</span>
            <span>
              {key === 'admin' && 'Acceso total al portal'}
              {key === 'editor' && 'Gestión de servicios y blog'}
              {key === 'rrhh' && 'Gestión de vacantes y postulaciones'}
            </span>
          </div>
        ))}
      </div>

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">No hay usuarios registrados.</td></tr>
              ) : usuarios.map(u => {
                const rol = ROL_LABELS[u.rol] || { label: u.rol, color: '#666', bg: '#eee' };
                return (
                  <tr key={u.id}>
                    <td><strong>{u.nombre}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="rol-badge" style={{ color: rol.color, background: rol.bg }}>{rol.label}</span></td>
                    <td>
                      <button className={`status-toggle ${u.activo ? 'active' : ''}`} onClick={() => toggleActivo(u)}>
                        {u.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td>
                      <button className="action-btn edit" onClick={() => { setEditing(u); setShowForm(true); }}><Edit2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing.id ? 'Editar usuario' : 'Nuevo usuario'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input type="text" required value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })} placeholder="Nombre del usuario" />
              </div>
              {!editing.id && (
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="usuario@empresa.com" />
                </div>
              )}
              {!editing.id && (
                <div className="form-group">
                  <label>Contraseña inicial *</label>
                  <input type="text" required value={editing.password} onChange={e => setEditing({ ...editing, password: e.target.value })} placeholder="Contraseña temporal" />
                </div>
              )}
              <div className="form-group">
                <label>Rol *</label>
                <select value={editing.rol} onChange={e => setEditing({ ...editing, rol: e.target.value as Usuario['rol'] })}>
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="rrhh">RRHH</option>
                </select>
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
        .roles-info { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-xl); flex-wrap: wrap; }
        .role-info-item { display: flex; flex-direction: column; gap: 2px; padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); flex: 1; min-width: 180px; }
        .role-info-item span:last-child { font-size: var(--font-size-xs); color: var(--color-gray-500); }
        .rol-badge { display: inline-block; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
      `}</style>
    </div>
  );
}
