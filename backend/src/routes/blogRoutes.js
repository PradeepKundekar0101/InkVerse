import express from "express"
import {authenticateToken} from '../middleware/verifyToken.js'
import {addBlog, getAllBlogs, getBlogById, getTotalNoOfBlogs,likeBlog,dislikeBlog,viewBlog,getComments,postComment} from '../controllers/blogControllers.js'
const router = express.Router();

router.post("/post",authenticateToken,addBlog);
router.get("/all",getAllBlogs);
router.get("/totalDocs",getTotalNoOfBlogs);
router.get("/:blogId",getBlogById);

//Social Routes
router.put("/like/:blogId",authenticateToken,likeBlog);
router.put("/dislike/:blogId",authenticateToken,dislikeBlog);
router.get("/viewed/:blogId",viewBlog);

router.get("/comments/:blogId",getComments);
router.post("/comments/:blogId",authenticateToken,postComment);


export default router;
