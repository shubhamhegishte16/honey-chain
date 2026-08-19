import express from 'express';
import { getAllPrices, getPriceHistory, getMarketInsights, getMarketNews } from '../controllers/marketPriceController.js';

const router = express.Router();

router.get('/', getAllPrices);
router.get('/history', getPriceHistory);
router.get('/insights', getMarketInsights);
router.get('/news', getMarketNews);

export default router;
