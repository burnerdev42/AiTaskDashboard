const Challenge = require('../models/Challenge');

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().populate('owner', 'name avatar avatarColor').populate('team', 'name avatar avatarColor');
        res.status(200).json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a challenge
// @route   POST /api/challenges
// @access  Private
const createChallenge = async (req, res) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ message: 'Please add a title and description' });
    }

    try {
        const challenge = await Challenge.create({
            ...req.body,
            owner: req.user.id
        });
        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a challenge
// @route   PUT /api/challenges/:id
// @access  Private
const updateChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the goal user
        // if (challenge.owner.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'User not authorized' });
        // }

        const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedChallenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a challenge
// @route   DELETE /api/challenges/:id
// @access  Private
const deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // if (challenge.owner.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'User not authorized' });
        // }

        await challenge.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge
};
