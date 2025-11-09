export const requireAdminAuth = (req, res, next) => {
  if (req.session && req.session.adminId && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized - Admin access required' });
  }
};