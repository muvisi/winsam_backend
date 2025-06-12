// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => require('uuid').v4(), // fallback if missed
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  first_name: String,
  last_name: String,
  phone: String,
  gender: String,
  department: String,
  role: {
    type: Object,
    default: null
  },
  password: String,
  date_joined: {
    type: Date,
    default: Date.now
  },
  avatar: String,
  is_active: {
    type: Boolean,
    default: true
  },
  is_superuser: {
    type: Boolean,
    default: false
  },
  is_staff: {
    type: Boolean,
    default: false
  },
  is_archive: {
    type: Boolean,
    default: false
  },
  jwt_secret: String,
  last_login: {
    type: Date,
    default: null
  },
  deleted_by: {
    type: Object,
    default: null
  },
  deleted_date: {
    type: Date,
    default: null
  },
  permissions: {
    type: [Number],
    default: []
  }
});
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Add a method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
