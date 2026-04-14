import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { PORTAL_STYLES } from './PortalServicios';

interface NotificacionContacto {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

const EMPTY: Partial<NotificacionContacto> = { email: '', nombre: '', activo: true };

export function PortalNotificacionesContacto() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificacionContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<NotificacionContacto>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Usuario actual:', user);
    fetchNotificaciones();
  }, []);

  useEffect(() => { fetchNotificaciones(); }, []);

  async function fetchNotificaciones() {
    try {
      const data = await api.notificacionesContacto.list();
      setNotificaciones(data as NotificacionContacto[]);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar notificaciones');
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing.email || !editing.nombre) {
      setError('Email y nombre son requeridos');
      return;
    }
    setSaving(true);
    setError('');
    try {
      console.log('Enviando payload:', { email: editing.email, nombre: editing.nombre, activo: editing.activo });
      const payload = { email: editing.email, nombre: editing.nombre, activo: editing.activo };
      if (editing.id) {
        await api.notificacionesContacto.update(editing.id, payload);
      } else {
        await api.notificacionesContacto.create(payload);
      }
      await fetchNotificaciones();
      setShowForm(false);
      setEditing(EMPTY);
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(n: NotificacionContacto) {
    try {
      const payload = { email: n.email, nombre: n.nombre, activo: !n.activo };
      await api.notificacionesContacto.update(n.id, payload);
      setNotificaciones(prev => prev.map(x => x.id === n.id ? { ...x, activo: !x.activo } : x));
    } catch (err) {
      console.error(err);
      setError('Error al actualizar estado');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta notificación?')) return;
    try {
      await api.notificacionesContacto.remove(id);
      setNotificaciones(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      console.error(err);
      setError('Error al eliminar');
    }
  }

  function openEdit(n: NotificacionContacto) { setEditing(n); setShowForm(true); }
  function openNew() { setEditing(EMPTY); setShowForm(true); setError(''); }

  if (!user || user.rol !== 'admin') {
    return (
      <div className="portal-page">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar las notificaciones de contacto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Notificaciones de Contacto</h1>
          <p>Define los emails que recibirán notificaciones cuando alguien se comunique.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Agregar email
        </button>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', color: '#DC2626', marginBottom: 'var(--spacing-lg)' }}>
          {error}
        </div>
      )}

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {notificaciones.length === 0 ? (
                <tr><td colSpan={4} className="empty-row">No hay notificaciones configuradas.</td></tr>
              ) : notificaciones.map(n => (
                <tr key={n.id}>
                  <td><strong>{n.nombre}</strong></td>
                  <td>{n.email}</td>
                  <td>
                    <button className={`status-toggle ${n.activo ? 'active' : ''}`} onClick={() => toggleActivo(n)}>
                      {n.activo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      {n.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(n)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(n.id)}><Trash2 size={16} /></button>
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
              <h2>{editing.id ? 'Editar notificación' : 'Nueva notificación'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" required value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })} placeholder="Ej. Soporte, Contactos" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" required value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="email@empresa.com" />
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
