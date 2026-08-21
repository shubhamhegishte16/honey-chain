import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, getBuyerAnalytics } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/analytics/buyer', protect, getBuyerAnalytics);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);

export default router;
