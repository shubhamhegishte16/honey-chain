import express from 'express';
import { getTraceabilityEvents, addTraceabilityEvent } from '../controllers/traceabilityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Publicly readable for QR scanning
router.get('/:batchId', getTraceabilityEvents);
router.post('/:batchId', protect, addTraceabilityEvent);

export default router;
