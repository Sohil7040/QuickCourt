const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
