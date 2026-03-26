import { db } from "../config/db.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// Helper to create a notification
export const createNotification = async (userId, userRole, title, message, link = null) => {
  try {
    await query(
      'INSERT INTO notifications (user_id, user_role, title, message, link) VALUES (?, ?, ?, ?, ?)',
      [userId, userRole, title, message, link]
    );
  } catch (err) {
    console.error('createNotification error', err);
  }
};

// GET /api/notifications — get notifications for current user
export const getNotifications = async (req, res) => {
  try {
    const { id, role } = req.user;
    const rows = await query(
      `SELECT * FROM notifications 
       WHERE user_id = ? AND user_role = ?
       ORDER BY created_at DESC LIMIT 30`,
      [id, role]
    );
    res.json(rows);
  } catch (err) {
    console.error('getNotifications error', err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// GET /api/notifications/unread-count
export const getUnreadCount = async (req, res) => {
  try {
    const { id, role } = req.user;
    const rows = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND user_role = ? AND is_read = 0',
      [id, role]
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('getUnreadCount error', err);
    res.status(500).json({ message: 'Error fetching count' });
  }
};

// PUT /api/notifications/:id/read — mark one as read
export const markAsRead = async (req, res) => {
  try {
    const { id, role } = req.user;
    await query(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ? AND user_role = ?',
      [req.params.id, id, role]
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

// PUT /api/notifications/mark-all-read
export const markAllRead = async (req, res) => {
  try {
    const { id, role } = req.user;
    await query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND user_role = ?',
      [id, role]
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const { id, role } = req.user;
    await query(
      'DELETE FROM notifications WHERE notification_id = ? AND user_id = ? AND user_role = ?',
      [req.params.id, id, role]
    );
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};