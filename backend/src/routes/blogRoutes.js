import express from "express"
import {authenticateToken} from '../middleware/verifyToken.js'
import {addBlog, getAllBlogs, getBlogById, getTotalNoOfBlogs,likeBlog,dislikeBlog,viewBlog,getComments,postComment,updateBlog,deleteBlog,getBlogByUserId,getMostLiked} from '../controllers/blogControllers.js'
const router = express.Router();

router.post("/post",authenticateToken,addBlog); //Add Blog
router.get("/all",getAllBlogs);   //Get all Blogs
router.get("/totalDocs",getTotalNoOfBlogs); //Get Total Count
router.get("/:blogId",getBlogById); //Get Blog By Id
router.get("/user/:userId",getBlogByUserId); //Get Blog By UserId
router.get("/get/mostLiked",getMostLiked); //GET most liked blog
router.put("/update/:blogId",authenticateToken,updateBlog) //Update
router.delete("/:blogId",authenticateToken,deleteBlog) //Update

//Social Routes
router.put("/like/:blogId",authenticateToken,likeBlog);
router.put("/dislike/:blogId",authenticateToken,dislikeBlog);
router.get("/viewed/:blogId",viewBlog);

router.get("/comments/:blogId",getComments);
router.post("/comments/:blogId",authenticateToken,postComment);


export default router;
