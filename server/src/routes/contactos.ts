import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { sendContactNotification } from '../email';

const router = Router();

// Endpoint de prueba para enviar emails (solo para desarrollo)
router.post('/test-email', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Email destinatario requerido' });
    }

    await sendContactNotification({
      nombre: 'Usuario de Prueba',
      email: 'test@example.com',
      telefono: '123456789',
      mensaje: 'Este es un mensaje de prueba para verificar el envío de notificaciones por email.',
    }, to);

    return res.json({ message: 'Email de prueba enviado' });
  } catch (err) {
    console.error('Error en email de prueba:', err);
    return res.status(500).json({ error: 'Error al enviar email de prueba' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Nombre, email y mensaje requeridos' });
    }

    // Guardar el contacto en la base de datos
    const result = await pool.query(
      `INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, email, telefono || null, mensaje]
    );

    const contactData = result.rows[0];

    // Enviar notificaciones por email a las direcciones configuradas
    try {
      const notificationsResult = await pool.query(
        'SELECT email, nombre FROM notificaciones_contacto WHERE activo = true'
      );

      const notificationPromises = notificationsResult.rows.map((notification: any) =>
        sendContactNotification({
          nombre: contactData.nombre,
          email: contactData.email,
          telefono: contactData.telefono,
          mensaje: contactData.mensaje,
        }, notification.email)
      );

      // Enviar emails en paralelo pero no bloquear la respuesta
      Promise.allSettled(notificationPromises).then((results) => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        console.log(`Notificaciones enviadas: ${successful} exitosas, ${failed} fallidas`);
      });

    } catch (emailError) {
      console.error('Error al enviar notificaciones por email:', emailError);
      // No fallar la respuesta si el email falla
    }

    return res.status(201).json(contactData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al enviar contacto' });
  }
});

router.get('/', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM contactos ORDER BY created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { leido } = req.body;

    if (typeof leido !== 'boolean') {
      return res.status(400).json({ error: 'El campo leido debe ser un booleano' });
    }

    const result = await pool.query(
      'UPDATE contactos SET leido = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [leido, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar contacto:', err);
    return res.status(500).json({ error: 'Error al actualizar contacto' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM contactos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});

export default router;
