import express from 'express';
import aiRoutes from './ai.routes';
import documentRoutes from './document.routes';
import propertyRoutes from './property.routes';
import peopleRoutes from './people.routes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/ai', aiRoutes);
router.use('/documents', documentRoutes);
router.use('/properties', propertyRoutes);
router.use('/people', peopleRoutes);

export default router;
