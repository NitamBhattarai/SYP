import { db } from "../config/db.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// GET /api/lookup/pandits — public, only approved pandits
export const listPandits = async (req, res) => {
  try {
    const rows = await query(
      `SELECT p.pandit_id, p.full_name, p.email, p.phone, p.location, p.specialization,
              p.bio, p.languages, p.price_per_ceremony, p.experience_years,
              p.profile_pic,
              ROUND(AVG(r.rating), 1)  AS avg_rating,
              COUNT(r.review_id)        AS review_count
       FROM pandits p
       LEFT JOIN reviews r ON r.pandit_id = p.pandit_id
       WHERE p.status = 'approved'
       GROUP BY p.pandit_id
       ORDER BY avg_rating DESC, p.experience_years DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('listPandits error', err);
    res.status(500).json({ message: 'Error fetching pandits' });
  }
};

// GET /api/lookup/pandits/:id — single pandit public profile
export const getPanditById = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT p.pandit_id, p.full_name, p.email, p.phone, p.location, p.specialization,
              p.bio, p.languages, p.price_per_ceremony, p.experience_years,
              p.profile_pic,
              ROUND(AVG(r.rating), 1)  AS avg_rating,
              COUNT(r.review_id)        AS review_count
       FROM pandits p
       LEFT JOIN reviews r ON r.pandit_id = p.pandit_id
       WHERE p.pandit_id = ? AND p.status = 'approved'
       GROUP BY p.pandit_id`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Pandit not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getPanditById error', err);
    res.status(500).json({ message: 'Error fetching pandit' });
  }
};

// GET /api/lookup/services
export const listServices = async (req, res) => {
  try {
    const rows = await query("SELECT service_id, service_name FROM services");
    res.json(rows);
  } catch (err) {
    console.error('listServices error', err);
    res.status(500).json({ message: 'Error fetching services' });
  }
};

// GET /api/lookup/availability/pandit/:id
export const listPanditAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query(
      `SELECT availability_id, available_date, start_time, end_time, status
       FROM availability WHERE pandit_id = ? AND status = 'available'`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error('listPanditAvailability error', err);
    res.status(500).json({ message: 'Error fetching availability' });
  }
};