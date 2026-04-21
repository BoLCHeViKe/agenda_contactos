const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { getPool } = require('../db');

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────
function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
}

// ── GET /api/contacts ────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const { search, favorite } = req.query;

    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params = [];

    if (search) {
      sql += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)`;
      const like = `%${search}%`;
      params.push(like, like, like, like, like);
    }
    if (favorite === '1') {
      sql += ' AND is_favorite = 1';
    }

    sql += ' ORDER BY last_name, first_name';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/contacts/:id ────────────────────────────────
router.get('/:id', param('id').isInt(), async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/contacts ───────────────────────────────────
router.post('/',
  body('first_name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('last_name').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido'),
  body('phone').optional().trim(),
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const pool = getPool();
      const { first_name, last_name, email, phone, phone2, company, address, city, country, notes, photo_url, is_favorite } = req.body;
      const [result] = await pool.query(
        `INSERT INTO contacts (first_name, last_name, email, phone, phone2, company, address, city, country, notes, photo_url, is_favorite)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email || null, phone || null, phone2 || null, company || null, address || null, city || null, country || null, notes || null, photo_url || null, is_favorite ? 1 : 0]
      );
      const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ya existe un contacto con ese email' });
      res.status(500).json({ error: err.message });
    }
  }
);

// ── PUT /api/contacts/:id ────────────────────────────────
router.put('/:id',
  param('id').isInt(),
  body('first_name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('last_name').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido'),
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const pool = getPool();
      const { first_name, last_name, email, phone, phone2, company, address, city, country, notes, photo_url, is_favorite } = req.body;
      const [result] = await pool.query(
        `UPDATE contacts SET first_name=?, last_name=?, email=?, phone=?, phone2=?, company=?, address=?, city=?, country=?, notes=?, photo_url=?, is_favorite=?
         WHERE id=?`,
        [first_name, last_name, email || null, phone || null, phone2 || null, company || null, address || null, city || null, country || null, notes || null, photo_url || null, is_favorite ? 1 : 0, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
      const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
      res.json(rows[0]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ya existe un contacto con ese email' });
      res.status(500).json({ error: err.message });
    }
  }
);

// ── PATCH /api/contacts/:id/favorite ────────────────────
router.patch('/:id/favorite', param('id').isInt(), async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const pool = getPool();
    await pool.query('UPDATE contacts SET is_favorite = NOT is_favorite WHERE id = ?', [req.params.id]);
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/contacts/:id ─────────────────────────────
router.delete('/:id', param('id').isInt(), async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const pool = getPool();
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json({ message: 'Contacto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
