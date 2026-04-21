require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const contactsRouter = require('./routes/contacts');
const uploadRouter = require('./routes/upload');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ──────────────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir fotos subidas de forma estática
app.use('/uploads', express.static(path.join(process.env.UPLOAD_DIR || '/app/uploads')));

// ── Rutas ────────────────────────────────────────────────
app.use('/api/contacts', contactsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

// ── Arranque ─────────────────────────────────────────────
(async () => {
  await initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
})();
