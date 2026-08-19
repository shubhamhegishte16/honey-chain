import express from 'express';
import { getProcessors, getProcessingRequests, requestProcessing, updateProcessingStatus } from '../controllers/processingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/processors', getProcessors);
router.get('/requests', protect, getProcessingRequests);
router.post('/requests', protect, requestProcessing);
router.patch('/requests/:id/status', protect, updateProcessingStatus);

export default router;
