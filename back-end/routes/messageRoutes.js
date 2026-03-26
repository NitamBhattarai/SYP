import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getConversations, getMessages, sendMessage, startConversation } from '../controllers/messageController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.post('/', sendMessage);
router.post('/start', startConversation);

export default router;