import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {myJobs,detail,MappedJobs} from '../controllers/jobControllers/retrieveInfo.js';
import {MapAUser,MapUsers,UnmapUser} from '../controllers/jobControllers/MapAndUnmapUser.js';
import {AcceptJob,rejectJob} from '../controllers/jobControllers/AcceptRejectJob.js';
    

const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob);
jobRouter.get('/myJobs',validateTokenMiddleware,myJobs);
jobRouter.get('/getdetail',validateTokenMiddleware,detail);
jobRouter.post('/MapAUser',validateTokenMiddleware,MapAUser); 
jobRouter.post('/MapUsers',validateTokenMiddleware,MapUsers);
jobRouter.get('/MappedJobs',validateTokenMiddleware,MappedJobs);
jobRouter.delete('/UnmapUser',validateTokenMiddleware,UnmapUser);

jobRouter.post('/acceptJob',validateTokenMiddleware,AcceptJob);
jobRouter.delete('/rejectJob',validateTokenMiddleware,rejectJob);


export default jobRouter;