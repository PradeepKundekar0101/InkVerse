import express from 'express'
const router = express.Router();
import { registerUser,loginUser,getUser,updateUser } from '../controllers/userControllers.js';

router.post("/register",registerUser);
router.post("/signin",loginUser);
router.get("/:userId",getUser)
router.put("/:userId",updateUser);
export default router;