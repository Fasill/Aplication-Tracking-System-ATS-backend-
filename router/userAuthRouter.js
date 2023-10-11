import express from "express"

import {signUp,update,login,searchUser,verify} from "../controlers/userAuthControler.js"
import {requireAuth} from "../middleware/JwtMiddleware.js"
const router = express.Router()



router.post("/signUp",signUp);
router.post("/update", update)
router.post("/login",login);
router.post("/verify",requireAuth,verify)
router.get("/searchUser",searchUser);
router.get("/",(req,res)=>{
  res.send({message:"hello there"})
})
export default router;