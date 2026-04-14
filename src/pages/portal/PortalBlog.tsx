import React, { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { api } from '../../lib/api';
import { ArticuloBlog, CategoriaBlog } from '../../types';
import { PORTAL_STYLES } from './PortalServicios';

const EMPTY: Partial<ArticuloBlog> = { titulo: '', slug: '', contenido: '', imagen_url: '', categoria_id: '', publicado: false };

export function PortalBlog() {
  const [articulos, setArticulos] = useState<ArticuloBlog[]>([]);
  const [categorias, setCategorias] = useState<CategoriaBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<ArticuloBlog>>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [arts, cats] = await Promise.all([
        api.blog.list(),
        api.blog.categorias(),
      ]);
      setArticulos(arts as ArticuloBlog[]);
      setCategorias(cats as CategoriaBlog[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(titulo: string) {
    return titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      titulo: editing.titulo,
      slug: editing.slug || generateSlug(editing.titulo || ''),
      contenido: editing.contenido,
      imagen_url: editing.imagen_url,
      categoria_id: editing.categoria_id || null,
      publicado: editing.publicado,
      fecha_publicacion: editing.publicado ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    if (editing.id) {
      await api.blog.update(editing.id, payload);
    } else {
      await api.blog.create(payload);
    }
    await fetchData();
    setShowForm(false);
    setEditing(EMPTY);
    setSaving(false);
  }

  async function togglePublicado(a: ArticuloBlog) {
    await api.blog.update(a.id, { publicado: !a.publicado, fecha_publicacion: !a.publicado ? new Date().toISOString() : null });
    setArticulos(prev => prev.map(x => x.id === a.id ? { ...x, publicado: !x.publicado } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return;
    await api.blog.remove(id);
    setArticulos(prev => prev.filter(x => x.id !== id));
  }

  function formatFecha(f: string) {
    return f ? new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  }

  function openEdit(a: ArticuloBlog) { setEditing(a); setShowForm(true); }
  function openNew() { setEditing(EMPTY); setShowForm(true); }

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Gestión de blog</h1>
          <p>Crea y administra los artículos publicados en el sitio.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Nuevo artículo
        </button>
      </div>

      {loading ? <div className="loading-state">Cargando...</div> : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Publicación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.length === 0 ? (
                <tr><td colSpan={5} className="empty-row">No hay artículos. Crea el primero.</td></tr>
              ) : articulos.map(a => (
                <tr key={a.id}>
                  <td><strong className="truncate-cell" style={{ display: 'block', maxWidth: 280 }}>{a.titulo}</strong></td>
                  <td>{categorias.find(c => c.id === a.categoria_id)?.nombre || '-'}</td>
                  <td>{formatFecha(a.fecha_publicacion)}</td>
                  <td>
                    <button className={`status-toggle ${a.publicado ? 'active' : ''}`} onClick={() => togglePublicado(a)}>
                      {a.publicado ? <Eye size={16} /> : <EyeOff size={16} />}
                      {a.publicado ? 'Publicado' : 'Borrador'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(a)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(a.id)}><Trash2 size={16} /></button>
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
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing.id ? 'Editar artículo' : 'Nuevo artículo'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="form">
              <div className="form-group">
                <label>Título *</label>
                <input type="text" required value={editing.titulo} onChange={e => setEditing({ ...editing, titulo: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Título del artículo" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Slug (URL)</label>
                  <input type="text" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="url-del-articulo" />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select value={editing.categoria_id} onChange={e => setEditing({ ...editing, categoria_id: e.target.value })}>
                    <option value="">Sin categoría</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>URL de imagen destacada</label>
                <input type="text" value={editing.imagen_url} onChange={e => setEditing({ ...editing, imagen_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Contenido *</label>
                <textarea rows={8} required value={editing.contenido} onChange={e => setEditing({ ...editing, contenido: e.target.value })} placeholder="Escribe el contenido del artículo aquí..." />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={editing.publicado} onChange={e => setEditing({ ...editing, publicado: e.target.checked })} />
                  Publicar artículo
                </label>
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
        .checkbox-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-midnight-navy); }
        .checkbox-label input { width: 16px; height: 16px; cursor: pointer; }
      `}</style>
    </div>
  );
}
