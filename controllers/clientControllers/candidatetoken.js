import { generateTokenForClient } from "../../utils/tokenGenerator.js";
import { getEmailFromToken } from "../../utils/decodeTokenAndGetId.js";

export const candidatetoken = (req,res)=>{
    const {email} = req.body;
   const token =  generateTokenForClient(email)
    res.send({"email":getEmailFromToken(token),"token":token})
}