/*
  # SIRIO X - Schema Inicial
  
  1. Nuevas Tablas
    - `usuarios` - Usuarios del portal administrativo
    - `servicios` - Servicios dinámicos del sitio
    - `categorias_blog` - Categorías para artículos de blog
    - `articulos_blog` - Artículos del blog
    - `vacantes` - Vacantes de trabajo publicadas
    - `postulaciones` - Postulaciones a vacantes
    - `contactos` - Formularios de contacto del sitio
  
  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas restrictivas por rol de usuario
    - Autenticación mediante JWT
  
  3. Datos Iniciales
    - Usuario administrador de prueba
    - Servicios de ejemplo
    - Categorías de blog
*/

-- Tabla: usuarios (sin columna password, usamos auth de Supabase)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nombre text NOT NULL,
  rol text DEFAULT 'editor' CHECK (rol IN ('admin', 'editor', 'rrhh')),
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all users"
  ON usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Users can view their own profile"
  ON usuarios FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Tabla: servicios
CREATE TABLE IF NOT EXISTS servicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text NOT NULL,
  descripcion_larga text,
  icono_url text,
  activo boolean DEFAULT true,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON servicios FOR SELECT
  TO anon, authenticated
  USING (activo = true);

CREATE POLICY "Editors can manage services"
  ON servicios FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update services"
  ON servicios FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can delete services"
  ON servicios FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'editor')
    )
  );

-- Tabla: categorias_blog
CREATE TABLE IF NOT EXISTS categorias_blog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  descripcion text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categorias_blog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categorias_blog FOR SELECT
  TO anon, authenticated
  USING (true);

-- Tabla: articulos_blog
CREATE TABLE IF NOT EXISTS articulos_blog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  contenido text NOT NULL,
  imagen_url text,
  categoria_id uuid REFERENCES categorias_blog(id),
  autor_id uuid REFERENCES usuarios(id),
  publicado boolean DEFAULT false,
  fecha_publicacion timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articulos_blog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON articulos_blog FOR SELECT
  TO anon, authenticated
  USING (publicado = true);

CREATE POLICY "Editors can manage articles"
  ON articulos_blog FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update own articles"
  ON articulos_blog FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'editor')
    )
  );

-- Tabla: vacantes
CREATE TABLE IF NOT EXISTS vacantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  area text NOT NULL,
  modalidad text NOT NULL CHECK (modalidad IN ('remoto', 'presencial', 'hibrido')),
  ubicacion text,
  descripcion text NOT NULL,
  requisitos text,
  activa boolean DEFAULT true,
  created_by uuid REFERENCES usuarios(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vacantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vacancies"
  ON vacantes FOR SELECT
  TO anon, authenticated
  USING (activa = true);

CREATE POLICY "RRHH can manage vacancies"
  ON vacantes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH can update vacancies"
  ON vacantes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'rrhh')
    )
  );

-- Tabla: postulaciones
CREATE TABLE IF NOT EXISTS postulaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vacante_id uuid NOT NULL REFERENCES vacantes(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  cv_url text,
  mensaje text,
  estado text DEFAULT 'en_revision' CHECK (estado IN ('en_revision', 'apto', 'descartado')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE postulaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
  ON postulaciones FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "RRHH can view applications"
  ON postulaciones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'rrhh')
    )
  );

CREATE POLICY "RRHH can update applications"
  ON postulaciones FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'rrhh')
    )
  );

-- Tabla: contactos
CREATE TABLE IF NOT EXISTS contactos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  mensaje text NOT NULL,
  leido boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contactos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view contacts"
  ON contactos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admin can update contacts"
  ON contactos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admin can delete contacts"
  ON contactos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: notificaciones_contacto
CREATE TABLE IF NOT EXISTS notificaciones_contacto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nombre text NOT NULL,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notificaciones_contacto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notification contacts"
  ON notificaciones_contacto FOR SELECT
  TO anon, authenticated
  USING (activo = true);

CREATE POLICY "Admin can manage notification contacts"
  ON notificaciones_contacto FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: campanas_email
CREATE TABLE IF NOT EXISTS campanas_email (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  asunto text NOT NULL,
  contenido text NOT NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'error')),
  total_destinatarios integer DEFAULT 0,
  enviados integer DEFAULT 0,
  fallidos integer DEFAULT 0,
  created_by uuid REFERENCES usuarios(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campanas_email ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage email campaigns"
  ON campanas_email FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: campana_destinatarios
CREATE TABLE IF NOT EXISTS campana_destinatarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campana_id uuid NOT NULL REFERENCES campanas_email(id) ON DELETE CASCADE,
  email text NOT NULL,
  nombre text NOT NULL,
  datos jsonb DEFAULT '{}',
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviado', 'error')),
  enviado_en timestamptz,
  error_mensaje text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campana_destinatarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage campaign recipients"
  ON campana_destinatarios FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);
CREATE INDEX IF NOT EXISTS idx_articulos_slug ON articulos_blog(slug);
CREATE INDEX IF NOT EXISTS idx_articulos_publicado ON articulos_blog(publicado);
CREATE INDEX IF NOT EXISTS idx_articulos_categoria ON articulos_blog(categoria_id);
CREATE INDEX IF NOT EXISTS idx_vacantes_activa ON vacantes(activa);
CREATE INDEX IF NOT EXISTS idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_email ON postulaciones(email);
CREATE INDEX IF NOT EXISTS idx_notificaciones_activo ON notificaciones_contacto(activo);
CREATE INDEX IF NOT EXISTS idx_contactos_leido ON contactos(leido);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON contactos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campanas_estado ON campanas_email(estado);
CREATE INDEX IF NOT EXISTS idx_campanas_created_at ON campanas_email(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campana_destinatarios_campana ON campana_destinatarios(campana_id);
CREATE INDEX IF NOT EXISTS idx_campana_destinatarios_estado ON campana_destinatarios(estado);