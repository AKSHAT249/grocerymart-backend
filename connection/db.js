import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Logs unexpected errors on idle connections instead of crashing silently
pool.on('error', (err) => console.error('Unexpected DB error:', err.message));

// Call once at startup to confirm the connection works
export async function testConnection() {
  try {
    const { rows } = await pool.query('SELECT NOW() AS time');
    console.log('PostgreSQL connected at', rows[0].time);
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
}

export default pool;