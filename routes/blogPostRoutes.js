import express from 'express';
import { getAllPosts, getPostById, createPost, deletePost, updatePost, getFilteredPosts } from '../blogPostController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', verifyToken, createPost);
router.delete('/:id', verifyToken, deletePost);
router.put('/:id', verifyToken, updatePost);
router.get('/filter', getFilteredPosts);

export default router;
