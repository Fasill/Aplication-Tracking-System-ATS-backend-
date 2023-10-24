import { decodeTokenAndGetId } from '../utils/decodeTokenAndGetId.js';
import { Users } from '../models/User.js';
import { Companies } from "../models/User.js"




export const searchMember = async(req,res)=>{
  const {token,name} = req.body;
  const id = decodeTokenAndGetId(token);
  console.log(name,token)
  if (name && name.length > 0){
  try {
    // First, search in the "Companies" collection
    const companyRef = Companies.doc(id);
    const companyDoc = await companyRef.get();

    if (companyDoc.exists) {
      const usersQuery = await Users.where('company', '==', id).where('name', '>=', name).where('name', '<', name + '\uf8ff').get();

      const matchingUsers = [];
      usersQuery.forEach((userDoc) => {
        matchingUsers.push(userDoc.data());
      });

      // Send the matching users as a response
      res.status(200).json({ members: matchingUsers });


    }
    else{
      const userDoc = await Users.doc(id).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const compId = userData.company;

        // Retrieve users with the same company ID as the user's associated company and whose name starts with the provided name
        const companyUsersQuery = await Users.where('company', '==', compId).where('name', '>=', name).where('name', '<', name + '\uf8ff').get();

        const matchingCompanyUsers = [];
        companyUsersQuery.forEach((userDoc) => {
          matchingCompanyUsers.push(userDoc.data());
        });

        // Send the matching company users as a response
        res.status(200).json({ members: matchingCompanyUsers });
      } else {
        // Handle the case where the user doesn't exist
        res.status(404).json({ error: 'User not found' });
      }
    }
  } catch (error) {
    // Handle any other errors that may occur
    console.error('Error searching for members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }}
};

export const allInfo = async (req, res) => {
  const { token } = req.body;
  const id = decodeTokenAndGetId(token);

  try {
    // First, search in the "Companies" collection
    const companyRef = Companies.doc(id);
    const companyDoc = await companyRef.get();

    if (companyDoc.exists) {
      // Found in "Companies" collection, respond with company info
      return res.status(200).json({ type: 'company', info: companyDoc.data() });
    }

    // If not found in "Companies" collection, search in the "Users" collection
    const userRef = Users.doc(id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Found in "Users" collection, respond with user info
      return res.status(200).json({ type: 'user', info: userDoc.data() });
    }

    // If not found in either collection, respond with a 404 Not Found
    res.status(404).json({ error: 'Resource not found' });
  } catch (error) {
    // Handle any potential errors, e.g., database connection issues
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
