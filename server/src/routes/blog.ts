import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireEditor, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/categorias', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categorias_blog ORDER BY nombre ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM articulos_blog WHERE publicado = true
       ORDER BY fecha_publicacion DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

router.get('/all', requireAuth, requireEditor, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articulos_blog ORDER BY created_at DESC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articulos_blog WHERE slug = $1 AND publicado = true',
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener artículo' });
  }
});

router.post('/', requireAuth, requireEditor, async (req: AuthRequest, res: Response) => {
  try {
    const { titulo, slug, contenido, imagen_url, categoria_id, publicado, fecha_publicacion } = req.body;
    const result = await pool.query(
      `INSERT INTO articulos_blog (titulo, slug, contenido, imagen_url, categoria_id, autor_id, publicado, fecha_publicacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [titulo, slug, contenido, imagen_url || null, categoria_id || null, req.userId, publicado ?? false, fecha_publicacion || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear artículo' });
  }
});

router.put('/:id', requireAuth, requireEditor, async (req: Request, res: Response) => {
  try {
    const { titulo, slug, contenido, imagen_url, categoria_id, publicado, fecha_publicacion } = req.body;
    const result = await pool.query(
      `UPDATE articulos_blog SET titulo=$1, slug=$2, contenido=$3, imagen_url=$4, categoria_id=$5,
       publicado=$6, fecha_publicacion=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [titulo, slug, contenido, imagen_url || null, categoria_id || null, publicado, fecha_publicacion || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar artículo' });
  }
});

router.delete('/:id', requireAuth, requireEditor, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM articulos_blog WHERE id = $1', [req.params.id]);
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar artículo' });
  }
});

export default router;
