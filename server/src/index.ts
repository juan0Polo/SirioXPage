import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import serviciosRoutes from './routes/servicios';
import blogRoutes from './routes/blog';
import vacantesRoutes from './routes/vacantes';
import postulacionesRoutes from './routes/postulaciones';
import contactosRoutes from './routes/contactos';
import notificacionesContactoRoutes from './routes/notificaciones-contacto';
import usuariosRoutes from './routes/usuarios';
import campanasEmailRoutes from './routes/campanas-email';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/contactos', contactosRoutes);
app.use('/api/notificaciones-contacto', notificacionesContactoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/campanas-email', campanasEmailRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;
