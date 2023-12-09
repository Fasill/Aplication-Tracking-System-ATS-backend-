import jwt from 'jsonwebtoken';

const secretKey = 'serivango312'; 


export const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      req.email = decoded.email; 
      next();
    });
  };
  