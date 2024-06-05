import express from 'express';
import cors from "cors";
import blogPostRoutes from './routes/blogPostRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;


app.use('/api/posts', verifyToken, blogPostRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

