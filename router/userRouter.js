import express from "express"

const router = express()

router.get("/",(req,res)=>{
  res.end('Message: welcome');
})
router.post("/")
export default router