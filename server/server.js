require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
require('./config/passport');

// Routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const transactionRoutes = require('./routes/transactions');

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy for Render / HTTPS
app.set('trust proxy', 1);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'khatabook_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Catch-all: serve index.html for any unmatched route (SPA-style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Khatabook server running at http://localhost:${PORT}`);
});
