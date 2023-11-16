import {useEffect,useState} from 'react'
import { catImageMap } from '../utils/data'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../conf/conf';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import AllBlogLoader from './Loaders/AllBlogLoader';
import SearchBlogForm from '../components/SearchBlogForm';
import SortByBtn from '../components/SortByBtn';
const CategoryBlog = () => {
    const { blogCat } = useParams<string>();
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
            const url = `${serverUrl}/api/blog/all?category=${blogCat}`;
            const response = await axios.get(url);
            setBlogs(response.data.data)    
        } catch (error) {
            
        }
    }

    useEffect(() => {
        setBlogs(null);
        fetchBlogs();
    }, []);

    useEffect(()=>{
        fetchBlogs();
    },[pageNo]);

    const sortBlog = async (parameter:string)=>{
        try {
            setBlogs(null);
            const url = `${serverUrl}/api/blog/all?category=${blogCat}&sort=${parameter}&page=${pageNo}`
            const response = await axios.get(url);
            setBlogs(response.data.data);
        } catch (error) {
        
        }
        }

  return (
    <>
        {
            !blogs?<AllBlogLoader/> : 
            
                blogs.length ===0 ? <div className='flex items-center justify-center'>
                                        <h1 className='text-5xl'> No Blogs Found </h1> 
                                    </div>
                :
            <div className='dark:bg-gray-950'>
                <div 
                        className='flex  mx-10 mb-10 h-56 lg:h-72 object-center justify-center flex-col items-center' 
                        style={ blogCat ?  {backgroundImage:`linear-gradient(0deg,#0008,#0008), url(${catImageMap.get(blogCat)})`}:{}}>
                        <h1 className='text-white text-3xl font-semibold'>Blogs related to {blogCat}</h1>
                </div>
                    <SearchBlogForm/>
                    <SortByBtn sortBlog={sortBlog}/>
                <div className='container mx-auto'>
                    <h1> {blogs.length} Blogs found</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {blogs.map((blog,ind)=>(
                    <BlogCard views={blog.views} blogId={blog._id} key={ind} category={blog.category} title={blog.title}  image={blog.image} likes={blog.likes} createdAt={blog.createdAt} />
                    ))}
                    </div>
                </div>
        <Pagination setPageNo={setPageNo} totalPages={Math.ceil(blogs.length/10)} pageNo={pageNo}/>
        </div>
            
        }
        

      </>
  )
}
export default CategoryBlog