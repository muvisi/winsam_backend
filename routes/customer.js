// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/create', customerController.createCustomer);
router.get('/all/customers', customerController.getAllCustomers);

module.exports = router;
