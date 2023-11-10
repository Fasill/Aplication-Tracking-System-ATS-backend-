import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {myJobs,detail} from '../controllers/jobControllers/retrieveJobInfo.js'
const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob);
jobRouter.get('/myJobs',validateTokenMiddleware,myJobs);
jobRouter.get('/getdetail',validateTokenMiddleware,detail);


export default jobRouter;