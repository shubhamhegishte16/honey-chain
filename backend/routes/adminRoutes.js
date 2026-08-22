import express from 'express';
import {
  getAdminOverview,
  getAdminDashboard,
  getAllUsers,
  toggleUserVerification,
  getAllBatchesAdmin,
  getAllOrdersAdmin,
  getAllMarketplaceAdmin,
  toggleMarketplaceStatus
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/overview', protect, authorize('admin'), getAdminOverview);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/verify', protect, authorize('admin'), toggleUserVerification);
router.get('/batches', protect, authorize('admin'), getAllBatchesAdmin);
router.get('/orders', protect, authorize('admin'), getAllOrdersAdmin);
router.get('/marketplace', protect, authorize('admin'), getAllMarketplaceAdmin);
router.patch('/marketplace/:id/status', protect, authorize('admin'), toggleMarketplaceStatus);

export default router;
