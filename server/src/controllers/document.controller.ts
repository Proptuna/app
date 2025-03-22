import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabase.service';
import { ApiError } from '../middleware/error';
import httpStatus from 'http-status';

export const documentController = {
  async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract query parameters for filtering
      const { property_id, person_id, tag_id } = req.query;
      
      // Fetch documents from the database
      const documents = await supabaseService.getDocuments();
      
      // Apply filters if needed (this would be better handled at the database level)
      let filteredDocuments = documents;
      
      // Return the documents in the format expected by the client
      res.json({
        data: filteredDocuments,
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async getDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Fetch document from the database
      const document = await supabaseService.getDocumentById(id);
      
      if (!document) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
      }
      
      // Return the document in the format expected by the client
      res.json({
        data: document,
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async createDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentData = req.body;
      
      // Validate required fields
      if (!documentData.title) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document title is required');
      }
      
      // Create document in database
      const document = await supabaseService.createDocument(documentData);
      
      // Return the document in the format expected by the client
      res.status(httpStatus.CREATED).json({
        data: document,
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Check if document exists
      const existingDocument = await supabaseService.getDocumentById(id);
      if (!existingDocument) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
      }
      
      // Update document
      const updatedDocument = await supabaseService.updateDocument(id, updates);
      
      // Return the document in the format expected by the client
      res.json({
        data: updatedDocument,
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Delete document from the database
      const result = await supabaseService.deleteDocument(id);
      
      if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
      }
      
      // Return success response
      res.json({
        data: { id },
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async downloadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Fetch document from the database
      const document = await supabaseService.getDocumentById(id);
      
      if (!document) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document not found');
      }
      
      // For markdown documents, we can send the content directly
      if (document.type === 'markdown' || document.type === 'text') {
        const content = document.data || '';
        const fileName = `${document.title}.md`;
        
        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'text/markdown');
        
        // Send the content directly
        return res.send(content);
      }
      
      // For other document types, get the file URL from Supabase storage
      const fileUrl = await supabaseService.getDocumentFileUrl(id);
      
      if (!fileUrl) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document file not found');
      }
      
      // Return the file URL in the response
      res.json({
        data: { fileUrl },
        success: true
      });
    } catch (error) {
      next(error);
    }
  },

  async getDocumentTags(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({
        data: null,
        success: false,
        message: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  async addTagToDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({
        data: null,
        success: false,
        message: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  async removeTagFromDocument(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({
        data: null,
        success: false,
        message: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  }
};
