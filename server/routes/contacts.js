const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Transaction = require('../models/Transaction');
const { isAuthenticated, isPinVerified } = require('../middleware/auth');

// All routes require authentication + PIN verified
router.use(isAuthenticated, isPinVerified);

// @route   GET /api/contacts
// @desc    Get all contacts for logged-in user
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   POST /api/contacts
// @desc    Create a new contact
router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Contact name is required.' });
    }

    const contact = await Contact.create({
      userId: req.user._id,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`,
    });

    res.status(201).json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found.' });
    }
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update contact
router.put('/:id', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, phone },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found.' });
    }
    res.json({ success: true, contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact and all their transactions
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found.' });
    }
    // Also delete all transactions for this contact
    await Transaction.deleteMany({ contactId: req.params.id });
    res.json({ success: true, message: 'Contact deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
