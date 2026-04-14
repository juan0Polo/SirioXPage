import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Award, Globe } from 'lucide-react';

const EQUIPO = [
  { nombre: 'Alexandra Torres', cargo: 'CEO & Co-Fundadora', img: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { nombre: 'Miguel Ángel Ruiz', cargo: 'CTO', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { nombre: 'Laura Jiménez', cargo: 'Directora de Diseño', img: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { nombre: 'Carlos Vega', cargo: 'Lead Developer', img: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

const VALORES_EMPRESA = [
  { icon: <Target size={24} />, titulo: 'Orientación a resultados', desc: 'Cada proyecto que entregamos genera valor medible para nuestros clientes.' },
  { icon: <Eye size={24} />, titulo: 'Transparencia', desc: 'Comunicación clara y honesta en cada etapa del proyecto.' },
  { icon: <Heart size={24} />, titulo: 'Pasión por la tecnología', desc: 'Amamos lo que hacemos y eso se refleja en la calidad de nuestro trabajo.' },
  { icon: <Users size={24} />, titulo: 'Colaboración', desc: 'Trabajamos como un equipo extendido del cliente, no solo como proveedor.' },
];

export function SobreNosotrosPage() {
  return (
    <div className="page">
      <section className="sobre-hero">
        <div className="hero-overlay" />
        <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Equipo SIRIO X" />
        <div className="container sobre-hero-content">
          <h1>Sobre nosotros</h1>
          <p>Somos SIRIO X, una empresa de tecnología comprometida con transformar negocios a través de soluciones digitales innovadoras.</p>
        </div>
      </section>

      <section className="historia-section">
        <div className="container historia-grid">
          <div className="historia-text">
            <span className="section-tag">Nuestra historia</span>
            <h2>Nacimos para hacer diferente las cosas</h2>
            <p>SIRIO X nació en 2018 con una visión clara: que la tecnología de alto nivel no debería ser exclusiva de las grandes corporaciones. Fundada por un grupo de ingenieros y diseñadores apasionados, comenzamos desarrollando soluciones para startups y medianas empresas.</p>
            <p>Con el tiempo, nuestra reputación por la calidad y el cumplimiento nos abrió las puertas de empresas más grandes. Hoy somos un equipo multidisciplinario con proyectos en más de 10 países.</p>
            <Link to="/contacto" className="btn btn-primary">Trabajemos juntos</Link>
          </div>
          <div className="historia-image">
            <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Historia SIRIO X" />
          </div>
        </div>
      </section>

      <section className="mision-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon"><Target size={32} /></div>
              <h3>Misión</h3>
              <p>Desarrollar soluciones tecnológicas que transformen la operación de nuestros clientes, generando eficiencia, crecimiento y ventajas competitivas sostenibles en el mercado digital.</p>
            </div>
            <div className="mv-card">
              <div className="mv-icon"><Eye size={32} /></div>
              <h3>Visión</h3>
              <p>Ser el socio tecnológico de referencia para empresas en América Latina que buscan crecer con tecnología de primer nivel, equipos de talento excepcional y metodologías ágiles comprobadas.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="valores-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <span className="section-tag">Quiénes somos</span>
            <h2>Valores que nos definen</h2>
          </div>
          <div className="valores-grid">
            {VALORES_EMPRESA.map((v, i) => (
              <div key={i} className="valor-item">
                <div className="valor-icon-small">{v.icon}</div>
                <div>
                  <h4>{v.titulo}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="equipo-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
            <span className="section-tag">El equipo</span>
            <h2>Las personas detrás de SIRIO X</h2>
          </div>
          <div className="equipo-grid">
            {EQUIPO.map((p, i) => (
              <div key={i} className="equipo-card">
                <div className="equipo-img">
                  <img src={p.img} alt={p.nombre} />
                </div>
                <h4>{p.nombre}</h4>
                <span>{p.cargo}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="cifras-section">
        <div className="container">
          <div className="cifras-grid">
            {[
              { icon: <Users size={28} />, valor: '120+', label: 'Clientes satisfechos' },
              { icon: <Award size={28} />, valor: '350+', label: 'Proyectos completados' },
              { icon: <Globe size={28} />, valor: '10+', label: 'Países' },
              { icon: <Heart size={28} />, valor: '98%', label: 'Satisfacción del cliente' },
            ].map((c, i) => (
              <div key={i} className="cifra-item">
                <div className="cifra-icon">{c.icon}</div>
                <span className="cifra-valor">{c.valor}</span>
                <span className="cifra-label">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <style>{`
        .sobre-hero { position: relative; height: 420px; display: flex; align-items: center; overflow: hidden; }
        .sobre-hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(7,21,38,0.85), rgba(21,50,89,0.75)); z-index: 1; }
        .sobre-hero-content { position: relative; z-index: 2; color: white; }
        .sobre-hero-content h1 { color: white; font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: var(--spacing-md); }
        .sobre-hero-content p { color: rgba(255,255,255,0.8); font-size: var(--font-size-lg); max-width: 600px; }

        .section-tag { display: inline-block; color: var(--color-orbit-blue); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: var(--spacing-sm); }

        .historia-section { padding: var(--spacing-3xl) 0; }
        .historia-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3xl); align-items: center; }
        .historia-text h2 { margin-bottom: var(--spacing-md); }
        .historia-text p { color: var(--color-gray-500); margin-bottom: var(--spacing-md); line-height: var(--line-height-relaxed); }
        .historia-text .btn { margin-top: var(--spacing-md); }
        .historia-image img { width: 100%; border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); }

        .mision-vision { padding: var(--spacing-3xl) 0; background: var(--color-gray-100); }
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); }
        .mv-card { background: white; border-radius: var(--radius-xl); padding: var(--spacing-2xl); border-left: 4px solid var(--color-orbit-blue); }
        .mv-icon { width: 56px; height: 56px; background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; color: white; margin-bottom: var(--spacing-md); }
        .mv-card h3 { margin-bottom: var(--spacing-md); }
        .mv-card p { color: var(--color-gray-500); line-height: var(--line-height-relaxed); }

        .valores-section { padding: var(--spacing-3xl) 0; }
        .valores-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); }
        .valor-item { display: flex; gap: var(--spacing-md); align-items: flex-start; padding: var(--spacing-lg); border: 1px solid var(--color-gray-200); border-radius: var(--radius-xl); transition: all var(--transition-normal); }
        .valor-item:hover { border-color: var(--color-sirius-light); box-shadow: var(--shadow-lg); }
        .valor-icon-small { width: 48px; height: 48px; background: linear-gradient(135deg, rgba(55,114,166,0.1), rgba(109,180,242,0.15)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-orbit-blue); flex-shrink: 0; }
        .valor-item h4 { margin-bottom: 4px; color: var(--color-midnight-navy); }
        .valor-item p { color: var(--color-gray-500); font-size: var(--font-size-sm); }

        .equipo-section { padding: var(--spacing-3xl) 0; background: var(--color-gray-100); }
        .equipo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-lg); }
        .equipo-card { background: white; border-radius: var(--radius-xl); overflow: hidden; text-align: center; padding-bottom: var(--spacing-lg); transition: all var(--transition-normal); }
        .equipo-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .equipo-img { height: 200px; overflow: hidden; }
        .equipo-img img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
        .equipo-card:hover .equipo-img img { transform: scale(1.05); }
        .equipo-card h4 { margin: var(--spacing-md) var(--spacing-md) 4px; color: var(--color-midnight-navy); }
        .equipo-card span { font-size: var(--font-size-sm); color: var(--color-orbit-blue); font-weight: var(--font-weight-semibold); }

        .cifras-section { padding: var(--spacing-3xl) 0; background: linear-gradient(135deg, var(--color-midnight-navy), var(--color-deep-ocean)); }
        .cifras-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-xl); text-align: center; }
        .cifra-item { padding: var(--spacing-lg); }
        .cifra-icon { color: var(--color-sirius-light); margin: 0 auto var(--spacing-sm); }
        .cifra-valor { display: block; font-size: 2.5rem; font-weight: var(--font-weight-bold); color: var(--color-white); line-height: 1; margin-bottom: var(--spacing-sm); }
        .cifra-label { color: rgba(255,255,255,0.7); font-size: var(--font-size-sm); }

        .section-header { text-align: center; margin-bottom: var(--spacing-2xl); }

        @media (max-width: 1024px) { .equipo-grid { grid-template-columns: repeat(2, 1fr); } .cifras-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .historia-grid { grid-template-columns: 1fr; } .mv-grid { grid-template-columns: 1fr; } .valores-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .equipo-grid { grid-template-columns: 1fr; } .cifras-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
