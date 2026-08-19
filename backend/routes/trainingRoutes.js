import express from 'express';
import { getTrainingResources, getTrainingResourceById, aiAssistantChat } from '../controllers/trainingController.js';

const router = express.Router();

router.get('/', getTrainingResources);
router.get('/:id', getTrainingResourceById);
router.post('/chat', aiAssistantChat);

export default router;
