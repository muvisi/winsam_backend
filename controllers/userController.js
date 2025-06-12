// controllers/userController.js
const User = require('../models/User');

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
};

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
