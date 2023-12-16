import express from "express";

import {signUp,update,login,searchUser,verify} from "../controllers/userControllers/userAuthController.js";
import {send_otp,verify_otp} from "../controllers/userControllers/otpAndVerification.js";
import {requireAuth,requireAuth1,emaillogintokenverification,validateTokenMiddleware} from "../middleware/JwtMiddlewareToProtectHomePage.js";
import {addMember,verifyOtpLink} from "../controllers/userControllers/addUser.js"
import {loginByEmailMember,verifyTokenLink,loginByEmailRecuireteragency} from '../controllers/userControllers/loginByEmil.js';
import { allInfo,searchMember,deleteuser,updateMemberRole,RetrieveAllUsers } from "../controllers/userControllers/retrieveInfo.js";

import {FastLogin} from '../controllers/userControllers/TokenGeneratorForFastlLogin.js'

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
router.post("/verifyOtp,",requireAuth1,verify)
router.post("/adduser",addMember)
router.get("/verifyuser",verifyOtpLink)

router.post("/sendemailtologin",loginByEmailMember)
router.post("/sendemailtologinRecuireteragency",loginByEmailRecuireteragency)

router.get("/verifyLink",emaillogintokenverification,verifyTokenLink)


router.post("/allInfo",validateTokenMiddleware,allInfo)
router.post("/Searchmember",searchMember)

router.get("/deletemember",deleteuser)
router.post("/updateMemberRole",updateMemberRole)
router.get("/RetrieveAllUsers",validateTokenMiddleware,RetrieveAllUsers)

router.get('/FastLogin',FastLogin)

export default router;