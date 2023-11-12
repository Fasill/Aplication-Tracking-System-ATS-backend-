import {generateToken} from "../utils/tokenGenerator.js"
import { Companies,Users } from "../models/User.js"


export const FastLogin = async (req, res) => {
    const email = 'teste1@g.com';
      
      
    
    const userSnapshot = await Users.where("email", "==", email).get();
    

    const userDoc = userSnapshot.docs[0];
    


        
    const userId = userDoc.id;
          
    return res.status(200).json({ message: "Fast Login Token", token:`${generateToken(userId)}` });
       
  }