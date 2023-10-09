import router from './router/userAuthRouter'
import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json())

app.use("/", router)

app.get("/",(req,res)=>{
  res.end('Message:wolcoom')
})

const port = 8080

app.listen(port ,()=>{console.log(`server starteed on port http://localhost:${port}/`)})