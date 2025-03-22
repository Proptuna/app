import express from 'express';
import { documentController } from '../controllers/document.controller';

const router = express.Router();

// Document endpoints
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.post('/', documentController.createDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.get('/:id/download', documentController.downloadDocument);

// Document tags endpoints
router.get('/:id/tags', documentController.getDocumentTags);
router.post('/:id/tags', documentController.addTagToDocument);
router.delete('/:id/tags/:tagId', documentController.removeTagFromDocument);

export default router;
