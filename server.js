import router from "./router/userAuthRouter.js";
import jobRouter from "./router/jobRouter.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(express.json());

app.use(router);
app.use('/jobs',jobRouter)

const port =  8080; // Use the environment-provided port or 8080 as a fallback

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});