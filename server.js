require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');

app.use(express.json());

// Register API
app.post('/register', async (req, res) => {
  const { name } = req.body;
  
  try {
    // Check if name already exists
    const [rows] = await db.query('SELECT * FROM client_manage_info WHERE name = ?', [name]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Name already exists' });
    }

    // Get next ID
    const [result] = await db.query('SELECT MAX(id) as maxId FROM client_manage_info');
    const nextId = result[0].maxId !== null ? result[0].maxId + 1 : 1;

    // Insert new client
    await db.query('INSERT INTO client_manage_info (id, name, enter, qrPresent, exhibitionSection, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', 
      [nextId, name, false, false, null]);

    res.status(201).json({ id: nextId, name, enter: false, qrPresent: false, exhibitionSection: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// QR Scan API
app.post('/qr-scan', async (req, res) => {
  const { id } = req.body;

  try {
    const [rows] = await db.query('SELECT enter FROM client_manage_info WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { enter } = rows[0];
    if (!enter) {
      await db.query('UPDATE client_manage_info SET enter = ? WHERE id = ?', [true, id]);
      return res.json({ entered: false });
    } else {
      return res.json({ entered: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Move API
app.post('/move', async (req, res) => {
  const { id, section } = req.body;
  const validSections = ['A', 'B', 'C', 'D'];

  if (!validSections.includes(section)) {
    return res.status(400).json({ error: 'Invalid section' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM client_manage_info WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await db.query('UPDATE client_manage_info SET exhibitionSection = ? WHERE id = ?', [section, id]);
    res.json({ section });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { name } = req.body;

  try {
    const [rows] = await db.query('SELECT id FROM client_manage_info WHERE name = ?', [name]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Name not found' });
    }

    res.json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
