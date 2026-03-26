import { db } from "../config/db.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// POST /api/reviews — user submits a review after completed booking
export const submitReview = async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Only users can submit reviews' });

    const { booking_id, rating, comment } = req.body;
    const userId = req.user.id;

    if (!booking_id || !rating)
      return res.status(400).json({ message: 'booking_id and rating are required' });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // verify booking exists, belongs to user, and is completed
    const bookings = await query(
      'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?',
      [booking_id, userId]
    );
    if (!bookings.length)
      return res.status(404).json({ message: 'Booking not found' });

    const booking = bookings[0];
    if (booking.status !== 'completed')
      return res.status(400).json({ message: 'You can only review completed bookings' });

    // check if already reviewed
    const existing = await query(
      'SELECT review_id FROM reviews WHERE booking_id = ?',
      [booking_id]
    );
    if (existing.length)
      return res.status(400).json({ message: 'You have already reviewed this booking' });

    await query(
      'INSERT INTO reviews (booking_id, user_id, pandit_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [booking_id, userId, booking.pandit_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('submitReview error', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
};

// GET /api/reviews/pandit/:id — get all reviews for a pandit (public)
export const getPanditReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT r.review_id, r.rating, r.comment, r.created_at,
              u.full_name as user_name
       FROM reviews r
       JOIN users u ON u.user_id = r.user_id
       WHERE r.pandit_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getPanditReviews error', err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// GET /api/reviews/check/:bookingId — check if user already reviewed a booking
export const checkReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const rows = await query(
      'SELECT review_id, rating, comment FROM reviews WHERE booking_id = ?',
      [bookingId]
    );
    res.json({ reviewed: rows.length > 0, review: rows[0] || null });
  } catch (err) {
    console.error('checkReview error', err);
    res.status(500).json({ message: 'Error checking review' });
  }
};









