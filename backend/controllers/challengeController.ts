import { Response } from 'express';
import Challenge from '../models/Challenge';
import { AuthRequest } from '../types';

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req: AuthRequest, res: Response) => {
    try {
        const challenges = await Challenge.find().populate('owner', 'name avatar avatarColor').populate('team', 'name avatar avatarColor');
        res.status(200).json(challenges);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a challenge
// @route   POST /api/challenges
// @access  Private
export const createChallenge = async (req: AuthRequest, res: Response) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ message: 'Please add a title and description' });
    }

    try {
        const challenge = await Challenge.create({
            ...req.body,
            owner: req.user?.id
        });
        res.status(201).json(challenge);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a challenge
// @route   PUT /api/challenges/:id
// @access  Private
export const updateChallenge = async (req: AuthRequest, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const updatedChallenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedChallenge);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a challenge
// @route   DELETE /api/challenges/:id
// @access  Private
export const deleteChallenge = async (req: AuthRequest, res: Response) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        await challenge.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
