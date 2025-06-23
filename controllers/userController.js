// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
exports.createUser = async (req, res) => {
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
};

exports.getUser = async (req, res) => {
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
};
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Skip email update if it's already in use
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        id: { $ne: req.params.id }
      });
      if (existingUser) {
        delete updates.email;
      }
    }

    // Use custom "id" field instead of _id
    const user = await User.findOneAndUpdate(
      { id: req.params.id }, // <-- UUID field
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: 'User updated successfully',
      user: userObj
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.updateUser = async (req, res) => {
//    try {
//       const updates = req.body;
//       const user = await User.findOneAndUpdate(
//         { id: req.params.id },
//         updates,
//         { new: true }
//       );
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       const userObj = user.toObject();
//       delete userObj.password;
  
//       res.json({ message: 'User updated', user: userObj });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// };

exports.deleteUser = async (req, res) => {
   try {
      const result = await User.findOneAndDelete({ id: req.params.id });
  
      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted', user: result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


exports.loginUser = async(req, res)=> {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

  
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

 
    const userObj = user.toObject();
    delete userObj.password;

    
    res.json({ message: 'Login successful', user: userObj, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}