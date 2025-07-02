import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'

const authorize = async (req, res, next) => {
  try {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if(!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

    // Check if JWT_SECRET is defined
    if(!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if decoded token has userId
    if(!decoded.userId) {
      console.error('Token does not contain userId');
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    // If valid, it decodes the token and extracts the userId (which was set when the token was created).
    const user = await User.findById(decoded.userId);
    
    if(!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    // Provide more specific error messages based on the error type
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: error.message });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Token not active yet', error: error.message });
    }
    
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}

export default authorize;