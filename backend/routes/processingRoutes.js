import express from 'express';
import {
  getProcessors,
  getProcessorStats,
  getProcessingRequests,
  getIncomingBatches,
  markBatchReceived,
  getActiveProcessing,
  requestProcessing,
  updateProcessingStatus,
  getProcessingHistory,
  getProcessedProducts,
  getProcessorBatches,
} from '../controllers/processingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/processors', getProcessors);

// Processor-authenticated routes
router.get('/stats', protect, getProcessorStats);
router.get('/requests', protect, getProcessingRequests);
router.post('/requests', protect, requestProcessing);
router.patch('/requests/:id/status', protect, updateProcessingStatus);
router.get('/incoming', protect, getIncomingBatches);
router.patch('/batches/:id/receive', protect, markBatchReceived);
router.get('/active', protect, getActiveProcessing);
router.get('/history', protect, getProcessingHistory);
router.get('/products', protect, getProcessedProducts);
router.get('/batches', protect, getProcessorBatches);

export default router;
