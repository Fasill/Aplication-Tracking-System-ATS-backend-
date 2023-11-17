import express from 'express';

import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';
import getJobComments from '../controllers/commentControllers/getComments.js'
import addComment from '../controllers/commentControllers/addComments.js'

const commentRouter = express.Router();

commentRouter.get('/get',validateTokenMiddleware,getJobComments);
commentRouter.post('/add',validateTokenMiddleware,addComment)

export default commentRouter;