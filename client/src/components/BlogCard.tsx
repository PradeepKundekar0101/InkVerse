
import { useState,useEffect } from "react"
import { serverUrl } from "../conf/conf"
import {format} from 'timeago.js'

type BlogCardProps = {
    title:string,
    content:string,
    image:string,
    likes:number,
    category:string,
    createdAt: Date,
    author:string
}

const BlogCard:React.FC<BlogCardProps> = ({title,content,image,author,likes,createdAt,category}) => {
  
  useEffect(() => {
   
  }, [])
  
  return (
    <div className="flex flex-col space-y-3 items-start w-[58%] lg:w-[70%] rounded-lg  bg-white mx-auto my-3   p-2">
        <img src={image}  alt="Blog Image" className="h-32 w-full object-cover rounded-tl-lg rounded-tr-lg "  />
  
        <span className=" uppercase text-sm px-2 rounded-full shadow-md my-3 "><small>{category}</small></span>
        <h1 className="text-2xl font-semibold">{title}</h1>
       
        <button className="text-slate-500 border-b-2 text-sm border-slate-500">ReadMore</button>
        <small>

        {format(createdAt)}
        </small>
    
    </div>
  )
}

export default BlogCard