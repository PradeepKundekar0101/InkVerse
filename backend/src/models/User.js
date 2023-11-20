import mongoose, { Mongoose } from "mongoose"
const UserSchema = mongoose.Schema({
    user_name:{
        type:String,
        min:3,
        max:30,
        require:true,
    },
    profile_picture:{
        default:"https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
        type:String
    },
    email:{ 
        type:String,
        require:true,
        unique: true,
    },
    password:{
        type:String
    },
    blogs:{
        type:Map,
        of:Boolean,
        default:{}
    },
    bio:{
        type:String,
        default:""
    },
    likes:{
        type: mongoose.Schema.Types.Map,
        of:Boolean,
        default:{}
    }
},{
    timeStamps:true
})
export const User = mongoose.model("User",UserSchema);