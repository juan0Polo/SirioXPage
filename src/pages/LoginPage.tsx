import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/portal');
    } catch {
      setError('Credenciales incorrectas. Por favor verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetSent(true);
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="login-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
          }} />
        ))}
      </div>

      <div className="login-container">
        <Link to="/" className="login-logo">
          <div className="login-logo-icon">S</div>
          <span>SIRIO X</span>
        </Link>

        <div className="login-card">
          {resetMode ? (
            resetSent ? (
              <div className="reset-success">
                <h2>Revisa tu correo</h2>
                <p>Hemos enviado un enlace de recuperación a <strong>{email}</strong>. El enlace expira en 24 horas.</p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { setResetMode(false); setResetSent(false); }}>
                  Volver al login
                </button>
              </div>
            ) : (
              <>
                <div className="login-header">
                  <h2>Recuperar contraseña</h2>
                  <p>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
                </div>
                <form onSubmit={handleReset} className="login-form">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoFocus />
                  </div>
                  <button type="submit" className="btn btn-primary login-btn">
                    Enviar enlace de recuperación
                  </button>
                  <button type="button" className="link-btn" onClick={() => setResetMode(false)}>
                    Volver al login
                  </button>
                </form>
              </>
            )
          ) : (
            <>
              <div className="login-header">
                <h2>Bienvenido de vuelta</h2>
                <p>Ingresa tus credenciales para acceder al portal.</p>
              </div>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@siriox.com"
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      autoComplete="current-password"
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="login-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar al portal'}
                </button>
                <button type="button" className="link-btn" onClick={() => setResetMode(true)}>
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            </>
          )}
        </div>

        <Link to="/" className="back-link">
          ← Volver al sitio
        </Link>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-midnight-navy) 0%, var(--color-deep-ocean) 50%, var(--color-stellar-blue) 100%);
          display: flex; align-items: center; justify-content: center;
          padding: var(--spacing-lg);
          position: relative; overflow: hidden;
        }
        .login-bg { position: absolute; inset: 0; pointer-events: none; }
        .login-star {
          position: absolute; background: var(--color-sirius-light); border-radius: 50%; opacity: 0.5;
          animation: twinkle 3s ease-in-out infinite alternate;
        }
        @keyframes twinkle { from { opacity: 0.2; } to { opacity: 0.7; } }

        .login-container {
          display: flex; flex-direction: column; align-items: center; gap: var(--spacing-lg);
          width: 100%; max-width: 440px; position: relative; z-index: 1;
        }
        .login-logo {
          display: flex; align-items: center; gap: var(--spacing-sm);
          text-decoration: none; color: white;
          font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);
        }
        .login-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, var(--color-orbit-blue), var(--color-sirius-light));
          border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: var(--font-size-xl);
        }

        .login-card {
          width: 100%; background: white; border-radius: var(--radius-xl);
          padding: var(--spacing-2xl); box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .login-header { margin-bottom: var(--spacing-xl); }
        .login-header h2 { margin-bottom: var(--spacing-xs); font-size: var(--font-size-2xl); }
        .login-header p { color: var(--color-gray-500); }

        .login-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
        .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
        .form-group label { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-midnight-navy); }
        .form-group input {
          padding: var(--spacing-sm); border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-md); font-size: var(--font-size-base); outline: none;
          transition: border-color var(--transition-fast); width: 100%;
        }
        .form-group input:focus { border-color: var(--color-orbit-blue); }
        .password-input { position: relative; }
        .password-input input { padding-right: 44px; width: 100%; }
        .toggle-password {
          position: absolute; right: var(--spacing-sm); top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--color-gray-400);
          display: flex; align-items: center;
        }
        .toggle-password:hover { color: var(--color-orbit-blue); }

        .login-error {
          display: flex; align-items: center; gap: var(--spacing-sm);
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: var(--radius-md); padding: var(--spacing-sm);
          color: #DC2626; font-size: var(--font-size-sm);
        }
        .login-btn { width: 100%; justify-content: center; padding: 14px; font-size: var(--font-size-base); }
        .link-btn {
          background: none; border: none; cursor: pointer;
          color: var(--color-orbit-blue); font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold); text-align: center;
          transition: color var(--transition-fast);
        }
        .link-btn:hover { color: var(--color-stellar-blue); }

        .reset-success { text-align: center; padding: var(--spacing-sm); }
        .reset-success h2 { margin-bottom: var(--spacing-md); }
        .reset-success p { color: var(--color-gray-500); margin-bottom: var(--spacing-xl); line-height: var(--line-height-relaxed); }

        .back-link { color: rgba(255,255,255,0.6); font-size: var(--font-size-sm); text-decoration: none; transition: color var(--transition-fast); }
        .back-link:hover { color: var(--color-sirius-light); }
      `}</style>
    </div>
  );
}
