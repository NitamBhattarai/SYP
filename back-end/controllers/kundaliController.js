import { db } from "../config/db.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// POST /api/kundali — save a kundali
export const saveKundali = async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Only users can save kundalis' });

    const { name, dob, tob, pob, gender, zodiac, moon_rashi, ascendant, nakshatra, yoga, dasha, dasha_years, houses } = req.body;

    if (!name || !dob || !tob || !pob || !gender)
      return res.status(400).json({ message: 'All birth details are required' });

    const result = await db.promise().query(
      `INSERT INTO kundalis (user_id, name, dob, tob, pob, gender, zodiac, moon_rashi, ascendant, nakshatra, yoga, dasha, dasha_years, houses_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, dob, tob, pob, gender, zodiac, moon_rashi, ascendant, nakshatra, yoga, dasha, dasha_years, JSON.stringify(houses)]
    );

    res.status(201).json({ message: 'Kundali saved successfully', kundali_id: result[0].insertId });
  } catch (err) {
    console.error('saveKundali error', err);
    res.status(500).json({ message: 'Error saving kundali' });
  }
};

// GET /api/kundali — get all saved kundalis for current user
export const getKundalis = async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Forbidden' });

    const rows = await query(
      'SELECT * FROM kundalis WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const parsed = rows.map(k => ({
      ...k,
      houses: JSON.parse(k.houses_json || '[]')
    }));

    res.json(parsed);
  } catch (err) {
    console.error('getKundalis error', err);
    res.status(500).json({ message: 'Error fetching kundalis' });
  }
};

// DELETE /api/kundali/:id — delete a saved kundali
export const deleteKundali = async (req, res) => {
  try {
    if (req.user.role !== 'user')
      return res.status(403).json({ message: 'Forbidden' });

    const { id } = req.params;
    const existing = await query(
      'SELECT * FROM kundalis WHERE kundali_id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!existing.length)
      return res.status(404).json({ message: 'Kundali not found' });

    await query('DELETE FROM kundalis WHERE kundali_id = ?', [id]);
    res.json({ message: 'Kundali deleted successfully' });
  } catch (err) {
    console.error('deleteKundali error', err);
    res.status(500).json({ message: 'Error deleting kundali' });
  }
};