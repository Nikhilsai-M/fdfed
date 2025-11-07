import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.admin_access_token || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ No admin token found');
      return next(errorHandler(401, 'Unauthorized - Admin access required'));
    }

    console.log('🔑 Admin token found, verifying...');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Admin token verification failed:', err.message);
        return next(errorHandler(403, 'Forbidden - Invalid admin token'));
      }

      if (decoded.role !== 'admin') {
        console.log('❌ User is not an admin');
        return next(errorHandler(403, 'Forbidden - Admin access required'));
      }

      req.admin = decoded;
      console.log('✅ Admin verified:', decoded.admin_id);
      next();
    });
  } catch (error) {
    console.error('❌ Error in verifyAdmin middleware:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};