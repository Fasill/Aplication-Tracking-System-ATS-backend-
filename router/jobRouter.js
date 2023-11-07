import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {myJobs} from '../controllers/jobControllers/retrieveJobInfo.js'
const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob)
jobRouter.get('/myJobs',validateTokenMiddleware,myJobs)
export default jobRouter;