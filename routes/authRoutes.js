import express from 'express';
import User from '../model/User.js';

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

        res.status(201).json({
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