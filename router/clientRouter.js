import express from 'express';
import {NotifyClient} from '../controllers/clientControllers/NotifyClient.js';
import {validateTokenMiddleware} from '../middleware/JwtMiddlewareToProtectHomePage.js';

const clientRouter = express.Router();

clientRouter.post('/NotifyClient',NotifyClient)

export default clientRouter;