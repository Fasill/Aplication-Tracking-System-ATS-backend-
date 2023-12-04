import express from 'express';
import multer from 'multer';
import addClient from '../controllers/candidateControllers/AddCandidate.js';
import { validateTokenMiddleware } from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {RetrieveCandidate} from '../controllers/candidateControllers/RetrieveCandidate.js';

// Create an instance of Express Router
const candidateRouter = express.Router();

// Set up Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

candidateRouter.post('/upload-resume', validateTokenMiddleware, upload.single('filename'), addClient);
candidateRouter.get('/get-candidates',validateTokenMiddleware,RetrieveCandidate);

export default candidateRouter;
