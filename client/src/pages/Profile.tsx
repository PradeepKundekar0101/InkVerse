import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks'

import { serverUrl } from '../conf/conf';
import { Params, useParams,useNavigate } from 'react-router-dom'
import axios from 'axios';

import {BsPencilFill, BsHeart} from 'react-icons/bs'
import BlogCard from '../components/BlogCard';
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
        {!userFound && <h1>User not Found :| </h1>  }
        { !user  && <h1>Loading....</h1> }
        { user && <div className='flex items-center justify-center bg-slate-100 py-4'>
          <div className='w-[40%]'>
         { user.profile_picture && <img src={String(user.profile_picture)}  alt="" className='rounded-full h-32 w-32'/> }
          </div>
          <div className='w-[60%]'>

          <h1 className='text-2xl'>{user.user_name}</h1>
          <h4 className='text-sm'> {user.email}</h4>
          <p>{user.bio}</p>
          {ownAcc ? <div className='flex space-x-2'><button className='btn-primary1' onClick={handleEditClick}>Edit &nbsp;<BsPencilFill/> </button> <button className='btn-primary1'>View Fav &nbsp; <BsHeart/> </button> </div>: <></>}


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