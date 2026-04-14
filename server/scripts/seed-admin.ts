import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db';

async function addAdmin() {
  try {
    const email = 'jppolo@siriox.com';
    const nombre = 'JP Polo';
    const password = 'JpPolo123!';

    console.log(`Creando usuario administrador: ${email}...`);

    // Check if user already exists
    const existing = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log(`✗ El usuario ${email} ya existe`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user as admin
    const result = await pool.query(
      'INSERT INTO usuarios (email, nombre, rol, password_hash, activo) VALUES ($1, $2, $3, $4, true) RETURNING id, email, nombre, rol',
      [email, nombre, 'admin', hashedPassword]
    );

    const user = result.rows[0];
    console.log('\n✓ Usuario administrador creado exitosamente!\n');
    console.log(`Email: ${user.email}`);
    console.log(`Nombre: ${user.nombre}`);
    console.log(`Rol: ${user.rol}`);
    console.log(`Contraseña: ${password}`);
    console.log(`ID: ${user.id}`);

    process.exit(0);
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    process.exit(1);
  }
}

addAdmin();
