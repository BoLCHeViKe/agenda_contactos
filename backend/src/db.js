const mysql = require('mysql2/promise');

let pool;

async function initDB(retries = 15, delay = 4000) {
  for (let i = 1; i <= retries; i++) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || 'agenda_db',
        user: process.env.DB_USER || 'agenda_user',
        password: process.env.DB_PASSWORD || 'agenda_pass',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: '+00:00'
      });

      // Verificar conexión
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('✅ Conectado a MySQL correctamente');
      return pool;
    } catch (err) {
      console.warn(`⚠️  Intento ${i}/${retries} — MySQL no disponible aún: ${err.message}`);
      if (i === retries) {
        console.error('❌ No se pudo conectar a MySQL después de todos los intentos');
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

function getPool() {
  if (!pool) throw new Error('Pool de base de datos no inicializado');
  return pool;
}

module.exports = { initDB, getPool };
