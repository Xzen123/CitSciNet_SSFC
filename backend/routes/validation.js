const router = require('express').Router();
const validationController = require('../controllers/validationController');
const auth = require('../middleware/authMiddleware');

// Get Pending Validations
router.get('/pending', auth, validationController.getPending);

// Submit Review
router.post('/review', auth, validationController.submitReview);

module.exports = router;
