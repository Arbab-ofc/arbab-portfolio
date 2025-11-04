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
import { validateObjectId, validateQuote, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateSearch, getQuotes);
router.get('/featured', getFeaturedQuotes);
router.get('/stats', getQuoteStats);
router.get('/:id', validateObjectId('id'), getQuote);

// Admin routes
router.post('/', protect, adminOnly, validateQuote, createQuote);
router.put('/:id', protect, adminOnly, validateObjectId('id'), validateQuote, updateQuote);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), deleteQuote);

export default router;