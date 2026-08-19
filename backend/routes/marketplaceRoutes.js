import express from 'express';
import { getListings, getListingById, createListing } from '../controllers/marketplaceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/listings', getListings);
router.get('/listings/:id', getListingById);
router.post('/listings', protect, createListing);

export default router;
