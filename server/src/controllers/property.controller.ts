import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabase.service';
import { ApiError } from '../middleware/error';
import httpStatus from 'http-status';

// Mock data for testing UI
const mockProperties = [
  {
    id: '1',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    type: 'Apartment',
    tag: 'Residential'
  },
  {
    id: '2',
    address: '456 Market St',
    unit: '2B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    type: 'Condo',
    tag: 'Residential'
  },
  {
    id: '3',
    address: '789 Howard St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    type: 'Office',
    tag: 'Commercial'
  }
];

export const propertyController = {
  async getProperties(req: Request, res: Response, next: NextFunction) {
    try {
      // For testing UI, return mock data
      // In production, use: const properties = await supabaseService.getProperties();
      res.json(mockProperties);
    } catch (error) {
      next(error);
    }
  },

  async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // For testing UI, return mock data
      const property = mockProperties.find(p => p.id === id);
      
      if (!property) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
      }
      
      res.json(property);
    } catch (error) {
      next(error);
    }
  },

  async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async getPropertyDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  }
};
