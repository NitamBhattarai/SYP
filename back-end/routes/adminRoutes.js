import express from 'express';
import {
  getStats,
  getAllPandits,
  updatePanditStatus,
  getAllUsers,
  deleteUser,
  getAllBookings,
} from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}

// All admin routes require auth + admin role
router.use(verifyToken, requireAdmin);

router.get('/stats',              getStats);
router.get('/pandits',            getAllPandits);
router.put('/pandits/:id/status', updatePanditStatus);
router.get('/users',              getAllUsers);
router.delete('/users/:id',       deleteUser);
router.get('/bookings',           getAllBookings);

export default router;







