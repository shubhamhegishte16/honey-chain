import express from 'express';
import { getWarehouses, getWarehouseById, requestStorage, updateStorageStatus } from '../controllers/warehouseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getWarehouses);
router.get('/:id', getWarehouseById);
router.post('/request', protect, requestStorage);
router.patch('/status', protect, updateStorageStatus);

export default router;
