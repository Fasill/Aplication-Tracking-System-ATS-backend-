import jwt from 'jsonwebtoken';

const secretKey = 'serivango312'; 


export const verifyTokenMiddlewareForClient = (req, res, next) => {
    var { token } = req.query;
    if (token === ''||token === undefined){
      var {token} = req.body  
    }

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
  