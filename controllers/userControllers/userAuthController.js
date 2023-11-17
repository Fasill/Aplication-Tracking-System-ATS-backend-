import bcrypt, { hash } from "bcrypt"
import {Users} from "../../models/User.js"
import {Companies} from "../../models/User.js"

import {generateToken} from "../../utils/tokenGenerator.js"
import { decodeTokenAndGetId } from '../../utils/decodeTokenAndGetId.js';


export const signUp = async (req, res) => {
  try {
    const {
      email,
      phoneNumber,
      name,
      password,
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Add the user to the database with the hashed password
    const userDoc = await Companies.add({
      email,
      type,
      phoneNumber,
      password: hashedPassword, // Store the hashed password in the database
      name,
      address,
      city,
      state,
      country,
      verified: false,
      users: []
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
    const {email,password,role} = req.body;
    console.log("role",role)
    if (role === 'Company'){
      
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      try {
        const userSnapshot = await Companies.where("email", "==", email).get();
        if (userSnapshot.empty) {
          return res.status(404).json({ message: "User not found." });
        }

        const userDoc = userSnapshot.docs[0];
        
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
    else if(role === 'Admin'||role === 'Recruiter'||role === 'Owner'){


        
        if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required." });
        }

        try {
          const userSnapshot = await Users.where("email", "==", email).get();
          if (userSnapshot.empty) {
            return res.status(404).json({ message: "User not found." });
          }

          const userDoc = userSnapshot.docs[0];
          if (!userDoc.data().password){
            return res.status(401).json({ message: "Unverified use try to login by email"});
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
    else{
        return res.status(404).json({ message: "User not found2." });

    }
  }

  export const update = async (req, res) => {
    const { token} = req.body;
    console.log(req.body)

    const userId = decodeTokenAndGetId(token);
    console.log("id",userId) 
    try {
      const {  email, name, phoneNumber, password } = req.body;

      var userRef = Users.doc(userId); // Get the document reference
      
      // Get the current data from the document
      const userDoc = await userRef.get();

      const companyRef = Companies.doc(userId); // Assuming 'Companies' is the collection reference for companies

      const companyDoc = await companyRef.get();
  
      if (userDoc.exists) {
        console.log("11111")
        const updatedData = {}; // Create an object to store updated fields
  
        if (email !== undefined && email !== "") {
          updatedData.email = email;
        }
        if (name !== undefined && name !== "") {
          updatedData.name = name;
        }
        if (phoneNumber !== undefined && phoneNumber !== "") {
          updatedData.phoneNumber = phoneNumber;
        }
        if (password !== undefined && password !== "") {
          // Hash the password before storing it
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          updatedData.password = hashedPassword;
        }
  
        await userRef.update(updatedData); // Update the document reference
  
        res.status(200).json({ message: 'User data updated successfully' });
      } else if(companyDoc.exists){


          const {address,city,country,state,} = req.body;

      
          const updatedData = {}; // Create an object to store updated fields

          if (email !== undefined && email !== "") {
            updatedData.email = email;
          }
          if (name !== undefined && name !== "") {
            updatedData.name = name;
          }
          if (phoneNumber !== undefined && phoneNumber !== "") {
            updatedData.phoneNumber = phoneNumber;
          }
          if (address !== undefined && address !== "") {
            updatedData.phoneNumber = address;
          }
          if (city !== undefined && city !== "") {
            updatedData.city = city;
          }
          if (country !== undefined && country !== "") {
            updatedData.country = country;
          }
          if (state !== undefined && state !== "") {
            updatedData.state = state;
          }
          if (password !== undefined && password !== "") {
            // Hash the password before storing it
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedData.password = hashedPassword;
          }
          console.log("2222222",updatedData)
    
          await companyRef.update(updatedData); // Update the document reference
    
          res.status(200).json({ message: 'User data updated successfully' });
        } else {
            res.status(404).json({ error: 'User or Company not found' });
        }
      }
     catch (e) {
      console.log(e);
      res.status(500).json({ error: 'An error occurred while updating user data' });
    }
  };
  


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

