import express from 'express';
import {
  getAdminOverview,
  getAllUsers,
  toggleUserVerification,
  getAllBatchesAdmin,
  getAllOrdersAdmin
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/verify', protect, authorize('admin'), toggleUserVerification);
router.get('/batches', protect, authorize('admin'), getAllBatchesAdmin);
router.get('/orders', protect, authorize('admin'), getAllOrdersAdmin);

export default router;
