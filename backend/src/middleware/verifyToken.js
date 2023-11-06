import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const authenticateToken = async (req,res)=>{
    const token  =req.header('Authorization');
    if(!token) return res.status(401).json({data:"Not allowed"});

    jwt.verify(token,JWT_SECRET,(err,user)=>{
        if (err) return res.status(403).json({ data: 'Forbidden' });
        req.user = user;
        next()
    })
}