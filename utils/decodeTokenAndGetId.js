import jwt from 'jsonwebtoken';

// Secret key for verifying the token
const secretKey = 'serivango312'; 

// Function to decode a token and get the user ID
export const decodeTokenAndGetId = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id; // Assuming 'id' is the key in the token's payload

    return userId;
  } catch (error) {
    // Handle token verification errors, such as expired or invalid tokens
    console.error('Error decoding token:', error);
    return null; // Return null or another appropriate value in case of an error
  }
};



// Function to decode a token and retrieve the email
export const getEmailFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.email;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

