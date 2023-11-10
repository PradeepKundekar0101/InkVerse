import mongoose from "mongoose"
const UserSchema = mongoose.Schema({
    user_name:{
        type:String,
        min:3,
        max:30,
        require:true,
    },
    profile_picture:{
        default:"https://shorturl.at/syBDS",
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
        type:[],
        default:[]
    },
    bio:{
        type:String,
        default:""
    }
},{
    timeStamps:true
})
export const User = mongoose.model("User",UserSchema);