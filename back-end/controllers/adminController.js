import { db } from "../config/db.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [[pandits]]  = await db.promise().query("SELECT COUNT(*) as c FROM pandits");
    const [[pending]]  = await db.promise().query("SELECT COUNT(*) as c FROM pandits WHERE status='pending'");
    const [[users]]    = await db.promise().query("SELECT COUNT(*) as c FROM users");
    const [[bookings]] = await db.promise().query("SELECT COUNT(*) as c FROM bookings");
    const [[pBookings]]= await db.promise().query("SELECT COUNT(*) as c FROM bookings WHERE status='pending'");
    const [[completed]]= await db.promise().query("SELECT COUNT(*) as c FROM bookings WHERE status='completed'");

    res.json({
      total_pandits:    pandits.c,
      pending_pandits:  pending.c,
      total_users:      users.c,
      total_bookings:   bookings.c,
      pending_bookings: pBookings.c,
      completed_pujas:  completed.c,
    });
  } catch (err) {
    console.error('getStats error', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// GET /api/admin/pandits
export const getAllPandits = async (req, res) => {
  try {
    const rows = await query(
      `SELECT pandit_id, full_name, email, location, specialization,
              experience_years, price_per_ceremony, status, created_at
       FROM pandits ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllPandits error', err);
    res.status(500).json({ message: 'Error fetching pandits' });
  }
};

// PUT /api/admin/pandits/:id/status
export const updatePanditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['approved', 'rejected', 'suspended', 'pending'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    await query("UPDATE pandits SET status = ? WHERE pandit_id = ?", [status, id]);
    res.json({ message: `Pandit ${status} successfully` });
  } catch (err) {
    console.error('updatePanditStatus error', err);
    res.status(500).json({ message: 'Error updating pandit status' });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.user_id, u.full_name, u.email, u.created_at,
              COUNT(b.booking_id) as booking_count
       FROM users u
       LEFT JOIN bookings b ON b.user_id = u.user_id
       GROUP BY u.user_id ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM bookings WHERE user_id = ?", [id]);
    await query("DELETE FROM users WHERE user_id = ?", [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
  try {
    const rows = await query(
      `SELECT b.booking_id, b.event_date, b.status,
              u.full_name  as user_name,
              p.full_name  as pandit_name,
              s.service_name
       FROM bookings b
       JOIN users    u ON u.user_id    = b.user_id
       JOIN pandits  p ON p.pandit_id  = b.pandit_id
       LEFT JOIN services s ON s.service_id = b.service_id
       ORDER BY b.booking_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllBookings error', err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};
