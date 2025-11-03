import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { contactLimiter, newsletterLimiter, authLimiter } from '../middleware/rateLimiter.js';

// Import controllers
import * as authController from '../controllers/authController.js';
import * as blogController from '../controllers/blogController.js';
import * as skillController from '../controllers/skillController.js';
import * as contactController from '../controllers/contactController.js';
import * as experienceController from '../controllers/experienceController.js';
import * as otherControllers from '../controllers/otherControllers.js';

// ============= AUTH ROUTES =============
export const authRouter = express.Router();

authRouter.post('/register', authLimiter, authController.register);
authRouter.post('/login', authLimiter, authController.login);
authRouter.post('/logout', protect, authController.logout);
authRouter.post('/refresh', authController.refreshToken);
authRouter.get('/me', protect, authController.getMe);
authRouter.put('/updatedetails', protect, authController.updateDetails);
authRouter.put('/updatepassword', protect, authController.updatePassword);

// ============= BLOG ROUTES =============
export const blogRouter = express.Router();

blogRouter.get('/', blogController.getBlogs);
blogRouter.get('/categories', blogController.getCategories);
blogRouter.get('/search', blogController.searchBlogs);
blogRouter.get('/:slug', blogController.getBlog);
blogRouter.post('/:id/like', blogController.likeBlog);
blogRouter.post('/:id/comments', blogController.addComment);

// Admin routes
blogRouter.post('/', protect, adminOnly, uploadSingle, blogController.createBlog);
blogRouter.put('/:id', protect, adminOnly, uploadSingle, blogController.updateBlog);
blogRouter.delete('/:id', protect, adminOnly, blogController.deleteBlog);

// ============= SKILL ROUTES =============
export const skillRouter = express.Router();

skillRouter.get('/', skillController.getSkills);
skillRouter.post('/', protect, adminOnly, skillController.createSkill);
skillRouter.put('/:id', protect, adminOnly, skillController.updateSkill);
skillRouter.delete('/:id', protect, adminOnly, skillController.deleteSkill);

// ============= EXPERIENCE ROUTES =============
export const experienceRouter = express.Router();

experienceRouter.get('/', experienceController.getExperiences);
experienceRouter.post('/', protect, adminOnly, uploadSingle, experienceController.createExperience);
experienceRouter.put('/:id', protect, adminOnly, uploadSingle, experienceController.updateExperience);
experienceRouter.delete('/:id', protect, adminOnly, experienceController.deleteExperience);

// ============= CONTACT ROUTES =============
export const contactRouter = express.Router();

contactRouter.post('/', contactLimiter, contactController.submitContact);
contactRouter.get('/', protect, adminOnly, contactController.getContacts);
contactRouter.get('/:id', protect, adminOnly, contactController.getContact);
contactRouter.put('/:id', protect, adminOnly, contactController.updateContact);
contactRouter.delete('/:id', protect, adminOnly, contactController.deleteContact);

// ============= NEWSLETTER ROUTES =============
export const newsletterRouter = express.Router();

newsletterRouter.post('/subscribe', newsletterLimiter, otherControllers.subscribeNewsletter);
newsletterRouter.post('/unsubscribe', otherControllers.unsubscribeNewsletter);
newsletterRouter.get('/', protect, adminOnly, otherControllers.getNewsletterSubscribers);

// ============= GUESTBOOK ROUTES =============
export const guestbookRouter = express.Router();

guestbookRouter.get('/', otherControllers.getGuestBookEntries);
guestbookRouter.post('/', otherControllers.createGuestBookEntry);
guestbookRouter.put('/:id', protect, adminOnly, otherControllers.updateGuestBookEntry);
guestbookRouter.delete('/:id', protect, adminOnly, otherControllers.deleteGuestBookEntry);

// ============= TESTIMONIAL ROUTES =============
export const testimonialRouter = express.Router();

testimonialRouter.get('/', otherControllers.getTestimonials);
testimonialRouter.post('/', protect, adminOnly, otherControllers.createTestimonial);
testimonialRouter.put('/:id', protect, adminOnly, otherControllers.updateTestimonial);
testimonialRouter.delete('/:id', protect, adminOnly, otherControllers.deleteTestimonial);

// ============= ANALYTICS ROUTES =============
export const analyticsRouter = express.Router();

analyticsRouter.post('/track', otherControllers.trackVisit);
analyticsRouter.get('/', protect, adminOnly, otherControllers.getAnalytics);
analyticsRouter.get('/overview', protect, adminOnly, otherControllers.getAnalytics);
