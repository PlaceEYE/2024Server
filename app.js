const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const User = require('./models/user');

const app = express();
const sequelize = new Sequelize(require('./config/config.json').development);

app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  try {
    const { name, ID } = req.body;
    const user = await User.create({ name, ID });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

app.post('/ent', async (req, res) => {
  try {
    const { ID, link } = req.body;
    const user = await User.findOne({ where: { ID } });
    if (user) {
      user.link = link;
      user.isEnt = true;
      await user.save();
      res.status(200).json({ link: user.link });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating link', error });
  }
});

app.get('/login', async (req, res) => {
  try {
    const { ID } = req.query;
    const user = await User.findOne({ where: { ID } });
    if (user) {
      user.lastLoginTimestamp = new Date();
      await user.save();
      res.status(200).json({ ID: user.ID, isEnt: user.isEnt, Timestamp: user.lastLoginTimestamp });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
});

app.get('/scan', async (req, res) => {
  try {
    const { ID } = req.query;
    const user = await User.findOne({ where: { ID } });
    if (user) {
      res.status(200).json({ link: user.link });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error scanning', error });
  }
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
