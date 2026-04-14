-- ============================================================
-- SIRIO X - Schema para PostgreSQL local
-- Ejecutar como: psql -U postgres -d siriox -f schema.sql
-- ============================================================

-- Crear base de datos (ejecutar conectado a postgres):
-- CREATE DATABASE siriox;
-- \c siriox

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  rol         TEXT NOT NULL DEFAULT 'editor'
                CHECK (rol IN ('admin', 'editor', 'rrhh')),
  activo      BOOLEAN NOT NULL DEFAULT true,
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: servicios
-- ============================================================
CREATE TABLE IF NOT EXISTS servicios (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo           TEXT NOT NULL,
  descripcion      TEXT NOT NULL DEFAULT '',
  descripcion_larga TEXT NOT NULL DEFAULT '',
  icono_url        TEXT NOT NULL DEFAULT '',
  activo           BOOLEAN NOT NULL DEFAULT true,
  orden            INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: categorias_blog
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias_blog (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: articulos_blog
-- ============================================================
CREATE TABLE IF NOT EXISTS articulos_blog (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo            TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  contenido         TEXT NOT NULL DEFAULT '',
  imagen_url        TEXT,
  categoria_id      UUID REFERENCES categorias_blog(id) ON DELETE SET NULL,
  autor_id          UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  publicado         BOOLEAN NOT NULL DEFAULT false,
  fecha_publicacion TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: vacantes
-- ============================================================
CREATE TABLE IF NOT EXISTS vacantes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  area        TEXT NOT NULL DEFAULT '',
  modalidad   TEXT NOT NULL DEFAULT 'hibrido'
                CHECK (modalidad IN ('remoto', 'presencial', 'hibrido')),
  ubicacion   TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT '',
  requisitos  TEXT NOT NULL DEFAULT '',
  activa      BOOLEAN NOT NULL DEFAULT true,
  created_by  UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: postulaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS postulaciones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacante_id  UUID REFERENCES vacantes(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefono    TEXT,
  cv_url      TEXT,
  mensaje     TEXT,
  estado      TEXT NOT NULL DEFAULT 'en_revision'
                CHECK (estado IN ('en_revision', 'apto', 'descartado')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: contactos
-- ============================================================
CREATE TABLE IF NOT EXISTS contactos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefono    TEXT,
  mensaje     TEXT NOT NULL,
  leido       BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: notificaciones_contacto
-- ============================================================
CREATE TABLE IF NOT EXISTS notificaciones_contacto (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  nombre      TEXT NOT NULL,
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: campanas_email
-- ============================================================
CREATE TABLE IF NOT EXISTS campanas_email (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                TEXT NOT NULL,
  asunto                TEXT NOT NULL,
  contenido             TEXT NOT NULL,
  estado                TEXT NOT NULL DEFAULT 'pendiente'
                          CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'error')),
  total_destinatarios   INTEGER NOT NULL DEFAULT 0,
  enviados              INTEGER NOT NULL DEFAULT 0,
  fallidos              INTEGER NOT NULL DEFAULT 0,
  created_by            UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: campana_destinatarios
-- ============================================================
CREATE TABLE IF NOT EXISTS campana_destinatarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campana_id  UUID REFERENCES campanas_email(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  datos       JSONB NOT NULL DEFAULT '{}',
  estado      TEXT NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'enviado', 'error')),
  enviado_en  TIMESTAMPTZ,
  error_mensaje TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_servicios_activo       ON servicios(activo);
CREATE INDEX IF NOT EXISTS idx_articulos_slug         ON articulos_blog(slug);
CREATE INDEX IF NOT EXISTS idx_articulos_publicado    ON articulos_blog(publicado);
CREATE INDEX IF NOT EXISTS idx_articulos_categoria    ON articulos_blog(categoria_id);
CREATE INDEX IF NOT EXISTS idx_vacantes_activa        ON vacantes(activa);
CREATE INDEX IF NOT EXISTS idx_postulaciones_vacante  ON postulaciones(vacante_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_email    ON postulaciones(email);
CREATE INDEX IF NOT EXISTS idx_contactos_leido        ON contactos(leido);
CREATE INDEX IF NOT EXISTS idx_contactos_created_at   ON contactos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campanas_estado        ON campanas_email(estado);
CREATE INDEX IF NOT EXISTS idx_campanas_created_at    ON campanas_email(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campana_destinatarios_campana ON campana_destinatarios(campana_id);
CREATE INDEX IF NOT EXISTS idx_campana_destinatarios_estado ON campana_destinatarios(estado);

-- ============================================================
-- USUARIO ADMINISTRADOR INICIAL
-- Contraseña: Admin2026!
-- IMPORTANTE: Cambia esta contraseña en produccion.
-- Hash generado con bcrypt rounds=12
-- Para regenerar: node -e "const b=require('bcryptjs');b.hash('Admin2026!',12).then(console.log)"
-- ============================================================
INSERT INTO usuarios (nombre, email, rol, activo, password_hash)
VALUES (
  'Administrador',
  'admin@siriox.com',
  'admin',
  true,
  '$2a$12$2y6de0oJIdSXqD0Ysl/QYuJX1D4etqM7O2tZIgas/PyUdrv8buCp2'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- CATEGORIAS DE BLOG DE EJEMPLO
-- ============================================================
INSERT INTO categorias_blog (nombre, slug, descripcion) VALUES
  ('Desarrollo', 'desarrollo', 'Artículos sobre desarrollo de software'),
  ('Empresas', 'empresas', 'Transformación digital y empresas'),
  ('Seguridad', 'seguridad', 'Ciberseguridad y buenas prácticas')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ACTUALIZAR CONTRASEÑA DE USUARIO ADMINISTRADOR
-- ============================================================
UPDATE usuarios 
SET password_hash = '$2a$12$2y6de0oJIdSXqD0Ysl/QYuJX1D4etqM7O2tZIgas/PyUdrv8buCp2'
WHERE email = 'admin@siriox.com';
