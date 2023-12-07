import express from 'express';
import multer from 'multer';
import {addCandidate,editCandidate } from '../controllers/candidateControllers/CRUDCandidate.js'
import {DeleteCandidate} from '../models/User.js'
import { validateTokenMiddleware } from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {RetrieveAllCandidatesForRecruiters,RetrieveCandidateUnderAJobForRecruiters,RetrieveCandidateForAdmins,searchByEmail,RetrieveCandidatesForAdminOrRecruiter} from '../controllers/candidateControllers/RetrieveCandidate.js';
import {AllCandidates} from '../controllers/candidateControllers/AllCandidates.js';
// Create an instance of Express Router
const candidateRouter = express.Router();

// Set up Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

candidateRouter.post('/upload-resume', validateTokenMiddleware, upload.single('filename'), addCandidate);
candidateRouter.put('/edit-candidates',validateTokenMiddleware,editCandidate);
candidateRouter.get('/get-candidates',validateTokenMiddleware,RetrieveCandidateUnderAJobForRecruiters);
candidateRouter.get('/get-all-candidates',validateTokenMiddleware,RetrieveCandidateForAdmins);
candidateRouter.get('/get-all-candidates2',validateTokenMiddleware,RetrieveAllCandidatesForRecruiters);

candidateRouter.get('/RetrieveCandidatesForAdminOrRecruiter',validateTokenMiddleware,RetrieveCandidatesForAdminOrRecruiter);

candidateRouter.get('/All-Candidates',validateTokenMiddleware,AllCandidates);

candidateRouter.get('/get-candidates-by-email',validateTokenMiddleware,searchByEmail);

candidateRouter.delete('/delete-candidates',validateTokenMiddleware,DeleteCandidate);


export default candidateRouter;
