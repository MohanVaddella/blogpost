import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "./config.js"; 
import upload from './middleware/uploadMiddleware.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsCollection = collection(db, 'posts');

export const getAllPosts = async (req, res) => {
    try {
        const snapshot = await getDocs(postsCollection);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await getDoc(postsCollection, id);
        if (!doc.exists()) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { title, content, author } = req.body;
        console.log('Received request to post a blog:', req.body);
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Image URL

        try {
            const docRef = await addDoc(postsCollection, {
                title,
                content,
                author,
                imageUrl,
                createdAt: new Date()
            });
            res.status(201).json({ id: docRef.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteDoc(postsCollection, id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    try {
        await updateDoc(postsCollection, id, { title, content, author });
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFilteredPosts = async (req, res) => {
    const { title, author } = req.query;
    let query = postsCollection;

    if (title) {
        query = query.where('title', '==', title);
    }
    if (author) {
        query = query.where('author', '==', author);
    }

    try {
        const snapshot = await getDocs(query);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
