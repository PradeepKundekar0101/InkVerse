
import { useEffect } from "react"
// import { serverUrl } from "../conf/conf"
import {format} from 'timeago.js'
import {useNavigate} from 'react-router-dom'
type BlogCardProps = {
    title:string,
    image:string,
    likes:number,
    category:string,
    createdAt: Date,

    blogId:string
    views:number
}

const BlogCard:React.FC<BlogCardProps> = ({blogId,title,image,views,createdAt,category,likes}) => {

  const navigate = useNavigate();
  useEffect(() => {
   
  }, [])
  
  return (  
    <div className="flex shadow-md  flex-col space-y-3 items-start w-[58%] lg:w-[70%] h-80 rounded-lg  dark:shadow-sm dark:shadow-gray-600 bg-white mx-auto my-3    p-2 dark:bg-gray-800">
        <img src={image}  alt="Blog Image" className="h-32 w-full object-cover rounded-tl-lg rounded-tr-lg "  />
        <span className=" uppercase text-sm px-2 rounded-full shadow-md my-3 dark:text-white dark:shadow-sm dark:shadow-gray-600 "><small>{category}</small></span>

        {views===1 ? <span  className="dark:text-white"> <small> {views} view </small></span>:<span className="dark:text-white">
        <small> {views} views</small> <small>{likes} likes</small>  </span> }

        <h1 className="text-2xl font-semibold dark:text-white"> {title.length<20 ? title : title.slice(0,20)+"..." } </h1>
        <button
           className="text-slate-500 border-b-2 text-sm border-slate-500 dark:text-teal-50"
           onClick={()=>{navigate("/blog/"+blogId)}}
           >ReadMore</button>
        <small>
          <span className="dark:text-white">

        {format(createdAt)}
          </span>
        </small>
    </div>
  )
}

export default BlogCard