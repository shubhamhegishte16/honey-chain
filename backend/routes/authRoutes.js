import express from 'express';
import { register, login, getMe, updateProfile, getAllDemoUsers, getSavedListings, saveListing, removeSavedListing } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/demo-users', getAllDemoUsers);

// Saved Listings
router.get('/saved-listings', protect, getSavedListings);
router.post('/saved-listings/:listingId', protect, saveListing);
router.delete('/saved-listings/:listingId', protect, removeSavedListing);

export default router;
