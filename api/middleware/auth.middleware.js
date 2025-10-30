import jwt from 'jsonwebtoken';

export const requireCustomerAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Access denied: Not a customer' });
    }
    req.user = decoded; // attach decoded user info
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, 'Forbidden - Invalid token'));
        }

        req.user = user;
        next();
    });
};
