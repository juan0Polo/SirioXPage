import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireEditor, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM servicios WHERE activo = true ORDER BY orden ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

router.get('/all', requireAuth, requireEditor, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM servicios ORDER BY orden ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener servicios' });
  }
});

router.post('/', requireAuth, requireEditor, async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, descripcion, descripcion_larga, icono_url, activo, orden } = req.body;
    const result = await pool.query(
      `INSERT INTO servicios (titulo, descripcion, descripcion_larga, icono_url, activo, orden)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titulo, descripcion, descripcion_larga || '', icono_url || '', activo ?? true, orden ?? 0]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear servicio' });
  }
});

router.put('/:id', requireAuth, requireEditor, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, descripcion_larga, icono_url, activo, orden } = req.body;
    const result = await pool.query(
      `UPDATE servicios SET titulo=$1, descripcion=$2, descripcion_larga=$3, icono_url=$4,
       activo=$5, orden=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [titulo, descripcion, descripcion_larga, icono_url, activo, orden, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar servicio' });
  }
});

router.delete('/:id', requireAuth, requireEditor, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM servicios WHERE id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar servicio' });
  }
});

export default router;
