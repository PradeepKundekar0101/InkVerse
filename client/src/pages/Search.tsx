import {useEffect,useState} from 'react'

import { useParams } from 'react-router-dom'
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
                blogs.length ===0 ? <div className='flex items-center justify-center'>
                        <h1 className='text-5xl dark:text-white'> No Blogs Found </h1> 
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