export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'editor' | 'rrhh' | 'usuario';
  activo: boolean;
  created_at: string;
}

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  descripcion_larga: string;
  icono_url: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriaBlog {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
}

export interface ArticuloBlog {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  imagen_url: string;
  categoria_id: string;
  autor_id: string;
  publicado: boolean;
  fecha_publicacion: string;
  created_at: string;
  updated_at: string;
}

export interface Vacante {
  id: string;
  titulo: string;
  area: string;
  modalidad: 'remoto' | 'presencial' | 'hibrido';
  ubicacion: string;
  descripcion: string;
  requisitos: string;
  activa: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Postulacion {
  id: string;
  vacante_id: string;
  nombre: string;
  email: string;
  telefono: string;
  cv_url: string;
  mensaje: string;
  estado: 'en_revision' | 'apto' | 'descartado';
  created_at: string;
  updated_at: string;
}

export interface ContactoFormulario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

export interface NotificacionContacto {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
