import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM notificaciones_contacto ORDER BY nombre ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error en consulta de notificaciones:', err);
    return res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Creando notificación:', req.body);
    console.log('Usuario:', req.userId, req.userRol);

    const { email, nombre } = req.body;
    if (!email || !nombre) {
      return res.status(400).json({ error: 'Email y nombre requeridos' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const result = await pool.query(
      `INSERT INTO notificaciones_contacto (email, nombre, activo)
       VALUES ($1, $2, true) RETURNING *`,
      [email.toLowerCase(), nombre]
    );
    console.log('Notificación creada:', result.rows[0]);
    return res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creando notificación:', err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Este email ya tiene configurada una notificación' });
    }
    return res.status(500).json({ error: 'Error al crear notificación' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { email, nombre, activo } = req.body;
    const result = await pool.query(
      `UPDATE notificaciones_contacto SET email=$1, nombre=$2, activo=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [email.toLowerCase(), nombre, activo, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Este email ya tiene configurada una notificación' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar notificación' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM notificaciones_contacto WHERE id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar notificación' });
  }
});

export default router;
