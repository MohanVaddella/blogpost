import { firestore } from 'firebase-admin';

const db = firestore();
const postsCollection = db.collection('posts');

export const getAllPosts = async (req, res) => {
    try {
        const snapshot = await postsCollection.get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const doc = await postsCollection.doc(id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Post not found' });
        } else {
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    const { title, content, author } = req.body;

    try {
        const docRef = await postsCollection.add({ title, content, author, createdAt: new Date() });
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        await postsCollection.doc(id).delete();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    try {
        await postsCollection.doc(id).update({ title, content, author });
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
        const snapshot = await query.get();
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
