import jwt from 'jsonwebtoken';

// Secret key for signing the token
const secretKey = 'serivango312'; // Replace with your actual secret key

// Function to generate a token
export const generateToken = (userId) => {
  // Create a token with the user ID and a secret key
  const token = jwt.sign({ id: userId }, secretKey, {
    expiresIn: '1h', // You can adjust the token expiration time as needed
  });
  return token;
};
