// controllers/customerController.js
const Customer = require('../models/Customer');
const User = require('../models/User');

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, address, avatar, user } = req.body;

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create the customer
    const customer = await Customer.create({
      name,
      phone,
      address,
      avatar,
      user
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};
exports.getAllCustomers = async (req, res) => {
  try {
    // Fetch all customers, optionally populate user details
    const customers = await Customer.find().populate('user','-password'); // populate user email only, adjust fields as needed

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};