import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks'

import { serverUrl } from '../conf/conf';
import { Params, useParams,useNavigate } from 'react-router-dom'
import axios from 'axios';

import {BsPencilFill} from 'react-icons/bs'
import BlogCard from '../components/BlogCard';


import ProfileLoader from './Loaders/ProfileLoader';
import toast from 'react-hot-toast';
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
    const [blogs,setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loggedInUser = useAppSelector((state) => state.auth.user);
    const[ownAcc,setOwnAcc] = useState<boolean>(false);

    const navigate = useNavigate();

    const [pageNo,setPageNo] = useState<number>(1);

    const fetchUser = async() => {
      try {
        const url = serverUrl+"/api/user/id/"+userId
        const res = await axios.get(url);
        setUser(res.data.user)
      } catch (error:any){
          setUser({user_name:"",email:"",profile_picture:"",_id:"",blogs:[],bio:''});
          toast.error(error.response.data);
      }
    }
    const handleEditClick = ()=>{
        navigate("/user/update/"+user?._id)
    }
    const fetchBlogs =async()=>{
      try {
        const url = serverUrl+"/api/blog/user/"+userId+"?pageNo="+pageNo;
        const res = await axios.get(url);
        const newBlogs = res.data.data;
        setBlogs(prevBlogs => [...prevBlogs, ...newBlogs]);
        setPageNo(prevPage => prevPage + 1);
        setHasMore(newBlogs.length > 0);
      } catch (error)
      {
        
      }
      finally{
        setLoading(false);
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
    <div className='dark:bg-gray-950 dark:text-white  py-4'>
        {
            !user ? <ProfileLoader/>:
                user.email===""?
                <div className='h-screen flex items-center justify-center dark:bg-gray-950'> <h1 className='text-5xl dark:text-white'>User Not Found</h1> </div>  
                :
                <>
                <div className='flex flex-col items-center justify-center bg-slate-50 py-4 lg:mx-32 mx-3 dark:bg-slate-800 rounded-md'>
                <div className='w-full flex justify-between items-start px-4 '>
                { user.profile_picture && <img src={String(user.profile_picture)} alt="Profile" className='rounded-md my-4 h-32 w-32 shadow-2xl lg:h-48 lg:w-48 '/> }

                {ownAcc ? 
                <button className='bg-black text-white py-1 px-4 flex items-center dark:bg-white dark:text-black rounded-md' onClick={handleEditClick}>
                  Edit Profile&nbsp;<BsPencilFill/>
                </button> : <></>}
                </div>

                <div className='w-full px-4'>                
                <h1 className='text-4xl my-1'>{user.user_name}</h1>
                <h4 className='text-sm flex items-cente my-1'>  {user.email}</h4>
                <p className='text-sm text-slate-600 text-left my-1 dark:text-blue-300'> <h1 className='text-lg text-black dark:text-white'>About</h1> {user.bio}</p>

                </div>
                </div>

                {
                   blogs ? blogs.length===0 ? 
                   <div className="h-48 flex items-center w-full flex-col justify-center"> 
                      <h1 className='text-2xl lg:text-3xl my-3'>No Blogs Posted</h1> 
                     {  ownAcc?  <button onClick={()=>{navigate("/blog/addBlog")}} className='py-2 px-6 bg-slate-800 text-white rounded-sm'>Post a Blog</button> : <></>}
                    </div>
                    :
                    <>
                     <h1 className='text-2xl text-center p-2 py-5 font-medium'> {ownAcc?"Your Posts": user?.user_name+"'s Posts"}</h1>
                <div className='container mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                  blogs && 
                  blogs.map((e:Blog,i)=>(
                    <BlogCard key={i} title={e.title} views={e.views} image={e.image} blogId={e._id} likes={0} category={e.category} createdAt={e.createdAt}  />
                  ))
                
                }
                {loading && <p>Loading...</p>}
                </div>
                </div>
                   
                    </> :<></>
                } 
               
                </>

        }
                  
       


        
    </div>
  )
}

export default Profile