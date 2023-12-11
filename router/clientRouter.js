import express from 'express';
import {NotifyClient} from '../controllers/clientControllers/NotifyClient.js';
import {retrieveCandidates} from '../controllers/clientControllers/retrieveCandidateInfo.js';
import {verifyTokenMiddlewareForClient} from '../middleware/jwtmiddlewareforClient.js';
import {candidatetoken} from '../controllers/clientControllers/candidatetoken.js';
import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {searchByEmail} from  '../controllers/candidateControllers/RetrieveCandidate.js';

const clientRouter = express.Router();

clientRouter.post('/NotifyClient',validateTokenMiddleware,NotifyClient);
clientRouter.get('/Candidates',verifyTokenMiddlewareForClient,retrieveCandidates);
clientRouter.get('/verify',verifyTokenMiddlewareForClient,(req,res)=>{res.status(200).send({message:"all good"})})
clientRouter.post('/candidatetoken',candidatetoken);
clientRouter.get('/get-candidates-by-email-client',verifyTokenMiddlewareForClient,searchByEmail);

export default clientRouter;