import express from "express"
import {authenticateToken} from '../middleware/verifyToken.js'
import {addBlog, getAllBlogs, getTotalNoOfBlogs} from '../controllers/blogControllers.js'
const router = express.Router();

router.post("/post",authenticateToken,addBlog);
router.get("/all",getAllBlogs);
router.get("/totalDocs",getTotalNoOfBlogs);



export default router;
