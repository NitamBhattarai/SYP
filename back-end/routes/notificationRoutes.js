import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getNotifications, getUnreadCount, markAsRead, markAllRead, deleteNotification } from '../controllers/notificationController.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;