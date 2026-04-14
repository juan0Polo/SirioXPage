import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Zap, Users, Code, Globe, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Servicio } from '../types';

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

const STATS = [
  { label: 'Clientes activos', value: 120, suffix: '+' },
  { label: 'Proyectos entregados', value: 350, suffix: '+' },
  { label: 'Años de experiencia', value: 8, suffix: '' },
  { label: 'Tecnologías dominadas', value: 40, suffix: '+' },
];

const VALORES = [
  {
    icon: <Zap size={32} />,
    titulo: '¿Qué hacemos?',
    desc: 'Desarrollamos soluciones tecnológicas a medida: software empresarial, plataformas web, APIs e integraciones que impulsan la eficiencia de tu negocio.',
  },
  {
    icon: <Shield size={32} />,
    titulo: '¿Por qué elegirnos?',
    desc: 'Combinamos experiencia técnica, metodologías ágiles y un equipo comprometido para entregar proyectos a tiempo, dentro del presupuesto y con la calidad que mereces.',
  },
  {
    icon: <TrendingUp size={32} />,
    titulo: '¿Cómo trabajamos?',
    desc: 'Escuchamos, analizamos, diseñamos y construimos. Cada proyecto comienza con entender tu negocio y termina con resultados medibles que generan valor real.',
  },
];

const CLIENTES = ['Empresa Alpha', 'Tech Corp', 'Innova Solutions', 'Digital Labs', 'Nexus Group', 'ProTech', 'CloudBase', 'DataSync'];

const TESTIMONIOS = [
  {
    texto: 'SIRIO X transformó por completo la operación de nuestra empresa. La plataforma que desarrollaron superó nuestras expectativas en rendimiento y usabilidad.',
    nombre: 'Samuel Flores',
    cargo: 'CTO, Tech Corp',
  },
  {
    texto: 'El equipo es altamente profesional y comprometido. Entregaron el proyecto a tiempo y con una calidad excepcional. Los recomendamos ampliamente.',
    nombre: 'Maicol Bustos',
    cargo: 'Directora General, Innova Solutions',
  },
  {
    texto: 'Gracias a SIRIO X automatizamos procesos críticos que antes consumían horas de trabajo. El ROI fue visible desde el primer mes.',
    nombre: 'Roberto Solis',
    cargo: 'Gerente de Operaciones, Nexus Group',
  },
];

export function HomePage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const [selectedTestimonio, setSelectedTestimonio] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchServicios();
    const timer = setInterval(() => {
      setSelectedTestimonio(prev => (prev + 1) % TESTIMONIOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  async function fetchServicios() {
    const { data } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden')
      .limit(3);
    if (data) setServicios(data);
  }

  const counts = STATS.map(s => useCountUp(s.value, 2000, statsVisible));

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-badge">Tecnología · B2B / B2C</div>
          <h1 className="hero-title">
            Soluciones tecnológicas que{' '}
            <span className="hero-highlight">impulsan tu negocio</span>
          </h1>
          <p className="hero-subtitle">
            Desarrollamos software empresarial, plataformas web y soluciones digitales a medida.
            Transformamos tus ideas en productos tecnológicos de alto impacto.
          </p>
          <div className="hero-actions">
            <Link to="/servicios" className="btn btn-primary btn-lg">
              Ver servicios <ArrowRight size={20} />
            </Link>
            <Link to="/contacto" className="btn btn-outline-light btn-lg">
              Contáctanos
            </Link>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-dot" />
        </div>
      </section>

      <section className="valores-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Nuestra propuesta</span>
            <h2>Por qué las empresas confían en SIRIO X</h2>
            <p>Combinamos talento humano, metodologías probadas y tecnología de vanguardia.</p>
          </div>
          <div className="grid grid-cols-3">
            {VALORES.map((v, i) => (
              <div key={i} className="valor-card">
                <div className="valor-icon">{v.icon}</div>
                <h3>{v.titulo}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {servicios.length > 0 && (
        <section className="servicios-destacados">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Qué ofrecemos</span>
              <h2>Nuestros servicios</h2>
              <p>Soluciones completas para cada etapa de tu transformación digital.</p>
            </div>
            <div className="grid grid-cols-3">
              {servicios.map(s => (
                <div key={s.id} className="servicio-card">
                  <div className="servicio-icon">
                    <Code size={28} />
                  </div>
                  <h4>{s.titulo}</h4>
                  <p>{s.descripcion}</p>
                  <Link to="/servicios" className="servicio-link">
                    Ver más <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
            <div className="section-cta">
              <Link to="/servicios" className="btn btn-primary">
                Ver todos los servicios <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-number">{counts[i]}{s.suffix}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="cta-final">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para transformar tu negocio?</h2>
            <p>Cuéntanos tu proyecto y te ayudamos a hacerlo realidad con tecnología de primer nivel.</p>
            <Link to="/contacto" className="btn btn-white btn-lg">
              Hablar con un experto <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="testimonios-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Lo que dicen</span>
            <h2>Clientes que confían en nosotros</h2>
          </div>
          <div className="testimonio-display">
            <div className="testimonio-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <blockquote>"{TESTIMONIOS[selectedTestimonio].texto}"</blockquote>
              <div className="testimonio-author">
                <div className="author-avatar">
                  {TESTIMONIOS[selectedTestimonio].nombre[0]}
                </div>
                <div>
                  <strong>{TESTIMONIOS[selectedTestimonio].nombre}</strong>
                  <span>{TESTIMONIOS[selectedTestimonio].cargo}</span>
                </div>
              </div>
            </div>
            <div className="testimonio-dots">
              {TESTIMONIOS.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === selectedTestimonio ? 'active' : ''}`}
                  onClick={() => setSelectedTestimonio(i)}
                />
              ))}
            </div>
          </div>

          <div className="clientes-carousel">
            <p className="clientes-label">Empresas que ya trabajan con nosotros</p>
            <div className="clientes-track">
              {[...CLIENTES, ...CLIENTES].map((c, i) => (
                <div key={i} className="cliente-logo">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <style>{`
        .home-page { overflow-x: hidden; }

        .hero {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-midnight-navy) 0%, var(--color-deep-ocean) 50%, var(--color-stellar-blue) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
        }
        .star {
          position: absolute;
          background: var(--color-sirius-light);
          border-radius: 50%;
          opacity: 0.6;
          animation: twinkle 3s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(1); }
          to { opacity: 0.8; transform: scale(1.5); }
        }
        .hero-content {
          text-align: center;
          max-width: 800px;
          padding: var(--spacing-2xl) var(--spacing-md);
          position: relative;
          z-index: 1;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(109, 180, 242, 0.15);
          border: 1px solid rgba(109, 180, 242, 0.3);
          color: var(--color-sirius-light);
          padding: 6px 16px;
          border-radius: 100px;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--spacing-md);
          letter-spacing: 0.05em;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: var(--font-weight-bold);
          color: var(--color-white);
          line-height: 1.15;
          margin-bottom: var(--spacing-md);
        }
        .hero-highlight {
          background: linear-gradient(135deg, var(--color-sirius-light), var(--color-orbit-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: var(--font-size-lg);
          color: rgba(255,255,255,0.75);
          margin-bottom: var(--spacing-xl);
          line-height: var(--line-height-relaxed);
        }
        .hero-actions {
          display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap;
        }
        .btn-outline-light {
          display: inline-flex; align-items: center; gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: var(--radius-md);
          color: var(--color-white);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-lg);
          transition: all var(--transition-normal);
          text-decoration: none;
        }
        .btn-outline-light:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--color-white);
          color: var(--color-white);
        }
        .hero-scroll-hint {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
        }
        .scroll-dot {
          width: 8px; height: 8px;
          background: var(--color-sirius-light);
          border-radius: 50%;
          animation: bounce 2s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(12px); opacity: 0.4; }
        }

        .valores-section { padding: var(--spacing-3xl) 0; }
        .section-header { text-align: center; margin-bottom: var(--spacing-2xl); }
        .section-tag {
          display: inline-block;
          color: var(--color-orbit-blue);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-sm);
        }
        .section-header h2 { margin-bottom: var(--spacing-sm); }
        .section-header p { color: var(--color-gray-500); font-size: var(--font-size-lg); max-width: 600px; margin: 0 auto; }

        .valor-card {
          background: var(--color-white);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          transition: all var(--transition-normal);
        }
        .valor-card:hover {
          border-color: var(--color-sirius-light);
          box-shadow: 0 0 0 4px rgba(109, 180, 242, 0.08), var(--shadow-xl);
          transform: translateY(-4px);
        }
        .valor-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, rgba(55, 114, 166, 0.1), rgba(109, 180, 242, 0.15));
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-orbit-blue);
          margin-bottom: var(--spacing-md);
        }
        .valor-card h3 { font-size: var(--font-size-xl); margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .valor-card p { color: var(--color-gray-500); line-height: var(--line-height-relaxed); }

        .servicios-destacados { padding: var(--spacing-3xl) 0; background: var(--color-gray-100); }
        .servicio-card {
          background: var(--color-white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-xl);
          transition: all var(--transition-normal);
          border: 1px solid var(--color-gray-200);
        }
        .servicio-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); }
        .servicio-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light));
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-white);
          margin-bottom: var(--spacing-md);
        }
        .servicio-card h4 { font-size: var(--font-size-xl); margin-bottom: var(--spacing-sm); color: var(--color-midnight-navy); }
        .servicio-card p { color: var(--color-gray-500); margin-bottom: var(--spacing-md); }
        .servicio-link {
          display: inline-flex; align-items: center; gap: 4px;
          color: var(--color-orbit-blue);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm);
          transition: gap var(--transition-fast);
        }
        .servicio-link:hover { gap: 8px; }
        .section-cta { text-align: center; margin-top: var(--spacing-xl); }

        .stats-section {
          background: linear-gradient(135deg, var(--color-midnight-navy), var(--color-deep-ocean));
          padding: var(--spacing-3xl) 0;
        }
        .stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-xl);
          text-align: center;
        }
        .stat-item { padding: var(--spacing-lg); }
        .stat-number {
          display: block;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: var(--font-weight-bold);
          color: var(--color-sirius-light);
          line-height: 1;
          margin-bottom: var(--spacing-sm);
        }
        .stat-label { color: rgba(255,255,255,0.7); font-size: var(--font-size-base); }

        .testimonios-section { padding: var(--spacing-3xl) 0; }
        .testimonio-display { max-width: 700px; margin: 0 auto var(--spacing-3xl); }
        .testimonio-card {
          background: var(--color-white);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-lg);
        }
        .stars { color: #F59E0B; display: flex; gap: 4px; margin-bottom: var(--spacing-md); }
        .testimonio-card blockquote {
          font-size: var(--font-size-lg);
          color: var(--color-midnight-navy);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--spacing-lg);
          font-style: italic;
        }
        .testimonio-author { display: flex; align-items: center; gap: var(--spacing-md); }
        .author-avatar {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: var(--font-size-lg);
          flex-shrink: 0;
        }
        .testimonio-author strong { display: block; color: var(--color-midnight-navy); }
        .testimonio-author span { font-size: var(--font-size-sm); color: var(--color-gray-500); }
        .testimonio-dots { display: flex; gap: var(--spacing-sm); justify-content: center; margin-top: var(--spacing-lg); }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--color-gray-300); border: none; cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dot.active { background: var(--color-orbit-blue); width: 24px; border-radius: 4px; }

        .clientes-carousel { overflow: hidden; }
        .clientes-label { text-align: center; color: var(--color-gray-400); font-size: var(--font-size-sm); margin-bottom: var(--spacing-lg); text-transform: uppercase; letter-spacing: 0.1em; }
        .clientes-track {
          display: flex; gap: var(--spacing-xl);
          animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .cliente-logo {
          flex-shrink: 0;
          background: var(--color-gray-100);
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm) var(--spacing-lg);
          color: var(--color-gray-500);
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-sm);
          white-space: nowrap;
        }

        .cta-final {
          background: var(--color-orbit-blue);
          padding: var(--spacing-3xl) 0;
        }
        .cta-content { text-align: center; }
        .cta-content h2 { color: var(--color-white); font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: var(--spacing-md); }
        .cta-content p { color: rgba(255,255,255,0.85); font-size: var(--font-size-lg); margin-bottom: var(--spacing-xl); }
        .btn-white {
          display: inline-flex; align-items: center; gap: var(--spacing-sm);
          background: var(--color-white);
          color: var(--color-orbit-blue);
          padding: var(--spacing-md) var(--spacing-xl);
          border-radius: var(--radius-md);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-lg);
          border: none; cursor: pointer;
          transition: all var(--transition-normal);
          text-decoration: none;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); color: var(--color-stellar-blue); }

        .loading-screen {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
        }
        .spinner {
          width: 40px; height: 40px;
          border: 3px solid var(--color-gray-200);
          border-top-color: var(--color-orbit-blue);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-actions { flex-direction: column; align-items: center; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
