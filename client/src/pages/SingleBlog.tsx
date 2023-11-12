import {useState,useEffect, FormEvent} from 'react'
import axios from 'axios';
import { Link, useParams,useNavigate} from 'react-router-dom'
import { serverUrl } from '../conf/conf';
import {format} from 'timeago.js'
import { useAppSelector } from '../app/hooks';

//Importing icons
import {GrLinkPrevious} from 'react-icons/gr'
import {FcLike} from 'react-icons/fc'
import {AiOutlineHeart} from 'react-icons/ai'
import {BiSolidCommentDetail} from 'react-icons/bi'
import CommentBox from '../components/CommentBox';

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
    const [loading,setLoading] = useState<boolean>(true);
    const [user_name,setUserName] = useState<string>();
    const [profile_picture,setProfilePicture] = useState<string>();
    const [liked,setLiked] = useState<boolean>();

    const [blog,setBlog] = useState<Blog>();

    const [comment,setComment] = useState<string>("");
    const [showModal,setShowModal] = useState<boolean>(false);
    const [comments,setComments] = useState<Comment[]>();

    const fetchBlog = async()=>{
        try {
            setLoading(true);
            const url = `${serverUrl}/api/blog/${blogId}`
            const res = await axios.get(url);
            setBlog(res.data.data);
            setLoading(false)
        } catch (error:any) {
            alert(error.response.data.data)
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
        try {
            const url = `${serverUrl}/api/blog/viewed/${blogId}`
            await axios.get(url);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getComments();
        checkLiked();
        fetchBlog();
        incViewOfCurrentBlog()
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
            e.preventDefault();
            const url = `${serverUrl}/api/blog/comments/${blogId}` 
            const headers={"Authorization":token,"Content-Type":"application/json"}
            const response = await axios.post(url,{content:comment},{headers})
            if(response.status===200)
            {
                alert("added");
                console.log(response.data)
            }
        } catch (error:any) {
            console.log(error.response.data);
        }
    }
    const getComments = async ()=>{
        try {

            const url = `${serverUrl}/api/blog/comments/${blogId}` 
            const response = await axios.get(url)
            if(response.status===200)
            {
                setComments(response.data.data);
            }
        } catch (error:any) {
            console.log(error.response.data);
        }
    }
    //Load the Comments 
    // useEffect(() => {
     
    // }, [showModal])
    
  return (
    <div className='mx-4 flex flex-col space-y-3' >

       
        <button onClick={()=>{navigate("/blog/explore")}} className='border-slate-500 border-b-3 flex items-center' > <GrLinkPrevious/> back</button>
        <div>
            <small> <span className='shadow-md rounded-full font-semibold'>{blog?.category.toUpperCase()}</span></small>
            {blog && <small className='mx-2'>{format(blog.createdAt)}</small>}
        </div>
        <h1 className='text-4xl font-bold'>{blog?.title}</h1>
        <Link to={`/user/${blog?.author}`} > 
            <div className='container flex items-center space-x-1'> 
                <div className="left">
                    { profile_picture &&   <img src={profile_picture} className='h-10 w-10 object-cover rounded-full ' alt="profile" />}
                </div>
                <div className="right">
                    <small className="font-semibold">{user_name}</small>
                </div>
            </div>
        </Link>

        <div className='bg-slate-100'>

        <img src={blog?.image} className='rounded-lg h-52 w-full object-contain' alt="Blog Image" />
        </div>
        <small> <span className='flex items-center text-slate-800 font-semibold'>{blog?.views} Views </span> </small>
        <div className="buttons flex space-x-2 items-center"> 
            { 
                !liked?  
                <button className='flex items-center'
                    onClick={likeBlog}> 
                    <AiOutlineHeart size={20}/>&nbsp;{blog?.likes} Likes  
                </button> 
                :
                <button onClick={dislikeBlog} className='flex items-center' >
                    <FcLike  size={20}/>&nbsp;{blog?.likes}Likes
                </button> 
            }    
            <button className='flex'>
                <BiSolidCommentDetail fill="" size={20}/> &nbsp; {blog?.likes} Comments </button>

        </div>
        <div className='w-full '>
            <p className='text-sm  lg:text-md whitespace-pre-line overflow-scroll'>{blog?.content}</p>
        </div>

        <h1 className='text-2xl font-bold text-blue-950'>Comments</h1>
        <div className="addComment">
                <form onSubmit={addComment}>
                    <textarea 
                    
                        className='border border-slate-300 bg-slate-100 rounded-md h-32 p-2 focus:outline-none w-full'
                        value={comment} 
                        cols={40} rows={10}
                        onChange={(e)=>{setComment(e.target.value)}} 
                        placeholder='Type your comment' />
                    <button type='submit' className='py-1 px-4 bg-blue-700 text-white font-normal rounded-sm' >
                        Post Comment
                    </button>
                </form>
            </div>

            <div className="displayComments w-full mx-1 ">
                {comments?.map((e,i)=>(
                   <div className="text-black p-4 flex max-w-lg">
                     <img className="rounded-full h-8 w-8 mr-2 mt-1 " src={e.profile_picture}/>
                     <div className='min-h-[fit-content]'>
                       <div className="bg-gray-100 rounded-lg max-w-lg px-4 pt-2 pb-2.5">
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
    </div>
  )
}

export default SingleBlog