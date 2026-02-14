import { Response } from 'express';
import Idea from '../models/Idea';
import { AuthRequest } from '../types';

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Private
export const getIdeas = async (req: AuthRequest, res: Response) => {
    try {
        const ideas = await Idea.find().populate('owner', 'name avatar avatarColor').populate('linkedChallenge', 'title');
        res.status(200).json(ideas);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an idea
// @route   POST /api/ideas
// @access  Private
export const createIdea = async (req: AuthRequest, res: Response) => {
    if (!req.body.title) {
        return res.status(400).json({ message: 'Please add a title' });
    }

    try {
        const idea = await Idea.create({
            ...req.body,
            owner: req.user?.id
        });
        res.status(201).json(idea);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an idea
// @route   PUT /api/ideas/:id
// @access  Private
export const updateIdea = async (req: AuthRequest, res: Response) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedIdea);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private
export const deleteIdea = async (req: AuthRequest, res: Response) => {
    try {
        const idea = await Idea.findById(req.params.id);

        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        await idea.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
