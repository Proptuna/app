import { Request, Response, NextFunction } from 'express';
import supabaseService from '../services/supabase.service';
import { ApiError } from '../middleware/error';
import httpStatus from 'http-status';

export const peopleController = {
  async getPeople(req: Request, res: Response, next: NextFunction) {
    try {
      const people = await supabaseService.getPeople();
      res.json(people);
    } catch (error) {
      next(error);
    }
  },

  async getPersonById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const person = await supabaseService.getPersonById(id);
      
      if (!person) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Person not found');
      }
      
      res.json(person);
    } catch (error) {
      next(error);
    }
  },

  async createPerson(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async updatePerson(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async deletePerson(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async getPersonDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  },

  async getPersonProperties(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation will be added when needed
      res.status(httpStatus.NOT_IMPLEMENTED).json({ message: 'Not implemented yet' });
    } catch (error) {
      next(error);
    }
  }
};
