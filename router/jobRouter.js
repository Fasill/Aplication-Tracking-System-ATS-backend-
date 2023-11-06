import express from "express";

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import {AddJob} from '../controllers/jobControllers/AddJob.js';

const jobRouter = express.Router()


jobRouter.post('/add',validateTokenMiddleware,AddJob)

export default jobRouter;