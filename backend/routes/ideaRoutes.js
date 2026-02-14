const express = require('express');
const router = express.Router();
const { getIdeas, createIdea, updateIdea, deleteIdea } = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getIdeas).post(protect, createIdea);
router.route('/:id').put(protect, updateIdea).delete(protect, deleteIdea);

module.exports = router;
