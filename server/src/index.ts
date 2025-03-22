import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import routes from './routes';
import { ApiError } from './middleware/error';
import httpStatus from 'http-status';

/**
 * Error handling middleware
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);
  
  // Handle API errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode
    });
  } else {
    // Handle other errors
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      error: err.message || 'Internal Server Error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Initialize Express application
 */
const initializeApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both default Vite port and Express port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  
  // Serve static files from the public directory
  const publicPath = path.join(__dirname, '../../public');
  app.use(express.static(publicPath));
  console.log(`Serving static files from: ${publicPath}`);
  
  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'Server is running',
      environment: config.server.env
    });
  });
  
  // API routes
  app.use('/api', routes);
  
  // Error handling middleware (must be last)
  app.use(errorHandler);
  
  return app;
};

/**
 * Start the server
 */
const startServer = () => {
  try {
    const app = initializeApp();
    const port = config.server.port;
    
    app.listen(port, () => {
      console.log(`Server running on port ${port} in ${config.server.env} mode`);
      console.log(`Health check available at: http://localhost:${port}/api/health`);
      console.log(`API endpoints available at: http://localhost:${port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing
export { initializeApp };
