import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { query } from './db.js'; // Importaremos esto luego

const app = express();


const allowedOrigins = [
  'https://tu-frontend-en-render.com', // Si luego despliegas el front
  'http://localhost:5173', // Para desarrollo local
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Si usas cookies/tokens
}));

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de la plataforma HGROUP');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// ... (configuración previa)
import authRoutes from './routes/authRoutes.js';
import brandRoutes from './routes/brandRoutes.js'; // Ejemplo adicional

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes); // Ruta protegida ejemplo