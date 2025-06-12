
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/winsam_db').then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const jwt = require('jsonwebtoken');
// const User = require('./models/User');
const SECRET_KEY = process.env.SECRET_KEY;

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Remove password before returning user object
    const userObj = user.toObject();
    delete userObj.password;

    // Return user object and token
    res.json({ message: 'Login successful', user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const data = req.body;

    // Check if email is provided
    if (!data.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use',status:false });
    }

    // Assign UUID if not provided
    if (!data.id) {
      data.id = uuidv4();
    }

    const user = new User(data);
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch('/api/users/:id', async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: 'User updated', user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ id: req.params.id });

    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', user: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
module.exports = {
  // getUsers,
  // getUserById,
  // createUser,
  // updateUser,
  // deleteUser
};