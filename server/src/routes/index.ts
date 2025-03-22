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

// API v1 routes
router.use('/v1/ai', aiRoutes);
router.use('/v1/documents', documentRoutes);
router.use('/v1/properties', propertyRoutes);
router.use('/v1/people', peopleRoutes);

export default router;
