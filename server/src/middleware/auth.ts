import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRol?: string;
  body: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'siriox-dev-secret-change-in-production';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; rol: string };
    req.userId = payload.userId;
    req.userRol = payload.rol;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
}

export function requireEditor(req: AuthRequest, res: Response, next: NextFunction) {
  if (!['admin', 'editor'].includes(req.userRol || '')) {
    return res.status(403).json({ error: 'Acceso restringido a editores' });
  }
  next();
}

export function requireRRHH(req: AuthRequest, res: Response, next: NextFunction) {
  if (!['admin', 'rrhh'].includes(req.userRol || '')) {
    return res.status(403).json({ error: 'Acceso restringido a RRHH' });
  }
  next();
}

export function signToken(userId: string, rol: string): string {
  return jwt.sign({ userId, rol }, JWT_SECRET, { expiresIn: '7d' });
}
