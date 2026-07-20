const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Contact = require('../models/Contact');
const { isAuthenticated, isPinVerified } = require('../middleware/auth');

// All routes require authentication + PIN verified
router.use(isAuthenticated, isPinVerified);

// Helper: Recalculate & update contact balance
const recalcBalance = async (contactId) => {
  const transactions = await Transaction.find({ contactId });
  let bal = 0;
  transactions.forEach((t) => {
    if (t.type === 'gave') bal += t.amount; // You gave = they owe you (+ positive)
    if (t.type === 'got') bal -= t.amount;  // You got = they paid back / you owe (- negative)
  });
  await Contact.findByIdAndUpdate(contactId, { totalBalance: bal });
  return bal;
};

// @route   GET /api/transactions/summary/all
// @desc    Get net balance summary across all contacts (MUST come before /:contactId)
router.get('/summary/all', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    let totalGet = 0;
    let totalGive = 0;

    contacts.forEach((c) => {
      const bal = c.totalBalance || 0;
      if (bal > 0) {
        totalGet += bal; // Total money to receive
      } else if (bal < 0) {
        totalGive += Math.abs(bal); // Total money to pay
      }
    });

    res.json({
      success: true,
      summary: {
        totalGave: totalGet,
        totalGot: totalGive,
        netBalance: totalGet - totalGive,
        contactCount: contacts.length,
      },
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   GET /api/transactions/:contactId
// @desc    Get all transactions for a contact
router.get('/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });

    const transactions = await Transaction.find({ contactId: req.params.contactId }).sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   POST /api/transactions/:contactId
// @desc    Add a new transaction for a contact
router.post('/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });

    const { type, amount, note, date } = req.body;

    if (!['gave', 'got'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be "gave" or "got".' });
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number.' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      contactId: req.params.contactId,
      type,
      amount: Number(amount),
      note: note || '',
      date: date ? new Date(date) : new Date(),
    });

    const newBalance = await recalcBalance(req.params.contactId);

    res.status(201).json({ success: true, transaction, newBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// @route   DELETE /api/transactions/:contactId/:transactionId
// @desc    Delete a specific transaction
router.delete('/:contactId/:transactionId', async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, userId: req.user._id });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.transactionId,
      contactId: req.params.contactId,
    });

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });

    const newBalance = await recalcBalance(req.params.contactId);
    res.json({ success: true, message: 'Transaction deleted.', newBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
