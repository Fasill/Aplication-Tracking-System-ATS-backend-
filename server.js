import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from "./router/userAuthRouter.js";
import jobRouter from "./router/jobRouter.js";
import commentRouter from './router/commentRouter.js';
import userAuthRouter from './utils/uploadresume.js';
import candidateRouter from './router/candidateRouter.js';
import clientRouter from './router/clientRouter.js';

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(express.json());

app.use(router);
app.use(candidateRouter)
app.use('/jobs',jobRouter);
app.use('/comment',commentRouter);
app.use('/client',clientRouter)
app.use(userAuthRouter);

const port =  8080; // Use the environment-provided port or 8080 as a fallback

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});