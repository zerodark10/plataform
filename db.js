import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Función para insertar usuarios iniciales
export const seedInitialUsers = async () => {
  const users = [
    { email: 'admin@hgroup.consulting', password: 'Admin123*' },
    { email: 'gerente@hgroup.consulting', password: 'Gerente123*' },
    // ... Agrega los 10 usuarios aquí
  ];

  try {
    await pool.query('BEGIN'); // Inicia transacción

    for (const user of users) {
      // Verifica si el usuario ya existe
      const exists = await pool.query(
        'SELECT 1 FROM users WHERE email = $1',
        [user.email]
      );
      
      if (!exists.rows.length) {
        // Usa bcrypt para hashear (instálalo: npm install bcryptjs)
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
          'INSERT INTO users (email, password) VALUES ($1, $2)',
          [user.email, hashedPassword]
        );
        console.log(`Usuario ${user.email} creado`);
      }
    }

    await pool.query('COMMIT'); // Confirma transacción
    console.log('Todos los usuarios fueron procesados');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al crear usuarios:', error);
  }
};

// Ejecuta solo si es necesario (comenta después del primer uso)
// seedInitialUsers();

export const query = (text, params) => pool.query(text, params);