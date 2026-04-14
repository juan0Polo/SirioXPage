import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { api } from '../lib/api';
import { ArticuloBlog, CategoriaBlog } from '../types';

const ARTICULOS_MOCK: ArticuloBlog[] = [
  { id: '1', titulo: 'El futuro del desarrollo web en 2026', slug: 'futuro-desarrollo-web-2026', contenido: '', imagen_url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '1', autor_id: '1', publicado: true, fecha_publicacion: '2026-04-01', created_at: '', updated_at: '' },
  { id: '2', titulo: 'Cómo implementar microservicios con Python', slug: 'microservicios-python', contenido: '', imagen_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '2', autor_id: '1', publicado: true, fecha_publicacion: '2026-03-28', created_at: '', updated_at: '' },
  { id: '3', titulo: 'PostgreSQL vs MongoDB: ¿Cuál elegir?', slug: 'postgresql-vs-mongodb', contenido: '', imagen_url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '1', autor_id: '1', publicado: true, fecha_publicacion: '2026-03-20', created_at: '', updated_at: '' },
  { id: '4', titulo: 'Seguridad en APIs REST: mejores prácticas', slug: 'seguridad-apis-rest', contenido: '', imagen_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '3', autor_id: '1', publicado: true, fecha_publicacion: '2026-03-15', created_at: '', updated_at: '' },
  { id: '5', titulo: 'Angular 17: nuevas características que debes conocer', slug: 'angular-17-novedades', contenido: '', imagen_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '1', autor_id: '1', publicado: true, fecha_publicacion: '2026-03-10', created_at: '', updated_at: '' },
  { id: '6', titulo: 'Transformación digital: guía para empresas B2B', slug: 'transformacion-digital-b2b', contenido: '', imagen_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600', categoria_id: '2', autor_id: '1', publicado: true, fecha_publicacion: '2026-03-05', created_at: '', updated_at: '' },
];

const CATEGORIAS_MOCK: CategoriaBlog[] = [
  { id: '1', nombre: 'Desarrollo', slug: 'desarrollo', descripcion: '' },
  { id: '2', nombre: 'Empresas', slug: 'empresas', descripcion: '' },
  { id: '3', nombre: 'Seguridad', slug: 'seguridad', descripcion: '' },
];

const EXTRACTOS: Record<string, string> = {
  '1': 'Exploramos las tendencias que definirán el ecosistema del desarrollo web en los próximos años: IA generativa, Edge Computing y nuevos frameworks.',
  '2': 'Una guía práctica para diseñar e implementar arquitecturas de microservicios usando FastAPI y Docker en proyectos empresariales.',
  '3': 'Analizamos las fortalezas y debilidades de ambas bases de datos para ayudarte a tomar la mejor decisión para tu proyecto.',
  '4': 'Repasamos las vulnerabilidades más comunes en APIs y cómo implementar autenticación, autorización y validación correctamente.',
  '5': 'Un recorrido por las mejoras de rendimiento, signals, defer blocks y otras novedades de la última versión de Angular.',
  '6': 'Estrategias y pasos concretos para guiar a tu empresa en el camino hacia la transformación digital sin fricciones.',
};

export function BlogPage() {
  const [articulos, setArticulos] = useState<ArticuloBlog[]>([]);
  const [categorias, setCategorias] = useState<CategoriaBlog[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<string>('');
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const POR_PAGINA = 6;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [arts, cats] = await Promise.all([
        api.blog.listPublic(),
        api.blog.categorias(),
      ]);
      setArticulos(arts && arts.length > 0 ? arts as ArticuloBlog[] : ARTICULOS_MOCK);
      setCategorias(cats && cats.length > 0 ? cats as CategoriaBlog[] : CATEGORIAS_MOCK);
    } catch {
      setArticulos(ARTICULOS_MOCK);
      setCategorias(CATEGORIAS_MOCK);
    } finally {
      setLoading(false);
    }
  }

  const filtrados = articulos.filter(a => {
    const matchBusqueda = a.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = !categoriaActiva || a.categoria_id === categoriaActiva;
    return matchBusqueda && matchCategoria;
  });

  const total = filtrados.length;
  const totalPaginas = Math.ceil(total / POR_PAGINA);
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function getNombreCategoria(id: string) {
    return categorias.find(c => c.id === id)?.nombre || 'General';
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Blog</h1>
          <p>Artículos, guías y noticias sobre tecnología, desarrollo y transformación digital.</p>
          <div className="blog-filters">
            <div className="search-input-wrap">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={busqueda}
                onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
              />
            </div>
            <div className="category-filters">
              <button
                className={`cat-btn ${!categoriaActiva ? 'active' : ''}`}
                onClick={() => { setCategoriaActiva(''); setPagina(1); }}
              >
                Todos
              </button>
              {categorias.map(c => (
                <button
                  key={c.id}
                  className={`cat-btn ${categoriaActiva === c.id ? 'active' : ''}`}
                  onClick={() => { setCategoriaActiva(c.id); setPagina(1); }}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">Cargando artículos...</div>
          ) : paginados.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <h3>No se encontraron artículos</h3>
              <p>Intenta con otros términos de búsqueda o filtra por otra categoría.</p>
            </div>
          ) : (
            <>
              <div className="blog-grid">
                {paginados.map(a => (
                  <article key={a.id} className="blog-card">
                    <div className="blog-card-image">
                      <img src={a.imagen_url} alt={a.titulo} loading="lazy" />
                      <span className="blog-card-category">
                        <Tag size={12} /> {getNombreCategoria(a.categoria_id)}
                      </span>
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">
                        <span><Calendar size={14} /> {formatFecha(a.fecha_publicacion)}</span>
                        <span><User size={14} /> SIRIO X</span>
                      </div>
                      <h3>{a.titulo}</h3>
                      <p>{EXTRACTOS[a.id] || a.contenido.substring(0, 150) + '...'}</p>
                      <Link to={`/blog/${a.slug}`} className="btn-leer-mas">
                        Leer más <ChevronRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {totalPaginas > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={pagina === 1}
                    onClick={() => setPagina(p => p - 1)}
                  >
                    Anterior
                  </button>
                  {[...Array(totalPaginas)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${pagina === i + 1 ? 'active' : ''}`}
                      onClick={() => setPagina(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={pagina === totalPaginas}
                    onClick={() => setPagina(p => p + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .page-hero {
          background: linear-gradient(135deg, var(--color-midnight-navy), var(--color-stellar-blue));
          padding: var(--spacing-3xl) 0 var(--spacing-2xl);
          color: white;
        }
        .page-hero h1 { color: white; margin-bottom: var(--spacing-sm); }
        .page-hero p { color: rgba(255,255,255,0.75); font-size: var(--font-size-lg); margin-bottom: var(--spacing-xl); }
        .blog-filters { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .search-input-wrap {
          display: flex; align-items: center; gap: var(--spacing-sm);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm) var(--spacing-md);
          max-width: 400px;
        }
        .search-input-wrap svg { color: rgba(255,255,255,0.6); flex-shrink: 0; }
        .search-input-wrap input {
          background: none; border: none; outline: none;
          color: white; font-size: var(--font-size-base); flex: 1;
        }
        .search-input-wrap input::placeholder { color: rgba(255,255,255,0.5); }
        .category-filters { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; }
        .cat-btn {
          padding: 6px 16px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.3);
          background: transparent; color: rgba(255,255,255,0.7);
          cursor: pointer; font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          transition: all var(--transition-fast);
        }
        .cat-btn:hover, .cat-btn.active {
          background: var(--color-orbit-blue);
          border-color: var(--color-orbit-blue);
          color: white;
        }

        .page-content { padding: var(--spacing-3xl) 0; }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }
        .blog-card {
          background: white;
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-normal);
        }
        .blog-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .blog-card-image { position: relative; height: 200px; overflow: hidden; }
        .blog-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
        .blog-card:hover .blog-card-image img { transform: scale(1.05); }
        .blog-card-category {
          position: absolute; top: var(--spacing-sm); left: var(--spacing-sm);
          background: var(--color-orbit-blue); color: white;
          padding: 4px 10px; border-radius: 100px;
          font-size: 11px; font-weight: var(--font-weight-semibold);
          display: flex; align-items: center; gap: 4px;
        }
        .blog-card-content { padding: var(--spacing-lg); }
        .blog-card-meta {
          display: flex; gap: var(--spacing-md);
          color: var(--color-gray-400); font-size: var(--font-size-xs);
          margin-bottom: var(--spacing-sm);
        }
        .blog-card-meta span { display: flex; align-items: center; gap: 4px; }
        .blog-card-content h3 {
          font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);
          color: var(--color-midnight-navy);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-card-content p { color: var(--color-gray-500); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md); line-height: 1.6; }
        .btn-leer-mas {
          display: inline-flex; align-items: center; gap: 4px;
          color: var(--color-orbit-blue); font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm); text-decoration: none;
          transition: gap var(--transition-fast);
        }
        .btn-leer-mas:hover { gap: 8px; }

        .pagination {
          display: flex; gap: var(--spacing-sm); justify-content: center; margin-top: var(--spacing-2xl);
        }
        .page-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md); background: white;
          color: var(--color-gray-600); cursor: pointer;
          font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
          transition: all var(--transition-fast);
        }
        .page-btn:hover:not(:disabled) { border-color: var(--color-orbit-blue); color: var(--color-orbit-blue); }
        .page-btn.active { background: var(--color-orbit-blue); color: white; border-color: var(--color-orbit-blue); }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .empty-state, .loading-state {
          text-align: center; padding: var(--spacing-3xl); color: var(--color-gray-400);
        }
        .empty-state svg { margin: 0 auto var(--spacing-md); opacity: 0.3; }
        .empty-state h3 { color: var(--color-gray-600); margin-bottom: var(--spacing-sm); }

        @media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
