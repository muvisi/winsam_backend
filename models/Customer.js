// models/Customer.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4, // cleaner UUID usage
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  avatar: {
    type: String // consider URL validation if needed
  },
  is_active: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

