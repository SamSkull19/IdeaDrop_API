import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/ideas', (req, res) => {
    const ideas = [
        { id: 1, title: "title_1", description: 'This is Idea 1' },
        { id: 2, title: "title_2", description: 'This is Idea 2' },
        { id: 3, title: "title_3", description: 'This is Idea 3' },
        { id: 4, title: "title_4", description: 'This is Idea 4' },
    ];

    res.json(ideas)
});

app.post('/api/ideas', (req, res) => {
    const { title, description } = req.body;

    console.log(description)
    res.send(`Data Processed Title: ${title}`)
})

app.listen(PORT, () => {
    console.log("Server is Running on PORT: ", PORT);
})