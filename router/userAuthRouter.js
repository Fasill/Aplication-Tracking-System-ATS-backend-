import express from "express";

import {signUp,update,login,searchUser,verify} from "../controllers/userAuthController.js";
import {send_otp,verify_otp} from "../controllers/otpAndVerification.js";
import {requireAuth} from "../middleware/JwtMiddleware.js";
const router = express.Router()



router.post("/signUp",signUp);
router.post("/update", update)
router.post("/login",login);
router.post("/verify",requireAuth,verify)
router.get("/searchUser",searchUser);
router.get("/",(req,res)=>{
  res.send({message:"hello there"})
})


// otp verifications routers
router.post("/send-otp",send_otp);
router.post("/verify-otp",verify_otp);

export default router;