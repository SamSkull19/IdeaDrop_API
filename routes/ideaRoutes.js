import express from 'express';
import Idea from '../model/Idea.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const ideas = await Idea.find();
        res.json(ideas);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Idea not found');
        }

        const idea = await Idea.findById(id);

        if (!idea) {
            res.status(404);
            throw new Error('Idea not found');
        }

        res.json(idea);
    }
    catch (error) {
        next(error);
    }
});



router.post('/', (req, res) => {
    const { title, description } = req.body;

    console.log(description)
    res.send(`Data Processed Title: ${title}`)
});

export default router;