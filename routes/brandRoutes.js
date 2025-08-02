import { Router } from 'express';
const router = Router();

// Ruta de ejemplo (la implementarás luego)
router.get('/', (req, res) => {
  res.json({ message: 'Ruta de marcas' });
});

export default router;