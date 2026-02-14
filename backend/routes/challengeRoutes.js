const express = require('express');
const router = express.Router();
const { getChallenges, createChallenge, updateChallenge, deleteChallenge } = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getChallenges).post(protect, createChallenge);
router.route('/:id').put(protect, updateChallenge).delete(protect, deleteChallenge);

module.exports = router;
