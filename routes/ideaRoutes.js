import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    const ideas = [
        { id: 1, title: "title_1", description: 'This is Idea 1' },
        { id: 2, title: "title_2", description: 'This is Idea 2' },
        { id: 3, title: "title_3", description: 'This is Idea 3' },
        { id: 4, title: "title_4", description: 'This is Idea 4' },
    ];

    res.json(ideas)
});

router.post('/', (req, res) => {
    const { title, description } = req.body;

    console.log(description)
    res.send(`Data Processed Title: ${title}`)
});

export default router;