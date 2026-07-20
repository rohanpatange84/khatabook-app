const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    pin: {
      type: String, // bcrypt hashed 4-digit PIN
      default: null,
    },
    pinSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash PIN before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('pin') || !this.pin) return next();
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

// Compare PIN method
UserSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', UserSchema);
