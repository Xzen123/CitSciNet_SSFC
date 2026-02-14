const router = require('express').Router();
const gamificationController = require('../controllers/gamificationController');
const auth = require('../middleware/authMiddleware');

// Get User Profile (Level, XP, Badges)
router.get('/profile/:userId', auth, gamificationController.getProfile);

// Get Leaderboard
router.get('/leaderboard', auth, gamificationController.getLeaderboard);

module.exports = router;
