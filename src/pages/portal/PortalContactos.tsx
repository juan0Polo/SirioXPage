import React, { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Eye, EyeOff, Filter, MessageCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Contacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

type FilterType = 'todos' | 'noLeidos' | 'leidos';

export function PortalContactos() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('todos');

  useEffect(() => {
    fetchContactos();
  }, []);

  async function fetchContactos() {
    try {
      const data = await api.contactos.list();
      setContactos(data as Contacto[]);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar los contactos');
      setContactos([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleLeido(contacto: Contacto) {
    try {
      await api.contactos.update(contacto.id, { leido: !contacto.leido });
      setContactos(prev =>
        prev.map(c => c.id === contacto.id ? { ...c, leido: !c.leido } : c)
      );
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el contacto');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este mensaje de contacto?')) return;
    try {
      await api.contactos.delete(id);
      setContactos(prev => prev.filter(c => c.id !== id));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el contacto');
    }
  }

  function openModal(contacto: Contacto) {
    setSelectedContacto(contacto);
    setShowModal(true);
    if (!contacto.leido) {
      toggleLeido(contacto);
    }
  }

  function formatDate(date: string) {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  }

  function formatFullDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function truncateMessage(text: string, length: number = 100): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  if (!user || user.rol !== 'admin') {
    return (
      <div className="portal-page">
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden ver los contactos.</p>
        </div>
      </div>
    );
  }

  const unreadCount = contactos.filter(c => !c.leido).length;
  const filteredContactos = contactos.filter(c => {
    if (filterType === 'noLeidos') return !c.leido;
    if (filterType === 'leidos') return c.leido;
    return true;
  });

  return (
    <div className="portal-page">
      <div className="portal-page-header">
        <div>
          <h1>Contactos Recibidos</h1>
          <p>Gestiona los mensajes enviados a través del formulario de contacto.</p>
        </div>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          alignItems: 'flex-end'
        }}>
          <div>
            {unreadCount > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
              }}>
                🔔 {unreadCount} sin leer
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
          color: '#DC2626',
          marginBottom: 'var(--spacing-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setFilterType('todos')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            background: filterType === 'todos' ? '#2563EB' : '#E5E7EB',
            color: filterType === 'todos' ? 'white' : '#374151',
            transition: 'all 0.3s ease'
          }}
        >
          <Filter size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
          Todos ({contactos.length})
        </button>
        <button
          onClick={() => setFilterType('noLeidos')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            background: filterType === 'noLeidos' ? '#3B82F6' : '#E5E7EB',
            color: filterType === 'noLeidos' ? 'white' : '#374151',
            transition: 'all 0.3s ease'
          }}
        >
          <Eye size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
          Sin Leer ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType('leidos')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            background: filterType === 'leidos' ? '#10B981' : '#E5E7EB',
            color: filterType === 'leidos' ? 'white' : '#374151',
            transition: 'all 0.3s ease'
          }}
        >
          <EyeOff size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }} />
          Leídos ({contactos.filter(c => c.leido).length})
        </button>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          color: 'var(--color-text-secondary)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--spacing-md)',
          }} />
          Cargando contactos...
        </div>
      ) : filteredContactos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed #CBD5E1'
        }}>
          <MessageCircle size={48} style={{
            margin: '0 auto',
            color: '#94A3B8',
            marginBottom: 'var(--spacing-md)'
          }} />
          <p style={{ color: '#64748B', fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0' }}>
            {filterType === 'noLeidos'
              ? 'No hay mensajes sin leer'
              : filterType === 'leidos'
                ? 'No hay mensajes leídos'
                : 'No hay mensajes de contacto aún'}
          </p>
          <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
            Los mensajes aparecerán aquí cuando se reciban nuevos contactos.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {filteredContactos.map(contacto => (
            <div
              key={contacto.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${contacto.leido ? '#E5E7EB' : '#DBEAFE'}`,
                padding: 'var(--spacing-lg)',
                boxShadow: contacto.leido
                  ? '0 1px 3px rgba(0,0,0,0.1)'
                  : '0 4px 12px rgba(59, 130, 246, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = contacto.leido
                  ? '0 1px 3px rgba(0,0,0,0.1)'
                  : '0 4px 12px rgba(59, 130, 246, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Indicador de estado */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: contacto.leido
                  ? '#10B981'
                  : 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)'
              }} />

              {/* Header de la tarjeta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1E293B'
                  }}>
                    {contacto.nombre}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '600'
                  }}>
                    {formatDate(contacto.created_at)}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  <span style={{
                    background: contacto.leido ? '#D1D5DB' : '#DBEAFE',
                    color: contacto.leido ? '#4B5563' : '#0C4A6E',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {contacto.leido ? '✓ Leído' : '● Nuevo'}
                  </span>
                </div>
              </div>

              {/* Información de contacto */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)',
                paddingBottom: 'var(--spacing-md)',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px'
                }}>
                  <Mail size={16} style={{ color: '#3B82F6', flexShrink: 0 }} />
                  <a href={`mailto:${contacto.email}`} style={{
                    color: '#3B82F6',
                    textDecoration: 'none',
                    fontWeight: '500',
                    wordBreak: 'break-all'
                  }}>
                    {contacto.email}
                  </a>
                </div>
                {contacto.telefono && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px'
                  }}>
                    <Phone size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                    <a href={`tel:${contacto.telefono}`} style={{
                      color: '#10B981',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}>
                      {contacto.telefono}
                    </a>
                  </div>
                )}
              </div>

              {/* Preview del mensaje */}
              <div style={{
                marginBottom: 'var(--spacing-md)',
                paddingBottom: 'var(--spacing-md)',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#475569',
                  lineHeight: '1.5',
                  fontStyle: 'italic'
                }}>
                  "{truncateMessage(contacto.mensaje)}"
                </p>
              </div>

              {/* Acciones */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-xs)',
                justifyContent: 'space-between'
              }}>
                <button
                  onClick={() => openModal(contacto)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1D4ED8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2563EB';
                  }}
                  title="Ver detalles completos"
                >
                  Ver Mensaje
                </button>
                <button
                  onClick={() => toggleLeido(contacto)}
                  style={{
                    padding: '8px 12px',
                    background: contacto.leido ? '#FEE2E2' : '#DBEAFE',
                    color: contacto.leido ? '#DC2626' : '#0C4A6E',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  title={contacto.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                >
                  {contacto.leido ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(contacto.id)}
                  style={{
                    padding: '8px 12px',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  title="Eliminar contacto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {showModal && selectedContacto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              padding: 'var(--spacing-lg)',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0' }}>Detalles del Mensaje</h2>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                  {formatFullDate(selectedContacto.created_at)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '28px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 'var(--spacing-lg)' }}>
              {/* Información de contacto en dos columnas */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-lg)',
                paddingBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748B',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    👤 Nombre
                  </label>
                  <p style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1E293B'
                  }}>
                    {selectedContacto.nombre}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748B',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    📅 Fecha y Hora
                  </label>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#475569'
                  }}>
                    {formatFullDate(selectedContacto.created_at)}
                  </p>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748B',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ✉️ Email
                  </label>
                  <a href={`mailto:${selectedContacto.email}`} style={{
                    color: '#2563EB',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    wordBreak: 'break-all'
                  }}>
                    {selectedContacto.email}
                  </a>
                </div>

                {selectedContacto.telefono && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#64748B',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      📞 Teléfono
                    </label>
                    <a href={`tel:${selectedContacto.telefono}`} style={{
                      color: '#10B981',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {selectedContacto.telefono}
                    </a>
                  </div>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#64748B',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  💬 Mensaje Completo
                </label>
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-md)',
                  color: '#334155',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {selectedContacto.mensaje}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-lg)',
              borderTop: '1px solid #E5E7EB',
              background: '#F8FAFC'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #D1D5DB',
                  background: 'white',
                  color: '#374151',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedContacto.id);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
