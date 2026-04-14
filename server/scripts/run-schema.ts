import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../src/db';

async function runSchema() {
  try {
    console.log('Ejecutando schema.sql...');

    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Split the SQL file into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (err: any) {
          // Ignore "already exists" errors
          if (!err.message.includes('already exists') && !err.message.includes('ya existe')) {
            console.log(`Advertencia en statement: ${err.message}`);
          }
        }
      }
    }

    console.log('✓ Schema ejecutado exitosamente!');
    console.log('✓ Tabla notificaciones_contacto creada/verificada');

    process.exit(0);
  } catch (err) {
    console.error('Error al ejecutar el schema:', err);
    process.exit(1);
  }
}

runSchema();