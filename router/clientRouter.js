import express from 'express';
import {NotifyClient} from '../controllers/clientControllers/NotifyClient.js';
import {retrieveCandidates} from '../controllers/clientControllers/retrieveCandidateInfo.js';
import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {candidatetoken} from '../controllers/clientControllers/candidatetoken.js'
const clientRouter = express.Router();

clientRouter.post('/NotifyClient',NotifyClient)
clientRouter.get('/Candidates',retrieveCandidates)
clientRouter.post('/candidatetoken',candidatetoken)

export default clientRouter;