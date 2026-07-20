const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    totalBalance: {
      type: Number,
      default: 0, // positive = they owe you, negative = you owe them
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);
