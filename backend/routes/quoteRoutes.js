import express from 'express';
import {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getFeaturedQuotes,
  getQuoteStats,
} from '../controllers/quoteController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getQuotes);
router.get('/featured', getFeaturedQuotes);
router.get('/stats', getQuoteStats);
router.get('/:id', getQuote);

// Admin routes
router.post('/', protect, adminOnly, createQuote);
router.put('/:id', protect, adminOnly, updateQuote);
router.delete('/:id', protect, adminOnly, deleteQuote);

export default router;