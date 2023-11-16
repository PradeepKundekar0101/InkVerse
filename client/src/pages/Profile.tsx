import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks'

import { serverUrl } from '../conf/conf';
import { Params, useParams,useNavigate } from 'react-router-dom'
import axios from 'axios';

import {BsPencilFill, BsHeart} from 'react-icons/bs'
import BlogCard from '../components/BlogCard';
import { MdEmail } from 'react-icons/md';
import ProfileLoader from './Loaders/ProfileLoader';
type User = 
{
  user_name:string
  email:string
  profile_picture:string
  _id:string,
  bio:string
  blogs:string[]
}
type Blog = {
  title:string,
  image:string,
  likes:number,
  category:string,
  createdAt: Date,
  _id:string
  views:number
}
const Profile = () => {
    const {userId}  = useParams<Readonly<Params<string>>>();
    const [user,setUser] = useState<User|null>(null);
    const [blogs,setBlogs] = useState<Blog[]|null>(null);
    const [userFound,setUserFound] =  useState<boolean>(true);

    const loggedInUser = useAppSelector((state) => state.auth.user);
    const[ownAcc,setOwnAcc] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchUser = async() => {
      try {
        const url = serverUrl+"/api/user/id/"+userId
        const res = await axios.get(url);
        setUser(res.data.user)
       console.log(res.data)
      } catch (error){
          setUser({user_name:"",email:"",profile_picture:"",_id:"",blogs:[],bio:''});
          setUserFound(false);
      }
    }
    const handleEditClick = ()=>{
        navigate("/user/update/"+user?._id)
    }
    const fetchBlogs =async()=>{
      try {
        const url = serverUrl+"/api/blog/user/"+userId
        const res = await axios.get(url);
        // const {title,image,createdAt,views,_id} = res.data.data;
        setBlogs(res.data.data)
       console.log(res.data)
      } catch (error){
          setUser({user_name:"",email:"",profile_picture:"",_id:"",blogs:[],bio:''});
          setUserFound(false);
      }
    }
    useEffect(() => {
        fetchUser();
        fetchBlogs();
    }, [])
    useEffect(()=>{
      if( loggedInUser && user && loggedInUser?._id===user?._id) setOwnAcc(true);
      console.log(user?.profile_picture)
    },[user])
    
  return (
    <div>
    
        <ProfileLoader/>
        {!userFound && <h1>User not Found :| </h1>  }
        
        { user && <div className='flex flex-col items-center justify-center bg-slate-50 py-4 lg:mx-32'>
          <div className='w-full flex justify-between items-start px-4 '  >
         { user.profile_picture && <img src={String(user.profile_picture)}  alt="" className='rounded-md my-4 h-32 w-32 shadow-xl lg:h-48 lg:w-48 '/> }

          {ownAcc ? <button className='bg-black text-white py-1 px-4 flex items-center' onClick={handleEditClick}>Edit Profile&nbsp;<BsPencilFill/> </button> : <></>}
          </div>

          <div className='w-full px-4'>
          
          <h1 className='text-4xl my-1'>{user.user_name}</h1>
          <h4 className='text-sm flex items-cente my-1'>  {user.email}</h4>
          <p className='text-sm text-slate-600 text-left my-1'> <h1 className='text-lg text-black'>About</h1> {user.bio}</p>


          </div>
          
          </div> }


          <h1 className='text-2xl text-center p-2 py-5 font-medium'> {ownAcc?"Your Posts": user?.user_name+"'s Posts"}</h1>
          <div className='container mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

          {
            blogs && 
            blogs.map((e:Blog,i)=>(
              <BlogCard key={i} title={e.title} views={e.views} image={e.image} blogId={e._id} likes={0} category={e.category} createdAt={e.createdAt}  />
            ))
           
          }
          </div>
          </div>
    </div>
  )
}

export default Profile