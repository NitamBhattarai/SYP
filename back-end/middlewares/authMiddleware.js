import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role } — role is 'user' | 'pandit' | 'admin'
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Use this on pandit-only routes
export const requirePandit = (req, res, next) => {
  if (req.user?.role !== 'pandit') {
    return res.status(403).json({ message: 'Pandit access only' });
  }
  next();
};

// Use this on user-only routes
export const requireUser = (req, res, next) => {
  if (req.user?.role !== 'user') {
    return res.status(403).json({ message: 'User access only' });
  }
  next();
};
