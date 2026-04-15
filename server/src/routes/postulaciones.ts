import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireRRHH } from '../middleware/auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`),
});
const upload = multer({ storage });

const router = Router();

router.post('/', upload.single('cv'), async (req: Request, res: Response) => {
  try {
    const { vacante_id, nombre, email, telefono, mensaje } = req.body;
    const cvUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email requeridos' });
    }
    const result = await pool.query(
      `INSERT INTO postulaciones (vacante_id, nombre, email, telefono, mensaje, cv_url, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'en_revision') RETURNING *`,
      [vacante_id || null, nombre, email, telefono || null, mensaje || null, cvUrl]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al enviar postulación' });
  }
});

router.get('/', requireAuth, requireRRHH, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM postulaciones ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
});

router.put('/:id', requireAuth, requireRRHH, async (req: Request, res: Response) => {
  try {
    const { estado } = req.body;
    const result = await pool.query(
      `UPDATE postulaciones SET estado=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [estado, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar postulación' });
  }
});

export default router;
