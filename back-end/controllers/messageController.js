import { db } from "../config/db.js";
import { createNotification } from "./notificationController.js";
const query = (...args) => db.promise().query(...args).then(([rows]) => rows);

// GET /api/messages/conversations — get all conversations for current user/pandit
export const getConversations = async (req, res) => {
  try {
    const { id, role } = req.user;
    let rows;

    if (role === 'user') {
      rows = await query(`
        SELECT 
          m.conversation_id,
          p.pandit_id AS other_id,
          p.full_name AS other_name,
          p.specialization,
          p.profile_pic AS other_pic,
          (SELECT text FROM messages WHERE conversation_id = m.conversation_id ORDER BY created_at DESC LIMIT 1) AS last_message,
          (SELECT created_at FROM messages WHERE conversation_id = m.conversation_id ORDER BY created_at DESC LIMIT 1) AS last_message_time,
          (SELECT COUNT(*) FROM messages WHERE conversation_id = m.conversation_id AND sender_role = 'pandit' AND is_read = 0) AS unread_count
        FROM conversations m
        JOIN pandits p ON m.pandit_id = p.pandit_id
        WHERE m.user_id = ?
        ORDER BY last_message_time DESC
      `, [id]);
    } else {
      rows = await query(`
        SELECT 
          m.conversation_id,
          u.user_id AS other_id,
          u.full_name AS other_name,
          NULL AS specialization,
          NULL AS other_pic,
          (SELECT text FROM messages WHERE conversation_id = m.conversation_id ORDER BY created_at DESC LIMIT 1) AS last_message,
          (SELECT created_at FROM messages WHERE conversation_id = m.conversation_id ORDER BY created_at DESC LIMIT 1) AS last_message_time,
          (SELECT COUNT(*) FROM messages WHERE conversation_id = m.conversation_id AND sender_role = 'user' AND is_read = 0) AS unread_count
        FROM conversations m
        JOIN users u ON m.user_id = u.user_id
        WHERE m.pandit_id = ?
        ORDER BY last_message_time DESC
      `, [id]);
    }

    res.json(rows);
  } catch (err) {
    console.error('getConversations error', err);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

// GET /api/messages/:conversationId — get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { id, role } = req.user;

    // verify user belongs to this conversation
    const conv = await query('SELECT * FROM conversations WHERE conversation_id = ?', [conversationId]);
    if (!conv.length) return res.status(404).json({ message: 'Conversation not found' });
    const c = conv[0];
    if (role === 'user' && c.user_id !== id) return res.status(403).json({ message: 'Forbidden' });
    if (role === 'pandit' && c.pandit_id !== id) return res.status(403).json({ message: 'Forbidden' });

    // mark messages as read
    const oppositeRole = role === 'user' ? 'pandit' : 'user';
    await query('UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_role = ?', [conversationId, oppositeRole]);

    const messages = await query(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    res.json(messages);
  } catch (err) {
    console.error('getMessages error', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// POST /api/messages — send a message (creates conversation if needed)
export const sendMessage = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { text, pandit_id, user_id, conversation_id } = req.body;

    if (!text?.trim()) return res.status(400).json({ message: 'Message text required' });

    let convId = conversation_id;

    if (!convId) {
      // find or create conversation
      const pId = role === 'user' ? pandit_id : id;
      const uId = role === 'user' ? id : user_id;

      if (!pId || !uId) return res.status(400).json({ message: 'pandit_id and user_id required' });

      const existing = await query(
        'SELECT conversation_id FROM conversations WHERE user_id = ? AND pandit_id = ?',
        [uId, pId]
      );

      if (existing.length) {
        convId = existing[0].conversation_id;
      } else {
        const result = await db.promise().query(
          'INSERT INTO conversations (user_id, pandit_id) VALUES (?, ?)',
          [uId, pId]
        );
        convId = result[0].insertId;
      }
    }

    await query(
      'INSERT INTO messages (conversation_id, sender_role, sender_id, text) VALUES (?, ?, ?, ?)',
      [convId, role, id, text.trim()]
    );

    // Notify the other party
    const conv = await query('SELECT * FROM conversations WHERE conversation_id = ?', [convId]);
    if (conv.length) {
      const c = conv[0];
      if (role === 'user') {
        const users = await query('SELECT full_name FROM users WHERE user_id = ?', [id]);
        const senderName = users[0]?.full_name || 'A user';
        await createNotification(c.pandit_id, 'pandit', '💬 New Message', `${senderName}: ${text.trim().slice(0, 60)}${text.length > 60 ? '...' : ''}`, '/messages');
      } else {
        const pandits = await query('SELECT full_name FROM pandits WHERE pandit_id = ?', [id]);
        const senderName = pandits[0]?.full_name || 'A pandit';
        await createNotification(c.user_id, 'user', '💬 New Message', `${senderName}: ${text.trim().slice(0, 60)}${text.length > 60 ? '...' : ''}`, '/messages');
      }
    }

    res.status(201).json({ message: 'Message sent', conversation_id: convId });
  } catch (err) {
    console.error('sendMessage error', err);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// POST /api/messages/start — start a conversation with a pandit (user only)
export const startConversation = async (req, res) => {
  try {
    if (req.user.role !== 'user') return res.status(403).json({ message: 'Forbidden' });
    const { pandit_id } = req.body;
    const user_id = req.user.id;

    const existing = await query(
      'SELECT conversation_id FROM conversations WHERE user_id = ? AND pandit_id = ?',
      [user_id, pandit_id]
    );

    if (existing.length) {
      return res.json({ conversation_id: existing[0].conversation_id });
    }

    const result = await db.promise().query(
      'INSERT INTO conversations (user_id, pandit_id) VALUES (?, ?)',
      [user_id, pandit_id]
    );
    res.status(201).json({ conversation_id: result[0].insertId });
  } catch (err) {
    console.error('startConversation error', err);
    res.status(500).json({ message: 'Error starting conversation' });
  }
};