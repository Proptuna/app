import express from 'express';
import { propertyController } from '../controllers/property.controller';

const router = express.Router();

// Property endpoints
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

// Property associations
router.get('/:id/documents', propertyController.getPropertyDocuments);
// Temporarily commented out until implementation is added
// router.get('/:id/people', propertyController.getPropertyPeople);

export default router;
