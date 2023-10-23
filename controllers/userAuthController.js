import bcrypt from "bcrypt"
import {Users} from "../models/User.js"
import {Companies} from "../models/User.js"

import {generateToken} from "../utils/tokenGenerator.js"


export const signUp = async (req, res) => {
  try {
    const {
      email,
      phoneNumber,
      name,
      address,
      city,
      state,
      country,
      type
    } = req.body;

    // Check if the user with the same email already exists
    const userSnapshot = await Companies.where("email", "==", email).get();
    if (userSnapshot.docs.length > 0) {
      res.status(400).json({ message: 'User already registered.' });
      return;
    }

    // Hash the password before storing it
    // Note: Since you're not taking a password input in the React form, you don't need to hash it here

    // Add the user to the database
    const userDoc = await Companies.add({
      email,
      type,
      phoneNumber,
      name,
      address,
      city,
      state,
      country,
      verified: false,
      users:[]
    });

    const userId = userDoc.id;

    // Generate a token for the user
    const token = generateToken(userId);

    res.status(201).json({ message: 'User data saved successfully.', token });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// LoginAsChannelPartner ,LoginAsEmployer,LoginAsSupplier

export const login = async (req, res) => {
    const {email,password,type} = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    try {
      const userSnapshot = await Users.where("email", "==", email).get();
      if (userSnapshot.empty) {
        return res.status(404).json({ message: "User not found." });
      }

      const userDoc = userSnapshot.docs[0];
      if (userDoc.data().type !== type){
        return res.status(404).json({ message: "User not found2." });

      }
      const hashedPassword = userDoc.data().password;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        const userId = userDoc.id;
        console.log(generateToken(userId))
        return res.status(200).json({ message: "Logged in", token:`${generateToken(userId)}` });
      } else {
        return res.status(401).json({ message: "Authentication failed. Incorrect password." });
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

export const update = async(req,res)=>{
  const id = req.body.id
  try{
    console.log("before deleting ",req.body)
    delete req.body.id
    const data = req.body
    await Users.doc(id).update(data);
    console.log("after deleting ",req.body)

    res.send({msg:"updated"})
  }catch(e){console.log(e)}

}


export const searchUser = (req, res) => {
    const userName = req.query.name;
  
    if (!userName) {
      return res.status(400).json({ error: "Name parameter is required." });
    }
  
  
    const query = Users.where("name", "==", userName);
  
    query.get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          return res.status(404).json({ message: "User not found." });
        } else {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, data: doc.data() });
          });
          return res.status(200).json(users);
        }
      })
      .catch((error) => {
        console.error("Error searching for user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  }
export const verify = (req, res)=>{
  res.send({message:"allgood"})
}

