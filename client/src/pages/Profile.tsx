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
  blogs:string[],
  bio:string
}
// type Blog = {
//   title:string,
//   content:string,
//   image:string,
//   likes:number,
//   createdAt: string,
// }
const Profile = () => {
    const {userId}  = useParams<Readonly<Params<string>>>();
    const [user,setUser] = useState<User|null>(null);
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
    useEffect(() => {
        fetchUser();

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
          <h1>Your Posts</h1>
          {user?.blogs?.map((e:any,i:number)=>{ return (
            <BlogCard key={i} title={e.title} image={e.image} content={e.content} createdAt={e.createdAt} likes={e.likes} />
          )})}
    </div>
  )
}

export default Profile