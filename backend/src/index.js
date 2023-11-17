import express from "express"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import userRoute from './routes/userRoutes.js'
import blogRoute from './routes/blogRoutes.js'
import cors from 'cors'

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000
const MONGOURL = process.env.MONGOURL
const connect = async()=>{
    try {
        await mongoose.connect(MONGOURL)
        console.log("Connected to DB");
    } catch (error) {
        console.log(error.message);
    }
}
app.use("/api/user/",userRoute);
app.use("/api/blog/",blogRoute);
connect();
app.listen(PORT,()=>{
    console.log("Server Running at PORT : "+PORT);
})