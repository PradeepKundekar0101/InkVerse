import { Blog } from "../models/Blog.js";
import { Comment } from "../models/Comment.js";
import {User} from '../models/User.js'
export const addBlog =async (req,res)=>{
    const userId = req.user.userId;
    try {
        const blog = new Blog({...req.body,author:userId});
        const userFound = await User.findById(userId);
        if(!userFound) return res.status(404).json({data:"User not found"});
        const savedBlog = await blog.save();
         res.status(200).json({ data:savedBlog,message:"Saved!" })
    } catch (error) {
        res.status(500).json({ message:"Failed to Save" })
    }

}
export const getAllBlogs=async (req,res)=>{
        try {
            let queryObject ={};
            const {category,sort,page} = req.query;
            if(category)  queryObject.category  = {$regex:category,$options:"i"}
            const limit = 9;
            const skip = (page-1) * 10;
            
            let blogs = Blog.find(queryObject);
            let total = await  Blog.countDocuments(queryObject);
         
            if(sort)
            {
                if(sort==='a-z')
                    blogs.sort({"title":"asc"}).skip(skip).limit(limit);
                else if(sort=="z-a")
                   blogs.sort({"title":"desc"}).skip(skip).limit(limit);
                else if(sort=="views")
                    blogs.sort({"views":"desc"}).skip(skip).limit(limit);
                else if(sort==="likes")
                    blogs.find().sort({"likes":"desc"}).skip(skip).limit(limit);
                else if(sort==="new")
                    blogs.find().sort({"createdAt":"desc"}).skip(skip).limit(limit);
                else if(sort==="old")
                    blogs.sort({"createdAt":"asc"}).skip(skip).limit(limit);
            } 
            else{
                blogs.skip(skip).limit(limit);

            }
            const finalData = await blogs;
            res.status(200).json({data:finalData,totalDocs:total});
           
        } catch (error) {
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
export const getBlogById = async(req,res)=>{
    try {
        const blogId = req.params.blogId;
        const blog =  await Blog.findById(blogId)
        if(!blog) return res.status(404).json({data:"Blog Not Found"});
        res.status(200).json({data:blog});
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}

export const getBlogByUserId = async(req,res)=>{
    try {
        const pageNo = req.query.pageNo;
        const limit= 5;
        const skip = (pageNo-1) * 10;
        const userId = req.params.userId;
        const blogs =  await Blog.find({author:userId}).skip(skip).limit(limit);
        res.status(200).json({data:blogs});
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}


export const likeBlog = async( req,res)=>{
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).json({data:"Blog not Found"});
        blog.likes+=1;
        const updatedBlog = await blog.save();
        res.status(200).json({data:updatedBlog.likes})
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}
export const dislikeBlog = async( req,res)=>{
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).json({data:"Blog not Found"});
        blog.likes-=1;
        const updatedBlog = await blog.save();
        res.status(200).json({data:updatedBlog.likes})
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}

export const viewBlog = async( req,res)=>{
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).json({data:"Blog not Found"});
        
        if(!blog.views)
            blog.views=1;
        else 
            blog.views+=1;
        const updatedBlog = await blog.save();
       
        res.status(200).json({data:updatedBlog.views})
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}

export const getComments = async( req,res)=>{
    try {
        const blogId = req.params.blogId;
        const blog = await Blog.findById(blogId);
        if(!blog) return res.status(404).json({data:"Blog not Found"});
        const commentsIdList = blog.comments;
        let result = [];
        for(const commentId of commentsIdList)
        {
            const commentFound = await Comment.findById(commentId);
            let comment = {};
            comment.content = commentFound.content;
            const user = await User.findById(commentFound.author);
            comment.user_name = user.user_name;
            comment.userId = user._id;
            comment.profile_picture = user.profile_picture;
            result.push(comment);

        }
        res.status(200).json({data:result})
    
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}


export const postComment = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const blogId = req.params.blogId;
        const {content} = req.body;
        
        const userFound = await User.findById(userId);
        if(!userFound) return res.status(404).json({data:"User not found"});
        const newComment = new Comment({ author:userId,blogId,content })
        const saved = await newComment.save();

        const blog = await Blog.findById(blogId);
        if(!blog) res.status(404).json({data:"Blog not Found"});
        if(!blog.comments)
            blog.comments = []
        blog.comments.push(saved._id);
        
        await blog.save();
       
        res.status(200).json({data:saved});
       
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}

export const updateBlog = async(req,res)=>{
    try {
      const paramsBlogId = req.params.blogId;
      const tokenUserId = req.user.userId;
      const userFound = await User.findById(req.user.userId);
      if(!userFound) return res.status(404).json({data:"User not found"});
      const blog = await Blog.findById(paramsBlogId);
      if(!blog) res.status(404).json({data:"Blog not Found"});
      if(blog.author === tokenUserId)
      {
        const updatedBlog = await Blog.findByIdAndUpdate(paramsBlogId,req.body)
        res.status(200).json({ message:"User registered successfully",data:updatedBlog});
      }
      else{
        res.status(401).json({data:"Not Allowed"});
      }
     } catch (error) {
      
        res.status(500).json({data:"Error registering user "+error});
     }
  }
  
export const deleteBlog = async(req,res)=>{
    try {
      const paramsBlogId = req.params.blogId;
      const tokenUserId = req.user.userId;
      const blog = await Blog.findById(paramsBlogId);
      if(!blog) res.status(404).json({data:"Blog not Found"});
      if(blog.author === tokenUserId)
      {
        const blogFound = await Blog.findById(paramsBlogId);
        for(const commentId of blogFound.comments)
        {
            await Comment.findByIdAndDelete(commentId);
        }
        const deletedBlog = await Blog.findByIdAndDelete(paramsBlogId)
        res.status(200).json({ message:"Blog was deleted successfully",data:deletedBlog});
      }
      else{
        res.status(401).json({data:"Not Allowed"});
      }
     } catch (error) {
        res.status(500).json({data:"Error registering user "+error});
     }
  }
  

export const getMostLiked = async(req,res)=>{
    try {
      
        const mostLikedBlog = await Blog.findOne().sort('-likes').exec();
        if (!mostLikedBlog) {
          return res.status(404).json({ error: 'No blogs found' });
        }
        res.json({ mostLikedBlog });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

export const getTotalNoOfCategoryBlogs =async (req,res)=>{
    try {
        const totalCount =  await Blog.countDocuments({category:req.params.category});
        res.status(200).json({data:totalCount});
    } catch (error) {
        res.status(500).json({data:error.message});
    }
}
export const getSearchedBlogs = async (req, res) => {
    try {
        const search = req.params.search;
        const blogs = await Blog.find({
            $or: [
                { title: { $regex: search, $options: 'i' } }, // Search by title using case-insensitive regex
                { tags: { $in: [search] } },// Search by tags using $in operator
                { category : {$regex : search, $options:"i"} }
            ]
        });
        res.status(200).json({ data: blogs });
    } catch (error) {
        res.status(500).json({ data: error.message });
    }
};