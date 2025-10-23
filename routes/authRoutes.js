import express from 'express';
import User from '../model/User.js';
import { generateToken } from '../utils/generateTokens.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('All fields are required');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({ name, email, password });

        const payload = { userId: user._id.toString() };
        const accessToken = await generateToken(payload, '1m');
        const refreshToken = await generateToken(payload, '30d');

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
        });

        res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(err);
    }
})

export default router;