import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { ArticuloBlog } from '../types';

const ARTICULO_MOCK: ArticuloBlog = {
  id: '1', titulo: 'El futuro del desarrollo web en 2026',
  slug: 'futuro-desarrollo-web-2026',
  contenido: `
    <p>El desarrollo web continúa evolucionando a una velocidad sin precedentes. En 2026, las empresas que adopten las tendencias correctas obtendrán ventajas competitivas significativas.</p>
    <h2>Inteligencia Artificial en el desarrollo</h2>
    <p>La IA generativa ha transformado la forma en que los desarrolladores escriben código. Herramientas como GitHub Copilot y similares son ahora parte del flujo de trabajo estándar, aumentando la productividad hasta un 40%.</p>
    <h2>Edge Computing y rendimiento</h2>
    <p>El procesamiento en el borde de la red permite tiempos de respuesta sub-milisegundo para usuarios de todo el mundo. Frameworks como Next.js, Astro y Remix han adoptado esta arquitectura de forma nativa.</p>
    <h2>Web Components y Micro Frontends</h2>
    <p>La modularización del frontend sigue siendo tendencia. Los equipos distribuidos ahora pueden trabajar de forma independiente en diferentes partes de una aplicación sin conflictos.</p>
    <h2>Conclusión</h2>
    <p>El futuro del desarrollo web es apasionante. Las empresas que inviertan en capacitación técnica y adopten estas tendencias estarán mejor posicionadas para el éxito digital.</p>
  `,
  imagen_url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1200',
  categoria_id: '1', autor_id: '1', publicado: true,
  fecha_publicacion: '2026-04-01', created_at: '', updated_at: '',
};

const RELACIONADOS_MOCK = [
  { id: '2', titulo: 'Cómo implementar microservicios con Python', slug: 'microservicios-python', imagen_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: '5', titulo: 'Angular 17: nuevas características que debes conocer', slug: 'angular-17-novedades', imagen_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export function BlogArticuloPage() {
  const { slug } = useParams<{ slug: string }>();
  const [articulo, setArticulo] = useState<ArticuloBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticulo();
  }, [slug]);

  async function fetchArticulo() {
    if (!slug) return;
    try {
      const articuloData = await api.blog.get(slug) as ArticuloBlog;
      setArticulo(articuloData);
    } catch (err) {
      console.error('Error fetching article:', err);
      setArticulo(ARTICULO_MOCK);
    } finally {
      setLoading(false);
    }
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;
  if (!articulo) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Artículo no encontrado</h2><Link to="/blog">Volver al blog</Link></div>;

  return (
    <div className="articulo-page">
      <div className="articulo-hero">
        <img src={articulo.imagen_url} alt={articulo.titulo} />
        <div className="articulo-hero-overlay" />
      </div>

      <div className="articulo-container">
        <div className="articulo-main">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link>
            <ChevronRight size={14} />
            <Link to="/blog">Blog</Link>
            <ChevronRight size={14} />
            <span>{articulo.titulo}</span>
          </nav>

          <div className="articulo-meta">
            <span className="articulo-categoria"><Tag size={14} /> Desarrollo</span>
            <span><Calendar size={14} /> {formatFecha(articulo.fecha_publicacion)}</span>
            <span><User size={14} /> SIRIO X</span>
          </div>

          <h1>{articulo.titulo}</h1>

          <div
            className="articulo-content"
            dangerouslySetInnerHTML={{ __html: articulo.contenido }}
          />

          <div className="articulo-nav">
            <Link to="/blog" className="btn btn-secondary">
              <ArrowLeft size={18} /> Volver al blog
            </Link>
          </div>
        </div>

        <aside className="articulo-sidebar">
          <div className="sidebar-widget">
            <h4>Artículos relacionados</h4>
            <div className="relacionados">
              {RELACIONADOS_MOCK.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="relacionado-item">
                  <img src={r.imagen_url} alt={r.titulo} />
                  <span>{r.titulo}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-widget newsletter-widget">
            <h4>Suscríbete al newsletter</h4>
            <p>Recibe los mejores artículos sobre tecnología directamente en tu correo.</p>
            <form onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="tu@email.com" />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Suscribirme</button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`
        .articulo-page { background: white; }
        .articulo-hero { height: 400px; position: relative; overflow: hidden; }
        .articulo-hero img { width: 100%; height: 100%; object-fit: cover; }
        .articulo-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(7,21,38,0.3), rgba(7,21,38,0.6));
        }
        .articulo-container {
          display: grid; grid-template-columns: 1fr 320px;
          max-width: 1280px; margin: 0 auto;
          padding: var(--spacing-2xl) var(--spacing-md);
          gap: var(--spacing-2xl);
        }
        .breadcrumb {
          display: flex; align-items: center; gap: var(--spacing-sm);
          font-size: var(--font-size-sm); color: var(--color-gray-400);
          margin-bottom: var(--spacing-lg);
        }
        .breadcrumb a { color: var(--color-orbit-blue); }
        .breadcrumb span { color: var(--color-gray-400); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .articulo-meta {
          display: flex; gap: var(--spacing-md); flex-wrap: wrap;
          color: var(--color-gray-400); font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
        }
        .articulo-meta span { display: flex; align-items: center; gap: 4px; }
        .articulo-categoria {
          background: rgba(55,114,166,0.1); color: var(--color-orbit-blue) !important;
          padding: 4px 10px; border-radius: 100px;
          font-weight: var(--font-weight-semibold);
        }
        .articulo-main h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: var(--spacing-xl); color: var(--color-midnight-navy); }
        .articulo-content { line-height: var(--line-height-relaxed); color: var(--color-gray-600); margin-bottom: var(--spacing-2xl); white-space: pre-wrap; }
        .articulo-content h2 { font-size: var(--font-size-2xl); color: var(--color-midnight-navy); margin: var(--spacing-xl) 0 var(--spacing-md); }
        .articulo-content h3 { font-size: var(--font-size-xl); color: var(--color-midnight-navy); margin: var(--spacing-lg) 0 var(--spacing-sm); }
        .articulo-content p { margin-bottom: var(--spacing-md); }
        .articulo-nav { margin-top: var(--spacing-xl); }

        .articulo-sidebar { display: flex; flex-direction: column; gap: var(--spacing-lg); }
        .sidebar-widget {
          background: var(--color-gray-100);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
        }
        .sidebar-widget h4 { margin-bottom: var(--spacing-md); color: var(--color-midnight-navy); font-size: var(--font-size-lg); }
        .relacionados { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .relacionado-item {
          display: flex; gap: var(--spacing-sm);
          text-decoration: none; align-items: flex-start;
          color: var(--color-gray-600); transition: color var(--transition-fast);
        }
        .relacionado-item:hover { color: var(--color-orbit-blue); }
        .relacionado-item img { width: 72px; height: 52px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
        .relacionado-item span { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); line-height: 1.4; }
        .newsletter-widget p { font-size: var(--font-size-sm); color: var(--color-gray-500); margin-bottom: var(--spacing-md); }
        .newsletter-widget input {
          width: 100%; padding: var(--spacing-sm);
          border: 1px solid var(--color-gray-200); border-radius: var(--radius-md);
          font-size: var(--font-size-sm); margin-bottom: var(--spacing-sm); outline: none;
        }
        .newsletter-widget input:focus { border-color: var(--color-orbit-blue); }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--color-gray-200); border-top-color: var(--color-orbit-blue); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) { .articulo-container { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .articulo-hero { height: 250px; } }
      `}</style>
    </div>
  );
}
