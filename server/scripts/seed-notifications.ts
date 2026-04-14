import 'dotenv/config';
import { pool } from '../src/db';

async function seedNotifications() {
  try {
    console.log('Agregando notificaciones de ejemplo...');

    const notifications = [
      { email: 'jppolo@siriox.com', nombre: 'JP Polo' },
      { email: 'admin@siriox.com', nombre: 'Administrador' },
    ];

    for (const notification of notifications) {
      try {
        await pool.query(
          `INSERT INTO notificaciones_contacto (email, nombre, activo)
           VALUES ($1, $2, true)
           ON CONFLICT (email) DO NOTHING`,
          [notification.email, notification.nombre]
        );
        console.log(`✓ Notificación agregada: ${notification.email}`);
      } catch (err) {
        console.log(`⚠ Notificación ya existe: ${notification.email}`);
      }
    }

    console.log('✓ Notificaciones de ejemplo agregadas');
    process.exit(0);
  } catch (err) {
    console.error('Error al agregar notificaciones:', err);
    process.exit(1);
  }
}

seedNotifications();