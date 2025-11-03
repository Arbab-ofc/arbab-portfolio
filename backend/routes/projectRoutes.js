import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  getTrendingProjects,
  getProjectStats,
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/trending', getTrendingProjects);
router.get('/stats', getProjectStats);
router.get('/:slug', getProject);
router.post('/:id/like', likeProject);

// Admin routes
router.post('/', protect, adminOnly, uploadMultiple, createProject);
router.put('/:id', protect, adminOnly, uploadMultiple, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

export default router;
