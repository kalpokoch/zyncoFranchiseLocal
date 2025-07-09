const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model');

// Get all customers (with pagination, search, franchiseId)
router.get('/', async (req, res) => {
  try {
    const { franchiseId, page = 1, limit = 10, search = '' } = req.query;
    const query = {};
    if (franchiseId) {
      query.franchiseId = franchiseId;
    }
    if (search) {
      query.customerName = { $regex: search, $options: 'i' };
    }
    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Customer.countDocuments(query);
    res.json({ success: true, count: customers.length, total, page: Number(page), pages: Math.ceil(total / limit), data: customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { franchiseId, customerName, phoneNumber, email, address, lastPurchase, amountReceivable, isActive } = req.body;
    if (!franchiseId || !customerName || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'franchiseId, customerName, and phoneNumber are required' });
    }
    const customer = new Customer({ franchiseId, customerName, phoneNumber, email, address, lastPurchase, amountReceivable, isActive });
    await customer.save();
    res.status(201).json({ success: true, data: customer, message: 'Customer created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields._id;
    delete updateFields.franchiseId;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;
    const customer = await Customer.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer, message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Soft delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, message: 'Customer deleted (soft) successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get customer suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const { franchiseId, search = '' } = req.query;
    if (!franchiseId) return res.status(400).json({ success: false, message: 'franchiseId is required' });
    const suggestions = await Customer.find({
      franchiseId,
      customerName: { $regex: search, $options: 'i' },
      isActive: true
    }).limit(5);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
