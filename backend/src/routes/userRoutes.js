import express from 'express'
const router = express.Router();
import { registerUser,loginUser,getUser,updateUser, getUserByName } from '../controllers/userControllers.js';
import {authenticateToken} from '../middleware/verifyToken.js'

router.post("/register",registerUser);
router.post("/signin",loginUser);
router.get("/id/:userId",getUser)
router.get("/name/:userName",getUserByName)
router.put("/:userId",authenticateToken,updateUser);
export default router;