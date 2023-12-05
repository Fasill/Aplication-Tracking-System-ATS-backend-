import express from 'express';
import multer from 'multer';
import {DeleteCandidate,addClient } from '../controllers/candidateControllers/CRUDCandidate.js'

import { validateTokenMiddleware } from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {RetrieveCandidate} from '../controllers/candidateControllers/RetrieveCandidate.js';

// Create an instance of Express Router
const candidateRouter = express.Router();

// Set up Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

candidateRouter.post('/upload-resume', validateTokenMiddleware, upload.single('filename'), addClient);
candidateRouter.get('/get-candidates',validateTokenMiddleware,RetrieveCandidate);
candidateRouter.delete('/delete-candidates',validateTokenMiddleware,DeleteCandidate)
export default candidateRouter;
