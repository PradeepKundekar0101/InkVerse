import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks';
import { serverUrl } from '../conf/conf';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {  BiRightArrowAlt } from 'react-icons/bi';
import { catImages } from '../utils/data.ts';
const Home = () => {
    const user = useAppSelector((state:any)=>{ return state.auth.user });
    const [title,setTitle] = useState<string>();
    const [content,setContent] = useState<string>();
    const [image,setImage] = useState<string>();
    const navigate = useNavigate();
    const fetchMostLikedBlog = async()=>{
        try {
          const url = serverUrl+"/api/blog/get/mostLiked"
          console.log(url)
          const data = await axios.get(url);
          // console.log(data.data.)
          setTitle(data.data.mostLikedBlog.title)
          setContent(data.data.mostLikedBlog.content)
          setImage(data.data.mostLikedBlog.image)
        } catch (error) {
          
        }
    }
    useEffect(() => {
        fetchMostLikedBlog();
    }, [])
    

  return (
    <div>
      <section  className='hero bg-cover flex flex-col items-center space-y-4 h-auto py-52 ' style={{backgroundImage:"url(https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?cs=srgb&dl=pexels-joyston-judah-933054.jpg&fm=jpg)"}}>
        <h1 className='text-7xl font-extrabold text-center text-white fill-none lg:text-9xl'>INKVERSE</h1>
        <p className='text-center text-white mx-6 lg:mx-32'>Welcome to our vibrant blogging community, where words come to life and stories unfold. Dive into a diverse collection of articles written by passionate individuals sharing their insights, experiences, and knowledge</p>
        <button className='bg-black text-white py-2 px-6 text-xl lg:px-10 lg:py-3'>Explore</button>
      </section>
      <section>
        <h1 className='text-3xl font-semibold py-4 mx-3.5 lg:text-6xl'>Most Liked Blog</h1>
        
        <div className='flex flex-col-reverse rounded-lg mx-4 shadow-xl  bg-slate-200 p-2 lg:flex-row lg:justify-between'>
          <div className="p-4">
            <h1 className='text-2xl font-bold my-2 lg:text-3xl'>{title}</h1>
            <p className='text-lg my-2'>{content}</p>
            <button className='bg-black rounded-md text-white py-1 px-3 text-xl lg:px-10 lg:py-3'>Read More</button>
          </div>
          <div className="right">
            <img src={image}  className=' object-cover lg:h-72 rounded-lg' />
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-10 lg:py-32  text-white">
        <h1 className='text-3xl font-bold mx-3.5 my-4'>Explore by Categories</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 mx-3.5 gap-5 cat-btns'>
          <button 
            onClick={()=>{navigate("/blog/category/technology")}} 
            className='py-7 text-2xl font-semibold object-cover rounded-md' 
            style={{backgroundImage:`url(${catImages.technology})`}}> 
            Technology
          </button>

          <button 
            onClick={()=>{navigate("/blog/category/nature")}} 
            className='py-7 text-2xl font-semibold object-center rounded-md' 
            style={{backgroundImage:`url(${catImages.nature})`}}> 
            Nature
          </button>

          <button 
            onClick={()=>{navigate("/blog/category/health")}} 
            className='py-7 text-2xl text-white font-semibold object-center rounded-md' 
            style={{backgroundImage:`linear-gradient(0deg,#0009,#0009), url(${catImages.health})`,objectFit:"contain"}}> 
            Health
          </button>

          <button 
          onClick={()=>{navigate("/blog/category/food")}} 
          className='py-7 text-2xl text-white font-semibold object-center rounded-md' 
          style={{backgroundImage:`linear-gradient(0deg,#0009,#0009), url(${catImages.food})`,objectFit:"none"}}> 
            Food
          </button>

          <button 
            onClick={()=>{navigate("/blog/category/travel")}} 
            className='py-7 text-2xl text-white font-semibold object-center rounded-md' 
            style={{backgroundImage:`linear-gradient(0deg,#0009,#0009), url(${catImages.travel})`,objectFit:"none"}}> 
            Travel
          </button>

          <button 
            onClick={()=>{navigate("/blog/category/fitness")}} 
            className='py-7 text-2xl text-white font-semibold object-center rounded-md'
            style={{backgroundImage:`linear-gradient(0deg,#0009,#0009), url(${catImages.fitness})`,objectFit:"none"}}> 
            Fitness
          </button>
        </div>
        <Link to="/blog/explore" className='flex cursor-pointer explore-more-btn text-2xl my-10 text-center mx-auto  items-center justify-center underline font-semibold mb-3'>Explore All <BiRightArrowAlt size={30}/> </Link>
      </section>
    </div>
  )
} 

export default Home