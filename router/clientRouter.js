import express from 'express';
import {NotifyClient} from '../controllers/clientControllers/NotifyClient.js';
import {retrieveCandidates} from '../controllers/clientControllers/retrieveCandidateInfo.js';
import {verifyTokenMiddlewareForClient} from '../middleware/jwtmiddlewareforClient.js';
import {candidatetoken} from '../controllers/clientControllers/candidatetoken.js';

const clientRouter = express.Router();

clientRouter.post('/NotifyClient',verifyTokenMiddlewareForClient,NotifyClient);
clientRouter.get('/Candidates',verifyTokenMiddlewareForClient,retrieveCandidates);
clientRouter.get('/verify',verifyTokenMiddlewareForClient,(req,res)=>{res.status(200).send({message:"all good"})})
clientRouter.post('/candidatetoken',candidatetoken);

export default clientRouter;