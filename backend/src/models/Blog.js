import mongoose from "mongoose"
const BlogSchema = mongoose.Schema({
   title:{
    type:String,
    min:5,
    max:50
   },
   content:{
    type:String,
    min:5,
    max:255
   },
   image:{
    type:String
   },
   author:{
    type: String,
   },
   slug: {
    type: String,
    unique: true,
    required: true,
  },
  tags: [String]
},{
    timestamps: true, 
  } )
export const Blog = mongoose.model("Blog",BlogSchema);