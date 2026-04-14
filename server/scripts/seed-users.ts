import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/db';

async function seedUsers() {
  try {
    console.log('Seeding test users...');

    // Test users data
    const users = [
      {
        email: 'admin@siriox.com',
        nombre: 'Administrador',
        rol: 'admin',
        password: 'Admin123!',
      },
      {
        email: 'editor@siriox.com',
        nombre: 'Editor',
        rol: 'editor',
        password: 'Editor123!',
      },
      {
        email: 'rrhh@siriox.com',
        nombre: 'RRHH',
        rol: 'rrhh',
        password: 'RRHH123!',
      },
    ];

    for (const user of users) {
      // Check if user already exists
      const existing = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1',
        [user.email]
      );

      if (existing.rows.length > 0) {
        console.log(`✓ User ${user.email} already exists`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      const result = await pool.query(
        'INSERT INTO usuarios (email, nombre, rol, password_hash, activo) VALUES ($1, $2, $3, $4, true) RETURNING id, email, nombre, rol',
        [user.email, user.nombre, user.rol, hashedPassword]
      );

      console.log(`✓ Created user: ${user.email} (password: ${user.password})`);
    }

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
}

seedUsers();
