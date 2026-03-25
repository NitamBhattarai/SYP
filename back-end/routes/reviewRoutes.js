import express from 'express';
import { submitReview, getPanditReviews, checkReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, submitReview);                    // submit review (user only)
router.get('/pandit/:id', getPanditReviews);                   // public - get reviews for a pandit
router.get('/check/:bookingId', verifyToken, checkReview);     // check if already reviewed

export default router;









