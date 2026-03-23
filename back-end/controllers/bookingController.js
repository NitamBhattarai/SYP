import { db } from "../config/db.js";
import { createNotification } from "./notificationController.js";

const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// create a booking (user)
export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Forbidden' });
    const userId = req.user.id;
    const { pandit_id, service_id, booking_date, event_date, availability_id } = req.body;
    if (!pandit_id || !service_id || !booking_date || !event_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const p = await query('SELECT * FROM pandits WHERE pandit_id = ?', [pandit_id]);
    if (!p.length) return res.status(400).json({ message: 'Pandit not found' });

    if (availability_id) {
      const rows = await query(
        'SELECT * FROM availability WHERE availability_id = ? AND pandit_id = ? AND status = ?',
        [availability_id, pandit_id, 'available']
      );
      if (!rows.length) return res.status(400).json({ message: 'Selected time slot not available' });
    }

    const result = await db.promise().query(
      'INSERT INTO bookings (user_id, pandit_id, service_id, booking_date, event_date, status, availability_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, pandit_id, service_id, booking_date, event_date, 'pending', availability_id || null]
    );

    if (availability_id) {
      await db.promise().query('UPDATE availability SET status = ? WHERE availability_id = ?', ['booked', availability_id]);
    }

    // Get user name for notification
    const users = await query('SELECT full_name FROM users WHERE user_id = ?', [userId]);
    const userName = users[0]?.full_name || 'A user';
    const services = await query('SELECT service_name FROM services WHERE service_id = ?', [service_id]);
    const serviceName = services[0]?.service_name || 'a ceremony';

    // Notify pandit
    await createNotification(
      pandit_id, 'pandit',
      '🙏 New Booking Request',
      `${userName} has requested you for ${serviceName} on ${event_date}.`,
      '/pandit/bookings'
    );

    res.status(201).json({ message: 'Booking created', bookingId: result[0].insertId });
  } catch (error) {
    console.error('createBooking error', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// list bookings for user
export const listUserBookings = async (req, res) => {
  try {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Forbidden' });
    const userId = req.user.id;
    const rows = await query(
      `SELECT b.*, p.full_name as pandit_name, s.service_name,
              a.available_date, a.start_time, a.end_time
       FROM bookings b
       JOIN pandits p ON b.pandit_id = p.pandit_id
       JOIN services s ON b.service_id = s.service_id
       LEFT JOIN availability a ON b.availability_id = a.availability_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('listUserBookings error', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// list bookings for pandit
export const listPanditBookings = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const rows = await query(
      `SELECT b.*, u.full_name as user_name, s.service_name,
              a.available_date, a.start_time, a.end_time
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN services s ON b.service_id = s.service_id
       LEFT JOIN availability a ON b.availability_id = a.availability_id
       WHERE b.pandit_id = ?
       ORDER BY b.booking_date DESC`,
      [panditId]
    );
    res.json(rows);
  } catch (error) {
    console.error('listPanditBookings error', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// update booking status (pandit or user)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['user','pandit'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    if (!['pending','confirmed','completed','cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await query('SELECT * FROM bookings WHERE booking_id = ?', [id]);
    if (!booking.length) return res.status(404).json({ message: 'Booking not found' });
    const b = booking[0];
    const userId = req.user.id;

    if (req.user.role === 'user' && b.user_id !== userId) return res.status(403).json({ message: 'Forbidden' });
    if (req.user.role === 'pandit' && b.pandit_id !== userId) return res.status(403).json({ message: 'Forbidden' });

    await db.promise().query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);

    // Get names for notifications
    const users = await query('SELECT full_name FROM users WHERE user_id = ?', [b.user_id]);
    const pandits = await query('SELECT full_name FROM pandits WHERE pandit_id = ?', [b.pandit_id]);
    const userName = users[0]?.full_name || 'The user';
    const panditName = pandits[0]?.full_name || 'The pandit';

    // Fire notifications based on status
    if (status === 'confirmed') {
      await createNotification(
        b.user_id, 'user',
        '✅ Booking Confirmed!',
        `${panditName} has confirmed your booking for ${b.event_date}.`,
        '/bookings'
      );
    } else if (status === 'completed') {
      await createNotification(
        b.user_id, 'user',
        '🙏 Puja Completed',
        `Your ceremony with ${panditName} has been marked as completed. Please leave a review!`,
        '/bookings'
      );
    } else if (status === 'cancelled') {
      if (req.user.role === 'user') {
        // User cancelled — notify pandit
        await createNotification(
          b.pandit_id, 'pandit',
          '❌ Booking Cancelled',
          `${userName} has cancelled their booking for ${b.event_date}.`,
          '/pandit/bookings'
        );
      } else {
        // Pandit cancelled — notify user
        await createNotification(
          b.user_id, 'user',
          '❌ Booking Cancelled',
          `${panditName} has cancelled your booking for ${b.event_date}. Please find another pandit.`,
          '/bookings'
        );
      }
    }

    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('updateBookingStatus error', error);
    res.status(500).json({ message: 'Error updating status' });
  }
};