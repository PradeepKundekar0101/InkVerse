import {useState,useEffect, FormEvent} from 'react'
import axios from 'axios';
import { Link, useParams,useNavigate} from 'react-router-dom'
import { serverUrl } from '../conf/conf';
import {format} from 'timeago.js'
import { useAppSelector } from '../app/hooks';

import SingleBlogLoader from './Loaders/SingleBlogLoader';

//Importing icons
import {FcLike} from 'react-icons/fc'
import {AiOutlineHeart} from 'react-icons/ai'

import DotMenu from '../components/DotMenu';

import {  BiLeftArrowAlt } from 'react-icons/bi';
import toast, { Toaster } from 'react-hot-toast';

// import {FaShare} from 'react-icons/fa'
const SingleBlog = () =>
{
    const navigate = useNavigate();
    const logginedUser = useAppSelector((state)=>{return state.auth.user});
    const token = useAppSelector((state)=>{return state.auth.token});
    type Blog = {
        title:string
        content:string
        image:string
        likes:number
        author:string
        createdAt:Date
        category:string
        views:number
    }
    type Comment = {
        content:string
        user_name:string
        profile_picture:string
        userId:string
        createdAt:Date
    }

    const {blogId} = useParams<string>();

    // const [loading,setLoading] = useState<boolean>(true);
    const [postingComment,setPostingComment] = useState<boolean>(false);
    const [user_name,setUserName] = useState<string>();
    const [profile_picture,setProfilePicture] = useState<string>();
    const [liked,setLiked] = useState<boolean>();

    const [blog,setBlog] = useState<Blog | null>(null);

    const [comment,setComment] = useState<string>("");
    const [showModal,setShowModal] = useState<boolean>(false);
    const [comments,setComments] = useState<Comment[]>([]);

    const fetchBlog = async()=>{
        try {
            const url = `${serverUrl}/api/blog/${blogId}`
            const res = await axios.get(url);
            setBlog(res.data.data);
        } catch (error:any) {
            if(error.response.status === 404)
                    navigate("/notfound");
            
            
        }
    }
    const fetchUser = async()=>{
        if(!blog)return;
        try {   
            const url = `${serverUrl}/api/user/id/${blog.author}`
            const res = await axios.get(url);
            setUserName(res.data.user.user_name);
            setProfilePicture(res.data.user.profile_picture);
        } catch (error:any) {
            alert(error.response.data.data)
        }
    }
    const checkLiked = async ()=>{
        if(!logginedUser) return;
        try {
            const url = `${serverUrl}/api/user/liked/${logginedUser._id}/${blogId}`
            const res = await axios.get(url);
            setLiked(res.data.data);
        } catch (error) {
            console.error(error)
        }
    }
    const incViewOfCurrentBlog = async()=>{
        if(!blog) return;
        try {
            const url = `${serverUrl}/api/blog/viewed/${blogId}`
            await axios.get(url);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchBlog();
        checkLiked();
        incViewOfCurrentBlog()
        getComments();
    }, [])
    useEffect(()=>{
        fetchUser();
    },[blog]);

    const likeBlog = async()=>{
        try {
            setLiked(true);
            const blogUrl = `${serverUrl}/api/blog/like/${blogId}` 
            const headers={"Authorization":token,"Content-Type":"application/json"}
            const incCnt = await axios.put(blogUrl,{},{headers});
            setBlog((prevBlog:any) => {
                return { ...prevBlog, likes: incCnt.data.data };
              });
            const userUrl = `${serverUrl}/api/user/like/${logginedUser?._id}/${blogId}`
            await axios.post(userUrl,{},{headers});
        } catch (error:any) {
            console.log(error.message)
        }   
    }
    const dislikeBlog = async()=>{
        try {
            setLiked(false);
            //DECREASE the likes count of the blog 
            const blogUrl = `${serverUrl}/api/blog/dislike/${blogId}` 
            const headers={"Authorization":token,"Content-Type":"application/json"}
            const decCnt = await axios.put(blogUrl,{},{headers});

            setBlog((prevBlog:any) => {
                return { ...prevBlog, likes: decCnt.data.data };
              });

            //Remove the BlogId from loggined User's Like list
            const userUrl = `${serverUrl}/api/user/dislike/${logginedUser?._id}/${blogId}`
            await axios.post(userUrl,{},{headers});
        } catch (error:any) {
            console.log(error.message)
        }   
    }

    const addComment = async(e:FormEvent<HTMLFormElement>)=>{
        try {
            setPostingComment(true);
            e.preventDefault();
            const cmt = comment;
            setComment("");
            const url = `${serverUrl}/api/blog/comments/${blogId}` 
            const headers={"Authorization":token,"Content-Type":"application/json"}
            await axios.post(url,{content:cmt},{headers})
            getComments();
            setPostingComment(false);
        } catch (error:any) {
            setPostingComment(false);
            toast.error(error.response.data);
        }
    }
    const getComments = async ()=>{
        try {
            
            const url = `${serverUrl}/api/blog/comments/${blogId}` 
            const response = await axios.get(url)
            if(response.status===200)
            {
                setComments(response.data.data.reverse());
            }
        } catch (error:any) {
            console.log(error.response.data);
        }
    }
    const deleteBlog = async()=>{
        setShowModal(false);
        try {
           
            const url = `${serverUrl}/api/blog/${blogId}` 
            const headers={"Authorization":token,"Content-Type":"application/json"}
            const response = await axios.delete(url,{headers})
            if(response.status===200)
            {
                toast.success("Deleted");
            }
            
        } catch (error:any) {
            toast.error(error.response.data);
        }
    }
    //Load the Comments 
    // useEffect(() => {
     
    // }, [showModal])
    
  return (
    <div className='dark:bg-gray-950'>
      <Toaster/>
       {showModal && (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
      <div className="modal flex flex-col items-center justify-center rounded-xl h-[200px] w-72 bg-slate-100 dark:bg-slate-700 dark:text-white shadow-xl z-10">
        <h1 className="text-2xl mb-4 text-center">Are you sure you want to delete this?</h1>
        <div className="flex space-x-2">
          <button  className="px-3 py-1 bg-red-600 text-white rounded-md" onClick={deleteBlog}>
            Yes
          </button>
          <button className="px-3 py-1 bg-slate-600 text-white rounded-md" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
        {
            blog?
            <div className='mx-4 flex flex-col space-y-3 lg:mx-52 lg:py-10 dark:bg-gray-950 dark:text-white'>
            <button
                onClick={()=>{navigate("/blog/explore")}} 
                className='border-slate-500 border-b-3 flex my-5 items-center underline'> 
                <BiLeftArrowAlt size={22}/>Back
            </button>
            
            <div className='flex justify-between '>
                <div className='left'>
                    <small>
                        <span 
                            className='shadow-md p-1 rounded-full font-semibold dark:bg-slate-700'
                            >
                            {blog?.category.toUpperCase()}
                        </span>
                    </small>
                    {blog && <small className='mx-2 lg:text-md '>{format(blog.createdAt)}</small>}
                </div>
                {
                    <DotMenu ownBlog={logginedUser?._id === blog?.author } setShowModal ={setShowModal} blogId = {String(blogId)}/>
                }
            </div>
            <h1 className='text-4xl font-bold lg:text-5xl'>{blog?.title}</h1>
            <Link to={`/user/${blog?.author}`} > 
                <div className='container flex items-center space-x-1'> 
                    <div className="left">
                        { profile_picture && <img src={profile_picture} className='h-10 w-10 object-cover rounded-full' alt="profile" />}
                    </div>
                    <div className="right">
                        <span className="font-semibold">{user_name}</span>
                    </div>
                </div>
            </Link>
    
            <div className='bg-slate-100'>
    
            <img src={blog?.image} className='rounded-lg h-52 w-full object-contain lg:h-72' alt="Blog Image" />
            </div>
            <small> <span className='flex items-center text-slate-800 font-semibold lg:text-lg dark:text-blue-100'>{blog?.views} Views </span> </small>
            <div className="buttons flex space-x-2 items-center"> 
                { 
                    !liked?  
                    <button className='flex items-center'
                        onClick={likeBlog}> 
                        <AiOutlineHeart size={20}/>&nbsp;{blog?.likes}&nbsp;Likes  
                    </button> 
                    :
                    <button onClick={dislikeBlog} className='flex items-center' >
                        <FcLike  size={20}/>&nbsp;{blog?.likes}&nbsp;Likes
                    </button> 
                }    

            </div>
            <div className='w-full '>
                <p className='text-sm  lg:text-lg text-ellipsis overflow-hidden ... whitespace-pre-line '>{blog?.content}</p>
            </div>
    
            <h1 className='text-2xl font-bold text-blue-950 dark:text-blue-300'>Comments ({comments.length})</h1>
            <div className="addComment">
                    <form onSubmit={addComment}>
                        <textarea
                            className='border dark:bg-slate-800 dark:border-slate-500 border-slate-300 bg-slate-100 rounded-md h-32 p-2 focus:outline-none w-full'
                            value={comment} 
                            cols={40} rows={10}
                            onChange={(e)=>{setComment(e.target.value)}} 
                            placeholder='Type your comment' />
                        <button disabled={postingComment} type='submit' className='py-1 px-4 bg-blue-700 my-3  text-white font-normal rounded-sm' >
                            { postingComment? <h1 className='flex items-center'>  <img className=' w-4  h-4 mr-1' src='https://i.gifer.com/ZKZg.gif'/>Posting...</h1> : "Post Comment"}
                        </button>
                    </form>
                </div>
    
                <div className="displayComments w-full mx-1 ">
                    {
                        comments.length===0? <h1 className="font-semibold">No Comments Yet</h1> :<></>
                    }
                    {comments?.map((e,i)=>(
                       <div key={i} className="text-black p-4 flex dark:text-white max-w-lg ">
                         <img className="rounded-full h-8 w-8 mr-2 mt-1 " src={e.profile_picture}/>
                         <div className='min-h-[fit-content] '>
                           <div className="bg-gray-100 rounded-lg max-w-lg px-4 pt-2 pb-2.5 dark:bg-slate-800">
                            <Link to={`/user/${e.userId}`}>
                             <div className="font-semibold text-sm leading-relaxed">@{e.user_name}</div>
                            </Link>
                             <p className='text-sm lg:text-md whitespace-pre-line overflow-scroll'>{e?.content}</p>
                           </div>
                           <div className="text-sm ml-4 mt-0.5 text-gray-500"> {format(e.createdAt)} </div>
                         </div>
                       
                       </div>
                    ))}
                </div>
        </div>:<SingleBlogLoader/>
        }
    </div>
  )
}

export default SingleBlog