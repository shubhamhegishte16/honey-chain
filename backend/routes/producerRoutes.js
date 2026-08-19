import express from 'express';
import { getProducers, getProducerById } from '../controllers/producerController.js';

const router = express.Router();

router.get('/', getProducers);
router.get('/:id', getProducerById);

export default router;
