import express from 'express'
const router = express.Router();
import { registerUser,loginUser,getUser,updateUser, getUserByName,checkLiked,likeBlog,dislikeBlog } from '../controllers/userControllers.js';
import {authenticateToken} from '../middleware/verifyToken.js'


router.post("/register",registerUser);
router.post("/signin",loginUser);
router.get("/id/:userId",getUser)
router.get("/name/:userName",getUserByName)

router.put("/:userId",authenticateToken,updateUser);

//Check of the user has liked a blog
router.get("/liked/:userId/:blogId",checkLiked);

//User likes a blog
router.post("/like/:userId/:blogId",likeBlog)
router.post("/dislike/:userId/:blogId",dislikeBlog)

export default router;