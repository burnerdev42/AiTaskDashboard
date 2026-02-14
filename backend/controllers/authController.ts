import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

// Generate JWT
const generateToken = (id: any) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role, opco, platform, interests, adminSecret } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Determine role
    let userRole: 'Admin' | 'User' = 'User';
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
        userRole = 'Admin';
    } else if (role === 'Admin') {
        // Optionally allow explicit 'Admin' role if no secret is required (for internal scripts)
        // For now, let's force the secret if someone tries to register as Admin
        userRole = 'User';
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: userRole,
        avatar: '',
        avatarColor: '#000000',
        opco,
        platform,
        interests
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
    res.status(200).json(req.user);
};
