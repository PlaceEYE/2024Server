require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the main QR scanning page (Page 1)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scan.html'));
});

// Serve the name confirmation page (Page 2)
app.get('/enter-name', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'enter-name.html'));
});

// Serve the success page (Page 3)
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Serve the section selection page (Page 4)
app.get('/select-section', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'select-section.html'));
});

// Fetch name by ID
app.get('/get-name', async (req, res) => {
  const { id } = req.query;

  try {
    const [rows] = await db.query('SELECT name FROM client_manage_info WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { name } = rows[0];
    res.json({ name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Scan QR and determine next step
app.post('/scan', async (req, res) => {
  const { id } = req.body;

  try {
    const [rows] = await db.query('SELECT enter FROM client_manage_info WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.redirect('/enter-name?id=' + id);
    }

    const { enter } = rows[0];
    if (!enter) {
      await db.query('UPDATE client_manage_info SET enter = ? WHERE id = ?', [true, id]);
      return res.redirect('/enter-name?id=' + id);
    } else {
      return res.redirect('/select-section?id=' + id);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Handle entry confirmation and move to success page
app.post('/enter', async (req, res) => {
  const { id } = req.body;

  try {
    await db.query('UPDATE client_manage_info SET enter = ? WHERE id = ?', [true, id]);
    res.redirect('/success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Handle section selection
// Handle section selection and redirect to success page
app.post('/move', async (req, res) => {
  const { id, section } = req.body;
  const validSections = ['A', 'B', 'C', 'D'];

  if (!validSections.includes(section)) {
    return res.status(400).send('Invalid section');
  }

  try {
    await db.query('UPDATE client_manage_info SET exhibitionSection = ? WHERE id = ?', [section, id]);
    res.redirect('/success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
