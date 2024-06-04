import express from 'express';
import cors from "cors";
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'; // Path to your Firebase service account key JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Routes
import blogPostRoutes from './routes/blogPostRoutes';
import userRoutes from './routes/userRoutes';

app.use('/api/posts', blogPostRoutes);
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

