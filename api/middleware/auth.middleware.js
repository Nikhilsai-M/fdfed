import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ No token found');
      return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Token invalid:', err.message);
        return next(errorHandler(403, 'Forbidden'));
      }

      req.user = {
        user_id: decoded.user_id,
        id: decoded.id,
        email: decoded.email
      };

      console.log('✅ Token verified, user_id:', req.user.user_id);
      next();
    });
  } catch (error) {
    console.error('❌ Auth error:', error);
    next(errorHandler(500, 'Server error'));
  }
};