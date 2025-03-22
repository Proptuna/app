import express from 'express';
import aiController from '../controllers/ai.controller';

const router = express.Router();

// Chat endpoint
router.post('/chat', aiController.sendMessage);

// Conversations endpoints
router.get('/conversations', aiController.getConversations);
router.get('/conversations/:id', aiController.getConversation);
router.post('/conversations', aiController.createConversation);
router.put('/conversations/:id', aiController.updateConversation);
router.delete('/conversations/:id', aiController.deleteConversation);

export default router;
