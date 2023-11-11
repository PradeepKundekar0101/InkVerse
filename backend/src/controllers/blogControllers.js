import { Blog } from "../models/Blog.js";
export const addBlog =async (req,res)=>{
    const userId = req.user.userId;
    try {
        const blog = new Blog({...req.body,author:userId});
        console.log(blog)
        const savedBlog = await blog.save();
         res.status(200).json({ data:savedBlog,message:"Saved!" })
    } catch (error) {
        res.status(500).json({ message:"Failed to Save" })
    }

}
export const getAllBlogs=async (req,res)=>{
        try {
            const page = req.query.page;
            console.log(page)
            const limit = 10;
            const skip = (page-1) * 10;
            const blogs = await Blog.find().skip(skip).limit(limit);
            res.status(200).json({data:blogs});
        } catch (error) {
            console.log(error)
            res.status(500).json({data:error.message});
        }
}
export const getTotalNoOfBlogs = async (req,res)=>{
    try {
        const totalCount =  await Blog.countDocuments({});
        res.status(200).json({data:totalCount});
    } catch (error) {
        res.status(500).json({data:error.message});
    }
        
}