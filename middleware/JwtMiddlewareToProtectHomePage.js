import jwt from 'jsonwebtoken'

// Generate token expiration time
const maxAge = 300

// Middleware to verify token
export const requireAuth = (req, res, next) => {
  const token = req.body.token;
  console.log("goot",token)
  if (!token) {
    console.log("token", token)
    return res.json({ message: 'No token provided' });
  }
  
  jwt.verify(token, 'serivango312', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.userId = decodedToken.id;
    next();
  });
}


// Middleware to verify token
export const requireAuth1 = (req, res, next) => {
  const token = req.body.otpverifyToken;
  console.log("goot",token)
  if (!token) {
    console.log("token", token)
    return res.json({ message: 'No token provided' });
  }
  
  jwt.verify(token, 'serivangoOtpVerification', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.userId = decodedToken.id;
    next();
  });
}


