import {useEffect,useState} from 'react'

import { Link, useParams } from 'react-router-dom'
import { serverUrl } from '../conf/conf';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

import AllBlogLoader from './Loaders/AllBlogLoader';
import Pagination from '../components/Pagination';
import SearchBlogForm from '../components/SearchBlogForm';
const SearchBlog = () => {
    
    const { search } = useParams<string>();
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
    const [blogs,setBlogs] = useState<Blog[] | null>(null);
    const fetchBlogs = async()=>{
        try {
            const url = `${serverUrl}/api/blog/search/${search}`;
            const response = await axios.get(url);
            setBlogs(response.data.data)
            console.log(response.data.data)
            
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchBlogs();
    }, [])
    useEffect(()=>{
        fetchBlogs();
    },[pageNo])
  return (
    <div className='dark:bg-gray-950'>
            { 
                blogs? 
                blogs.length ===0 ?  <div className='flex items-center justify-center h-screen flex-col dark:bg-gray-950'>
                                        <h1 className='text-5xl text-center dark:text-blue-100 mb-10 font-semibold'> No Blogs Found</h1> 
                                        <Link to="/blog/add" className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
                                                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                                                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                </span>
                                                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                </span>
                                                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Post a blog</span>
                                                </Link>

                                    </div>
                
                  :
                  <div className='container mx-auto'>
                      <div>
                        <h1 className='text-3xl py-3 lg:py-10 text-center dark:text-white'>{blogs.length} Blogs found</h1>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <SearchBlogForm/>  
                            {blogs.length >0  && blogs.map((blog,ind)=>(
                              <BlogCard 
                              views={blog.views} 
                              blogId={blog._id}
                              key={ind}
                              category={blog.category}
                              title={blog.title}
                              image={blog.image}
                              likes={blog.likes}
                              createdAt={blog.createdAt}
                              />
                              ))
                            }
                            </div>
                    <Pagination setPageNo={setPageNo} pageNo={pageNo} totalPages={Math.ceil(blogs.length/10)}/>
                    </div>
                    </div>
                :
              <AllBlogLoader/>
            }
        </div>
  )
}
export default SearchBlog