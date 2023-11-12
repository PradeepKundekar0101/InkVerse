import { User } from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt  from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
export const registerUser = async (req,res)=>
{   
     try {
      let user;
      const {user_name,email,password} = req.body;
      const userFound = await User.findOne({email});
      if(userFound)
      {
         return res.status(409).json({ message:"Email already exists"});
      }
      if(password)
      {
         const hashPass = await bcrypt.hash(req.body.password,10);
          user = new User({user_name,email,password:hashPass});
      }
        else {
         user = new User(req.body)
        }
        await user.save();
        const token = jwt.sign({userId:user._id},JWT_SECRET);
        res.status(200).json({ message:"User registered successfully",token,user});
     } catch (error) {
      console.log(error.message)
        res.status(500).json({message:"Error registering user "+error});
     }
}
export const loginUser = async (req,res)=>{
   if (req.body.google){
       try{
         const email = req.body.email;
         const userFound = await User.findOne({email});
         if (!userFound) 
            return res.status(400).json({ message: "User does not exist" });
         const token = jwt.sign({userId:userFound._id},process.env.JWT_SECRET);
         res.status(200).json({ user:userFound,token,message:"Login Success" });
       } catch (error) {
         console.log(error.message)
         res.status(500).json({ message: error.message });
       }
     } 
     else{
       // normal-auth
       const {email, password} = req.body;
       if (email === "" || password === "") 
           return res.status(400).json({message: "Invalid field!"});
       try {
           const existingUser = await User.findOne({email})
           if (!existingUser) 
               return res.status(404).json({message: "User don't exist!"})
           const isPasswordOk = await bcrypt.compare(password, existingUser.password);
           if (!isPasswordOk) 
               return res.status(400).json({message: "Invalid credintials!"})
           const token = jwt.sign({userId: existingUser._id},process.env.JWT_SECRET);
           res.status(200).json({user:existingUser,token,message:"Login Successful"})
       } catch (err) {
           res.status(500).json({message: err.message})
       }
   }

}

export const getUser =async (req,res)=>{
  try {
    const userId=  req.params.userId;
    const user = await User.findById(userId).select(['-password'])
    if(user) return res.status(200).json({ user,message:"User Found" })
    res.status(200).json({ user,message:"User not found" })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message:error.message })
  }
}

export const updateUser = async(req,res)=>{
  try {
    const paramsUserId = req.params.userId;
    const tokenUserId = req.user.userId;
    if(paramsUserId === tokenUserId)
    {
      const updatedUser = await User.findByIdAndUpdate(paramsUserId,req.body)
      res.status(200).json({ message:"User registered successfully",user:updatedUser});
    }
    else{
    
      res.status(401).json({message:"Not Allowed"});
    }
   } catch (error) {
    
      res.status(500).json({message:"Error registering user "+error});
   }
}

export const getUserByName = async (req,res)=>{
  try {
    const userName = req.params.userName;
    // const userHeader
    const userFound = await User.findOne({user_name:userName});
    if(userFound)
      return res.status(200).json({message:"User name is already taken",success:false})
    return res.status(200).json({message:"No user name found",success:true})
    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}

export const checkLiked = async(req,res)=>{
  try {
    const userId = req.params.userId;
    const blogId = req.params.blogId;
    const user = await User.findById(userId);
    if(!user) res.status(404).json({data:"User not Found"});
    let liked =false;
    if(user.likes.has(blogId)) liked=true;
    res.status(200).json({data:liked});
    
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}
export const likeBlog = async (req,res)=>{
  try {
    const userId = req.params.userId;
    const blogId = req.params.blogId;
    const user = await User.findById(userId);
    if(!user) res.status(404).json({data:"User not Found"});
    user.likes.set(blogId,true);
    const updatedUser = await user.save()
    res.status(200).json({data:updatedUser});
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
  }
}
export const dislikeBlog =async(req,res)=>{
  try {
    const userId = req.params.userId;
    const blogId = req.params.blogId;
    const user = await User.findById(userId);
    if(!user) res.status(404).json({data:"User not Found"});
    user.likes.delete(blogId);
    const updatedUser = await user.save()
    res.status(200).json({data:updatedUser});
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
  }
}