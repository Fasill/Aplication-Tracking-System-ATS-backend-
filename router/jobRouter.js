import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';
import {EditJob,deleteAJob} from '../controllers/jobControllers/EditJob.js';
import {myJobs,detail,MappedJobs,AcceptedJobs,retrieveUserRole} from '../controllers/jobControllers/retrieveInfo.js';
import {MapAUser,MapUsers,UnmapUser} from '../controllers/jobControllers/MapAndUnmapUser.js';
import {AcceptJob,rejectJob} from '../controllers/jobControllers/AcceptAndRejectJob.js';


const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob);

jobRouter.put('/edit',validateTokenMiddleware,EditJob);
jobRouter.delete('/delete',validateTokenMiddleware,deleteAJob);

jobRouter.get('/myJobs',validateTokenMiddleware,myJobs);

jobRouter.get('/getdetail',validateTokenMiddleware,detail);

jobRouter.post('/MapAUser',validateTokenMiddleware,MapAUser); 
jobRouter.post('/MapUsers',validateTokenMiddleware,MapUsers);
jobRouter.get('/MappedJobs',validateTokenMiddleware,MappedJobs);

jobRouter.delete('/UnmapUser',validateTokenMiddleware,UnmapUser);

jobRouter.post('/acceptJob',validateTokenMiddleware,AcceptJob);
jobRouter.get('/AcceptedJobs',validateTokenMiddleware,AcceptedJobs);

jobRouter.delete('/rejectJob',validateTokenMiddleware,rejectJob);

jobRouter.get('/retrieveUserRole',validateTokenMiddleware,retrieveUserRole);// retrieves user role i specific job


export default jobRouter;