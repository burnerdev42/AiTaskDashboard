const Idea = require('../models/Idea');

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Private
const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find().populate('owner', 'name avatar avatarColor').populate('linkedChallenge', 'title');
        res.status(200).json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an idea
// @route   POST /api/ideas
// @access  Private
const createIdea = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: 'Please add a title' });
    }

    try {
        const idea = await Idea.create({
            ...req.body,
            owner: req.user.id
        });
        res.status(201).json(idea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an idea
// @route   PUT /api/ideas/:id
// @access  Private
const updateIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedIdea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private
const deleteIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        await idea.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getIdeas,
    createIdea,
    updateIdea,
    deleteIdea
};
