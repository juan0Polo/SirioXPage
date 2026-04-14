import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireRRHH, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vacantes WHERE activa = true ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener vacantes' });
  }
});

router.get('/all', requireAuth, requireRRHH, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM vacantes ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener vacantes' });
  }
});

router.post('/', requireAuth, requireRRHH, async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, area, modalidad, ubicacion, descripcion, requisitos } = req.body;
    const result = await pool.query(
      `INSERT INTO vacantes (titulo, area, modalidad, ubicacion, descripcion, requisitos, activa, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, true, $7) RETURNING *`,
      [titulo, area, modalidad, ubicacion || '', descripcion, requisitos || '', req.userId]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear vacante' });
  }
});

router.put('/:id', requireAuth, requireRRHH, async (req: Request, res: Response) => {
  try {
    const { titulo, area, modalidad, ubicacion, descripcion, requisitos, activa } = req.body;
    const result = await pool.query(
      `UPDATE vacantes SET titulo=$1, area=$2, modalidad=$3, ubicacion=$4, descripcion=$5,
       requisitos=$6, activa=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [titulo, area, modalidad, ubicacion, descripcion, requisitos, activa, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar vacante' });
  }
});

router.delete('/:id', requireAuth, requireRRHH, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM vacantes WHERE id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar vacante' });
  }
});

export default router;
