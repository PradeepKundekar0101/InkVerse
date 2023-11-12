import mongoose from "mongoose"
const CommentSchema = mongoose.Schema({
    content:{
        type:String,
        min:5,
        max:50
    }, 
    author:String,
    blogId:String,
},
{
    timestamps: true, 
})

export const Comment = mongoose.model("Comment",CommentSchema);