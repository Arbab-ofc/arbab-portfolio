import express from 'express';
import {
  uploadResume,
  getResumes,
  getResume,
  getActiveResume,
  updateResume,
  deleteResume,
  toggleResumeStatus,
} from '../controllers/resumeController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import uploadResumeMiddleware from '../middleware/uploadResume.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveResume);

// Admin routes
router.post('/upload', protect, adminOnly, uploadResumeMiddleware.single('resume'), uploadResume);
router.get('/', protect, adminOnly, getResumes);
router.get('/:id', protect, adminOnly, getResume);
router.put('/:id', protect, adminOnly, updateResume);
router.delete('/:id', protect, adminOnly, deleteResume);
router.patch('/:id/toggle', protect, adminOnly, toggleResumeStatus);

export default router;