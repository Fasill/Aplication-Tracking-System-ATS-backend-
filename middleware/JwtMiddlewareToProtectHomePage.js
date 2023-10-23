// Import the 'jsonwebtoken' module
import jwt from 'jsonwebtoken';

// Set the token expiration time
const maxAge = 300;

// Middleware to verify tokens

// Middleware to verify the first type of token
export const requireAuth = (req, res, next) => {
  // Get the token from the request body
  const token = req.body.token;
  console.log("Token:", token); // Debugging: Log the token
  if (!token) {
    return res.json({ message: 'No token provided' });
  }

  // Verify the token with a secret key ('serivango312')
  jwt.verify(token, 'serivango312', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the user ID from the decoded token to the request object
    req.userId = decodedToken.id;
    next();
  });
};

// Middleware to verify the second type of token
export const requireAuth1 = (req, res, next) => {
  // Get the token from the request body
  const token = req.body.otpverifyToken;
  console.log("Token:", token); // Debugging: Log the token
  if (!token) {
    return res.json({ message: 'No token provided' });
  }

  // Verify the token with a different secret key ('serivangoOtpVerification')
  jwt.verify(token, 'serivangoOtpVerification', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the user ID from the decoded token to the request object
    req.userId = decodedToken.id;
    next();
  });
};

// Middleware to verify email login tokens
export const emaillogintokenverification = async (req, res, next) => {
  // Get the token from the query parameters
  const token = req.query.token;
  console.log("Token:", token); // Debugging: Log the token
  if (!token) {
    return res.json({ message: 'No token provided' });
  }

  // Verify the token with a secret key ('serivango312')
  jwt.verify(token, 'serivango312', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach the user ID from the decoded token to the request object
    req.userId = decodedToken.id;
    next();
  });
};
