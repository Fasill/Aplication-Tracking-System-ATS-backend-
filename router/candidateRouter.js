import express from 'express';
import multer from 'multer';
import addClient from '../controllers/candidateControllers/addClient.js';
import { validateTokenMiddleware } from '../middleware/JwtMiddlewareToProtectHomePage.js';

// Create an instance of Express Router
const candidateRouter = express.Router();

// Set up Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define the route for handling file uploads and add the middleware
candidateRouter.post('/upload-resume', validateTokenMiddleware, upload.single('filename'), addClient);

export default candidateRouter;
