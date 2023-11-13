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
  const token = req.query.token;
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
export const deleteuser = async (req, res) => {
  const email = req.query.email;

  try {
    // Find and delete the user with the specified email from the Users collection
    const userSnapshot = await Users.where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user(s) found with the specified email from the Users collection
    const deletePromises = [];
    userSnapshot.forEach((userDoc) => {
      deletePromises.push(Users.doc(userDoc.id).delete());
    });

    await Promise.all(deletePromises);

    // Now, remove the user with the specified email from the user lists in the Companies collection
    const companiesSnapshot = await Companies.where('user', 'array-contains', email).get();

    const updatePromises = [];
    companiesSnapshot.forEach((companyDoc) => {
      const companyData = companyDoc.data();
      if (companyData.user && companyData.user.includes(email)) {
        // Remove the email from the user list
        companyData.user = companyData.user.filter((userEmail) => userEmail !== email);
        // Update the company document with the modified user list
        updatePromises.push(Companies.doc(companyDoc.id).update(companyData));
      }
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateMemberRole = async (req, res) => {
  const { email, token, role } = req.body.data;
  console.log(req.body.data)

  try {
    // Find the user by email
    const userQuery = await Users.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming there's only one user with this email, you can update the role
    const userDoc = userQuery.docs[0];
    const userRef = userDoc.ref;

    // Update the user's role
    await userRef.update({ role: role });

    return res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const RetrieveAllUsers = async (req, res) => {
  const { token } = req.query;
  const id = decodeTokenAndGetId(token);

  if (!id || !token) {
    res.status(404).send({ message: 'Token not provided' });
    return;
  }

  try {
    // Check if the ID exists in the Companies collection
    const companySnapshot = await Companies.doc(id).get();

    if (companySnapshot.exists) {
      // If found in Companies collection, search for users with the same company ID
      const usersSnapshot = await Users.where('company', '==', id).get();
      const users = usersSnapshot.docs.map(doc => doc.data());
      res.status(200).send({ users });
    } else {
      // If not found in Companies collection, search for the ID in Users collection
      const userSnapshot = await Users.doc(id).get();

      if (userSnapshot.exists) {
        // If found in Users collection, search for other users with the same company ID
        const user = userSnapshot.data();

        const usersWithSameCompanySnapshot = await Users.where('company', '==', user.company).get();
        const usersWithSameCompany = usersWithSameCompanySnapshot.docs.map(doc => doc.data());

        res.status(200).send({ user, usersWithSameCompany });
      } else {
        // If not found in Users collection as well, return an appropriate response
        res.status(404).send({ message: 'User not found' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};