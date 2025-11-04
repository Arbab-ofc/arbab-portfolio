import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Common validation chains
export const validateName = (fieldName = 'name') =>
  body(fieldName)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${fieldName} must be between 2 and 50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
    .escape();

export const validateEmail = (fieldName = 'email') =>
  body(fieldName)
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_dots: false,
    })
    .isLength({ max: 255 })
    .withMessage('Email address too long');

export const validatePassword = (fieldName = 'password') =>
  body(fieldName)
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const validateObjectId = (fieldName = 'id') =>
  param(fieldName)
    .isMongoId()
    .withMessage(`Invalid ${fieldName} format`);

// User registration validation
export const validateUserRegistration = [
  validateName('name'),
  validateEmail('email'),
  validatePassword('password'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  handleValidationErrors,
];

// User login validation
export const validateUserLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Password reset request validation
export const validatePasswordResetRequest = [
  validateEmail('email'),
  handleValidationErrors,
];

// Password reset validation
export const validatePasswordReset = [
  validateObjectId('token'),
  validatePassword('password'),
  handleValidationErrors,
];

// Password change validation
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  validatePassword('newPassword'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  handleValidationErrors,
];

// Contact form validation
export const validateContactForm = [
  validateName('name'),
  validateEmail('email'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Subject must be between 3 and 100 characters')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .escape(),
  handleValidationErrors,
];

// Blog post validation
export const validateBlogPost = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters')
    .escape(),
  body('slug')
    .optional()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
    .isLength({ min: 3, max: 200 })
    .withMessage('Slug must be between 3 and 200 characters'),
  body('excerpt')
    .trim()
    .isLength({ min: 50, max: 500 })
    .withMessage('Excerpt must be between 50 and 500 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 100, max: 50000 })
    .withMessage('Content must be between 100 and 50,000 characters'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length < 1 || tag.length > 30) {
          throw new Error('Each tag must be a string between 1 and 30 characters');
        }
      }
      return true;
    }),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
  handleValidationErrors,
];

// Quote validation
export const validateQuote = [
  body('text')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Quote text must be between 10 and 500 characters')
    .escape(),
  body('author')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Author name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters')
    .escape(),
  body('field')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Field must not exceed 50 characters')
    .escape(),
  body('command')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Command must not exceed 200 characters')
    .escape(),
  handleValidationErrors,
];

// Search and pagination validation
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .escape(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter must not exceed 50 characters')
    .escape(),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'popular', 'name'])
    .withMessage('Sort must be one of: newest, oldest, popular, name'),
  handleValidationErrors,
];

// File upload validation
export const validateFileUpload = [
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .escape(),
  handleValidationErrors,
];

// Email verification validation
export const validateEmailVerification = [
  validateObjectId('token'),
  handleValidationErrors,
];

// Profile update validation
export const validateProfileUpdate = [
  validateName('name'),
  validateEmail('email'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters')
    .escape(),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('Social links must be an object'),
  handleValidationErrors,
];

// Admin user management validation
export const validateUserManagement = [
  validateObjectId('id'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  validateEmail('email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  handleValidationErrors,
];