import express from 'express';
import { getAllPosts, getPostById, createPost, deletePost, updatePost, getFilteredPosts } from './blogPostController';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);
router.get('/filter', getFilteredPosts);

export default router;
