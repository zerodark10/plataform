import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (!user.rows[0]) throw new Error('Usuario no válido');
    
    req.user = user.rows[0];
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token inválido' });
  }
};