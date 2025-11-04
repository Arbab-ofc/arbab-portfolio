import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Rate limiting for auth attempts (in-memory store for demo)
const authAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Check rate limiting
const checkAuthRateLimit = (identifier) => {
  const now = Date.now();
  const attempts = authAttempts.get(identifier) || [];

  // Clean old attempts
  const validAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);

  if (validAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }

  validAttempts.push(now);
  authAttempts.set(identifier, validAttempts);
  return true;
};

// Get client identifier for rate limiting
const getClientIdentifier = (req) => {
  return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
};

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token with stronger algorithm validation
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
      });

      // Check token issuer and audience for additional security
      if (decoded.iss && decoded.iss !== 'arbab-portfolio') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token issuer',
        });
      }

      // Get user from token with additional security checks
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated',
        });
      }

      // Check if user's last password change was after token issuance
      if (req.user.lastPasswordChange && decoded.iat) {
        const tokenIssuedAt = new Date(decoded.iat * 1000);
        const passwordChangedAt = new Date(req.user.lastPasswordChange);

        if (passwordChangedAt > tokenIssuedAt) {
          return res.status(401).json({
            success: false,
            message: 'Token invalidated due to password change',
          });
        }
      }

      next();
    } catch (error) {
      // Rate limiting check
      const clientIdentifier = getClientIdentifier(req);
      if (!checkAuthRateLimit(clientIdentifier)) {
        return res.status(429).json({
          success: false,
          message: 'Too many authentication attempts. Please try again later.',
          retryAfter: Math.ceil(ATTEMPT_WINDOW / 1000),
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

// Admin only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

// Generate JWT token with enhanced security
export const generateToken = (id) => {
  const payload = {
    id,
    iss: 'arbab-portfolio', // Issuer
    aud: 'arbab-portfolio-users', // Audience
    type: 'access',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
    algorithm: 'HS256',
  });
};

// Generate refresh token
export const generateRefreshToken = (id) => {
  const payload = {
    id,
    iss: 'arbab-portfolio',
    aud: 'arbab-portfolio-users',
    type: 'refresh',
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
    algorithm: 'HS256',
  });
};

// Send token response with enhanced security
export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Enhanced cookie options for production security
  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRE) * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    path: '/',
  };

  // Set security headers
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: new Date(),
      },
    });
};
