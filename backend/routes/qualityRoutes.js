import express from 'express';
import { submitAssessment, aiPreliminaryEstimate, getBatchAssessment } from '../controllers/qualityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/ai-estimate', aiPreliminaryEstimate);
router.post('/assess', protect, submitAssessment);
router.get('/batch/:batchId', getBatchAssessment);

export default router;
