import {useState,useEffect} from 'react'
import { serverUrl } from '../conf/conf';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import AllBlogLoader from './Loaders/AllBlogLoader';
import SearchBlogForm from '../components/SearchBlogForm';
import Pagination from '../components/Pagination';
import SortByBtn from '../components/SortByBtn';
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
    const [totalPages,setTotalPages] = useState<number>(0);
    const [blogs,setBlogs] = useState<Blog[]|null>(null);
    const fetchBlogs =async ()=>{
        try {
            const url = `${serverUrl}/api/blog/all?page=${pageNo}`
            const response = await axios.get(url);
            setBlogs(response.data.data);
            setTotalPages(Math.ceil(response.data.totalDocs/10))
        } catch (error) {
            console.log(error)
        }
    }
    
    const sortBlog = async (parameter:string)=>{
            try {
                setBlogs(null);
                const url = `${serverUrl}/api/blog/all?sort=${parameter}&page=${pageNo}`
                const response = await axios.get(url);
                setBlogs(response.data.data);
            } catch (error) {
                
            }
    }
    useEffect(() => {
        setBlogs(null);
        fetchBlogs();
    }, [pageNo])
    
  return (
    <div className='bg-slate-100 dark:bg-gray-950 dark:text-white'>
        <h1 className='text-3xl text-center font-medium py-4 dark:text-white lg:text-5xl lg:py-10'>All Blogs</h1>
            <SearchBlogForm/>
            <SortByBtn sortBlog={sortBlog}/>

        {!blogs? <AllBlogLoader/> :
            <div className='container mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {blogs.map((blog,ind)=>(
                        <BlogCard views={blog.views} blogId={blog._id} key={ind} category={blog.category} title={blog.title}  image={blog.image} likes={blog.likes} createdAt={blog.createdAt} />
                    ))}
                </div>
                    {
                        blogs.length==0 ?<></>:
                <Pagination totalPages={totalPages} pageNo={pageNo} setPageNo={setPageNo}/>
                    }
            </div>
        }
    </div>
  )
}
export default AllBlogs