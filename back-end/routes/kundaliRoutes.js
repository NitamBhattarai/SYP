import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { saveKundali, getKundalis, deleteKundali } from '../controllers/kundaliController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', saveKundali);
router.get('/', getKundalis);
router.delete('/:id', deleteKundali);

export default router;