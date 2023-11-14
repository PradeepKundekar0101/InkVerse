import {useState,useEffect} from 'react'
import { serverUrl } from '../conf/conf';
import axios from 'axios';

import {GrFormPrevious,GrFormNext} from 'react-icons/gr';
import BlogCard from '../components/BlogCard';

const AllBlogs = () => {
    type Blog = {
        title:string
        content:string
        image:string
        likes:number
        author:string
        createdAt:Date
        category:string
        _id:string
        views:number
    }
    const [pageNo,setPageNo]= useState<number>(1);
    const [totalPages,setTotalPages]= useState<number>(0);
    const [blogs,setBlogs] = useState<Blog[]>([]);
    const fetchBlogs =async ()=>{
        try {
            const url = `${serverUrl}/api/blog/all?page=${pageNo}`
            console.log(url)
            const response = await axios.get(url);
            setBlogs(response.data.data);
        } catch (error) {
            console.log(error)
        }
        
    }
    const fetchTotalPages =async ()=>{
        try {
            const url = `${serverUrl}/api/blog/totalDocs`
            console.log(url)
            const response = await axios.get(url);
            setTotalPages(Math.ceil(response.data.data/10));
        } catch (error:any) {
            alert(error)
        }
    }
    useEffect(() => {
        fetchTotalPages();
        fetchBlogs();
    }, [pageNo])
    
  return (
    <div className='bg-slate-100'>
        <h1 className='text-3xl text-center font-medium py-4'>All Blogs</h1>
        <div className='container mx-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                
        {blogs.length >0  && blogs.map((blog,ind)=>(
                <BlogCard views={blog.views} blogId={blog._id} key={ind} category={blog.category} title={blog.title}  image={blog.image} likes={blog.likes} createdAt={blog.createdAt} />
            ))}
            </div>
        </div>
        <div className='pagination-btns flex justify-center items-center w-full mx-auto  '>
            <button className='bg-slate-200 rounded-full p-2'><GrFormPrevious/></button>
            {Array.from({length:totalPages}).map((_,i)=>(
                <button
                    key={i}
                    onClick={()=>{setPageNo(i+1)}} 
                    style={pageNo===i+1?{borderBottom:"2px solid #000"}:{}}
                    className='mx-3 w-3'>
                {i+1}
                </button>))}
        <button className='bg-slate-200 rounded-full p-2'><GrFormNext/></button>
        </div>
    </div>
  )
}

export default AllBlogs