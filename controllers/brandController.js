import { query } from '../db.js';

export const createBrand = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Obtenido del authMiddleware
  try {
    const result = await query(
      'INSERT INTO brands (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBrands = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await query('SELECT * FROM brands WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};