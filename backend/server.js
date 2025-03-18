const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a mock token
    const token = 'mock-token-12345';
    res.json({ message: 'Login successful', token, user }); // Include user data in the response
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Post a vehicle
app.post('/api/vehicles', async (req, res) => {
  const { make, model, year, price, description, postedBy } = req.body;

  try {
    const vehicle = new Vehicle({ make, model, year, price, description, postedBy });
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle posted successfully', vehicle });
  } catch (error) {
    console.error('Post vehicle error:', error);
    res.status(500).json({ message: 'Failed to post vehicle', error: error.message });
  }
});

// Get all vehicles with optional filtering
app.get('/api/vehicles', async (req, res) => {
  const { make, model, minYear, maxYear, minPrice, maxPrice } = req.query;
  const filter = {};

  if (make) filter.make = make;
  if (model) filter.model = model;
  if (minYear || maxYear) {
    filter.year = {};
    if (minYear) filter.year.$gte = parseInt(minYear);
    if (maxYear) filter.year.$lte = parseInt(maxYear);
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  try {
    const vehicles = await Vehicle.find(filter).populate('postedBy', 'email');
    res.json({ vehicles });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
});

// Validation rules for posting a vehicle
const validateVehicle = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year between 1900 and the current year'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('postedBy').notEmpty().withMessage('PostedBy is required'),
];

// Post a vehicle with validation
app.post('/api/vehicles', validateVehicle, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { make, model, year, price, description, postedBy } = req.body;

  try {
    const vehicle = new Vehicle({ make, model, year, price, description, postedBy });
    await vehicle.save();
    res.status(201).json({ message: 'Vehicle posted successfully', vehicle });
  } catch (error) {
    console.error('Post vehicle error:', error);
    res.status(500).json({ message: 'Failed to post vehicle', error: error.message });
  }
});

// Edit a vehicle
app.put('/api/vehicles/:id', validateVehicle, async (req, res) => {
  const { id } = req.params;
  console.log('Editing vehicle with ID:', id); // Debugging log
  const { make, model, year, price, description, postedBy } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { make, model, year, price, description, postedBy },
      { new: true } // Return the updated vehicle
    );
    if (!updatedVehicle) {
      console.log('Vehicle not found in database'); // Debugging log
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    console.log('Vehicle updated successfully:', updatedVehicle); // Debugging log
    res.json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    console.error('Edit vehicle error:', error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting vehicle with ID:', id); // Debugging log

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
      console.log('Vehicle not found in database'); // Debugging log
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    console.log('Vehicle deleted successfully:', deletedVehicle); // Debugging log
    res.json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Failed to delete vehicle', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));