import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']; 
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
