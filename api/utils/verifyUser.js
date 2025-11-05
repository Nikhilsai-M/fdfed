import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.access_token || 
                  req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ No token found in cookies or headers');
      return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    console.log('🔑 Token found, verifying...');

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return next(errorHandler(403, 'Forbidden - Invalid token'));
      }

      // Attach user info to request - prioritize user_id from token
      req.user = {
        user_id: decoded.user_id,  // This should be the UUID from your database
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      console.log('✅ Token verified successfully');
      console.log('   User ID:', req.user.user_id);
      console.log('   MongoDB ID:', req.user.id);
      next();
    });
  } catch (error) {
    console.error('❌ Error in verifyToken middleware:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

export const verifySupervisor = (req, res, next) => {
  try {
    const token = req.cookies.supervisor_access_token;

    if (!token) {
      console.log('❌ No supervisor token found');
      return next(errorHandler(401, 'Unauthorized - Supervisor access required'));
    }

    console.log('🔑 Supervisor token found, verifying...');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Supervisor token verification failed:', err.message);
        return next(errorHandler(403, 'Forbidden - Invalid supervisor token'));
      }

      if (decoded.role !== 'supervisor') {
        console.log('❌ User is not a supervisor');
        return next(errorHandler(403, 'Forbidden - Supervisor access required'));
      }

      req.user = decoded;
      console.log('✅ Supervisor verified:', decoded.supervisor_id || decoded.id);
      next();
    });
  } catch (error) {
    console.error('❌ Error in verifySupervisor middleware:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};