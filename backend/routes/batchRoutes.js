import express from 'express';
import { createBatch, getFarmerBatches, getBatchById, getPublicBatch, getFarmerStats } from '../controllers/batchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/public/:batchId', getPublicBatch);
router.get('/stats', protect, getFarmerStats);
router.get('/', protect, getFarmerBatches);
router.get('/:id', protect, getBatchById);
router.post('/', protect, createBatch);

export default router;
