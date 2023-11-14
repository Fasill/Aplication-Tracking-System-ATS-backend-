import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {myJobs,detail,MappedJobs} from '../controllers/jobControllers/retrieveInfo.js';
import {MapAUser,MapUsers,UnmapUser} from '../controllers/jobControllers/MapAndUnmapUser.js';
import {AcceptJob} from '../controllers/jobControllers/AccptJob.js'
    

const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob);
jobRouter.get('/myJobs',validateTokenMiddleware,myJobs);
jobRouter.get('/getdetail',validateTokenMiddleware,detail);
jobRouter.post('/MapAUser',validateTokenMiddleware,MapAUser); // Map single user 
jobRouter.post('/MapUsers',validateTokenMiddleware,MapUsers); // Map multiple users
jobRouter.get('/MappedJobs',validateTokenMiddleware,MappedJobs);

jobRouter.delete('/UnmapUser',validateTokenMiddleware,UnmapUser);
jobRouter.post('/acceptJob',validateTokenMiddleware,AcceptJob)

export default jobRouter;