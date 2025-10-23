import express from 'express';
import Idea from '../model/Idea.js';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const limit = parseInt(req.query._limit);
        const query = Idea.find().sort({ createdAt: -1 });

        if (!isNaN(limit)) {
            query.limit(limit);
        }

        const ideas = await query.exec();
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



router.post('/', protect, async (req, res) => {
    try {
        const { title, summary, description, tags } = req.body || {};

        if (!title?.trim() || !summary?.trim() || !description?.trim()) {
            res.status(400);
            throw new Error('Title, summary, and description are required');
        }

        const newIdea = new Idea({
            title,
            summary,
            description,
            tags:
                typeof tags === 'string'
                    ? tags
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    : Array.isArray(tags)
                        ? tags
                        : [],
            user: req.user._id,
        });

        const savedIdea = await newIdea.save();
        res.status(201).json(savedIdea);
    }
    catch (error) {
        next(error);
    }
});


router.delete('/:id', protect, async (req, res, next) => {
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

        if (idea.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this idea');
        }

        await idea.deleteOne();
    }
    catch (error) {
        next(error);
    }
});


router.put('/:id', protect, async (req, res, next) => {
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

        if (idea.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this idea');
        }

        const { title, summary, description, tags } = req.body || {};

        if (!title || !summary || !description) {
            res.status(400);
            throw new Error('Title, summary, and description are required');
        }

        idea.title = title;
        idea.summary = summary;
        idea.description = description;
        idea.tags = Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];

        const updatedIdea = await idea.save();

        res.json(updatedIdea);
    }
    catch (error) {
        next(error);
    }
});

export default router;