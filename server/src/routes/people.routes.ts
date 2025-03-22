import express from 'express';
import { peopleController } from '../controllers/people.controller';

const router = express.Router();

// People endpoints
router.get('/', peopleController.getPeople);
router.get('/:id', peopleController.getPersonById);
router.post('/', peopleController.createPerson);
router.put('/:id', peopleController.updatePerson);
router.delete('/:id', peopleController.deletePerson);

// Person associations
router.get('/:id/documents', peopleController.getPersonDocuments);
router.get('/:id/properties', peopleController.getPersonProperties);

export default router;
