import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, nombre, rol, activo, created_at, updated_at FROM usuarios ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.post('/', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { nombre, email, rol, activo, password } = _req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña requeridos' });
    }

    const exists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, rol, activo, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, nombre, rol, activo, created_at`,
      [nombre, email.toLowerCase(), rol || 'editor', activo ?? true, password_hash]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { nombre, rol, activo } = req.body;
    const result = await pool.query(
      `UPDATE usuarios SET nombre=$1, rol=$2, activo=$3, updated_at=NOW()
       WHERE id=$4 RETURNING id, email, nombre, rol, activo, created_at, updated_at`,
      [nombre, rol, activo, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

router.get('/stats', requireAuth, async (_req: Request, res: Response) => {
  try {
    const [s, a, v, p, c] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM servicios WHERE activo = true'),
      pool.query('SELECT COUNT(*) FROM articulos_blog WHERE publicado = true'),
      pool.query('SELECT COUNT(*) FROM vacantes WHERE activa = true'),
      pool.query('SELECT COUNT(*) FROM postulaciones'),
      pool.query('SELECT COUNT(*) FROM contactos'),
    ]);
    return res.json({
      servicios: parseInt(s.rows[0].count),
      articulos: parseInt(a.rows[0].count),
      vacantes: parseInt(v.rows[0].count),
      postulaciones: parseInt(p.rows[0].count),
      contactos: parseInt(c.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
