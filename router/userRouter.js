import express from "express"

const router = express()

router.get("/",(req,res)=>{
  res.end('Message: welcome');
})

export default router