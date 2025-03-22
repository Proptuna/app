import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabase.service';
import { ApiError } from '../middleware/error';
import httpStatus from 'http-status';

export const documentController = {
  async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await supabaseService.getDocuments();
      res.json(documents);
    } catch (error) {
      next(error);
    }
  },

  async getDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const document = await supabaseService.getDocumentById(id);
      
      if (!document) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
      }
      
      res.json(document);
    } catch (error) {
      next(error);
    }
  },

  async createDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async getDocumentTags(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async addTagToDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async removeTagFromDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  }
};
