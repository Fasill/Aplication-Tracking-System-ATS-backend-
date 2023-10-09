import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.end('Message: welcome');
});

const port =  8080; // Use the environment-provided port or 8080 as a fallback

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});