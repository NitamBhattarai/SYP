import { db } from "../config/db.js";

const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// Fetch current pandit profile
export const getProfile = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const rows = await query(
      `SELECT pandit_id, full_name, email, bio, experience_years, specialization,
              location, languages, price_per_ceremony, profile_pic
       FROM pandits WHERE pandit_id = ?`,
      [panditId]
    );
    const profile = rows[0];
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("getProfile error", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update pandit profile (all editable fields)
export const updateProfile = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const {
      full_name,
      bio,
      experience_years,
      specialization,
      location,
      languages,
      price_per_ceremony,
      profile_pic,   // base64 string or null
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    // Limit profile_pic size (base64 of 2MB image ~= 2.7MB string)
    if (profile_pic && profile_pic.length > 3 * 1024 * 1024) {
      return res.status(400).json({ message: 'Profile picture too large (max 2MB)' });
    }

    await db.promise().query(
      `UPDATE pandits
       SET full_name = ?, bio = ?, experience_years = ?, specialization = ?,
           location = ?, languages = ?, price_per_ceremony = ?, profile_pic = ?
       WHERE pandit_id = ?`,
      [
        full_name.trim(),
        bio || null,
        experience_years || null,
        specialization || null,
        location || null,
        languages || null,
        price_per_ceremony || null,
        profile_pic || null,
        panditId,
      ]
    );
    res.json({ message: "Profile updated" });
  } catch (error) {
    console.error("updateProfile error", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// List pandit's own availability slots
export const listAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const rows = await query(
      "SELECT availability_id, available_date, start_time, end_time, status FROM availability WHERE pandit_id = ? ORDER BY available_date, start_time",
      [panditId]
    );
    res.json(rows);
  } catch (error) {
    console.error("listAvailability error", error);
    res.status(500).json({ message: "Error fetching availability" });
  }
};

export const addAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const { available_date, start_time, end_time } = req.body;
    if (!available_date || !start_time || !end_time) {
      return res.status(400).json({ message: "Date and time range required" });
    }
    await db.promise().query(
      "INSERT INTO availability (pandit_id, available_date, start_time, end_time) VALUES (?, ?, ?, ?)",
      [panditId, available_date, start_time, end_time]
    );
    res.status(201).json({ message: "Availability added" });
  } catch (error) {
    console.error("addAvailability error", error);
    res.status(500).json({ message: "Error adding availability" });
  }
};

export const removeAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'pandit') return res.status(403).json({ message: 'Forbidden' });
    const panditId = req.user.id;
    const { id } = req.params;

    const existing = await query(
      "SELECT status FROM availability WHERE availability_id = ? AND pandit_id = ?",
      [id, panditId]
    );
    if (!existing.length) return res.status(404).json({ message: "Slot not found" });
    if (existing[0].status === 'booked') {
      return res.status(400).json({ message: "Cannot delete a slot that is already booked" });
    }

    await db.promise().query(
      "DELETE FROM availability WHERE availability_id = ? AND pandit_id = ?",
      [id, panditId]
    );
    res.json({ message: "Availability removed" });
  } catch (error) {
    console.error("removeAvailability error", error);
    res.status(500).json({ message: "Error removing availability" });
  }
};
