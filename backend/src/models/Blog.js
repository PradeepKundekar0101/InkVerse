import mongoose from "mongoose"
const BlogSchema = mongoose.Schema({
   title:{
    type:String,
    min:5,
    max:100
   },
   content:{
    type:String,
    min:5,
    max:1200
   },
   image:{
    type:String
   },
   author:{
    type: String,
   },
   likes:{
      type:Number,
      default:0
   },
  tags:
    {
      type:[String],
      default:[]
    },
    category:{
      type:String,
     
    },
    views:{
      type:Number,
      default:0
    },
    comments:
      [{
        type: String
    }]
    
},{
    timestamps: true, 
  } )
export const Blog = mongoose.model("Blog",BlogSchema);