import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {myJobs,detail} from '../controllers/jobControllers/retrieveInfo.js';
import {MapUser,UnmapUser} from '../controllers/jobControllers/MapAndUnmapUser.js';
import {AcceptJob} from '../controllers/jobControllers/AccptJob.js'
    

const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob);
jobRouter.get('/myJobs',validateTokenMiddleware,myJobs);
jobRouter.get('/getdetail',validateTokenMiddleware,detail);
jobRouter.post('/MapUser',validateTokenMiddleware,MapUser);
jobRouter.delete('/UnmapUser',validateTokenMiddleware,UnmapUser);
jobRouter.post('/acceptJob',validateTokenMiddleware,AcceptJob)


export default jobRouter;