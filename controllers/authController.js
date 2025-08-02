import { query } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Función de validación de email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email no válido' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    // Verificar si el usuario ya existe
    const exists = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    res.status(201).json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // 1. Buscar usuario
    const user = await query(
      'SELECT id, email, password FROM users WHERE email = $1', 
      [email]
    );

    if (!user.rows[0]) {
      return res.status(404).json({ error: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
    }

    // 2. Verificar contraseña
    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Mismo mensaje que arriba
    }

    // 3. Generar token
    const token = jwt.sign(
      { 
        userId: user.rows[0].id,
        email: user.rows[0].email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // 4. Responder
    res.json({
      success: true,
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};