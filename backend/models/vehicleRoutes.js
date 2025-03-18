const { body, validationResult } = require('express-validator');

// Validation rules for creating a vehicle listing
const validateVehicle = [
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year between 1900 and the current year'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

// Apply validation middleware to your route
router.post('/vehicles', validateVehicle, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Proceed with creating the vehicle listing
  // Your existing logic here...
});