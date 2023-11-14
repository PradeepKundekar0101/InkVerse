import {useEffect, useState} from 'react'
import { useAppSelector } from '../app/hooks';
import { serverUrl } from '../conf/conf';
import axios from 'axios';
const Home = () => {
    const user = useAppSelector((state:any)=>{ return state.auth.user });
    const [title,setTitle] = useState<string>();
    const [content,setContent] = useState<string>();
    const [image,setImage] = useState<string>();
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

      <section className="bg-gray-950 py-4 text-white">
        <h1 className='text-3xl font-bold mx-3.5 my-4'>Explore by Categories</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 mx-3.5 gap-5'>
          <button className='py-7 text-2xl font-semibold object-cover rounded-md' style={{backgroundImage:"url(https://wallpaperaccess.com/full/266471.jpg)"}}> 
            Technology
          </button>
          <button className='py-7 text-2xl font-semibold object-center rounded-md' style={{backgroundImage:"url(https://www.hdwallpapers.in/download/green_leaves_in_blur_green_background_hd_nature-1366x768.jpg)"}}> 
            Nature
          </button>
          <button className='py-7 text-2xl text-white font-semibold object-center rounded-md' style={{backgroundImage:"linear-gradient(0deg,#0009,#0009), url(https://e0.pxfuel.com/wallpapers/319/181/desktop-wallpaper-health-care-medical-care.jpg)",objectFit:"contain"}}> 
            Health
          </button>
          <button className='py-7 text-2xl text-white font-semibold object-center rounded-md' style={{backgroundImage:"linear-gradient(0deg,#0009,#0009), url(https://thumbs.dreamstime.com/b/balanced-diet-food-background-balanced-diet-food-background-organic-food-healthy-nutrition-superfoods-meat-fish-legumes-nuts-121936796.jpg)",objectFit:"none"}}> 
            Food
          </button>
          <button className='py-7 text-2xl text-white font-semibold object-center rounded-md' style={{backgroundImage:"linear-gradient(0deg,#0009,#0009), url(https://png.pngtree.com/background/20230401/original/pngtree-travel-around-the-world-background-picture-image_2253108.jpg)",objectFit:"none"}}> 
            Travel
          </button>
          <button className='py-7 text-2xl text-white font-semibold object-center rounded-md' style={{backgroundImage:"linear-gradient(0deg,#0009,#0009), url(https://png.pngtree.com/background/20230401/original/pngtree-travel-around-the-world-background-picture-image_2253108.jpg)",objectFit:"none"}}> 
            Travel
          </button>
        </div>
      </section>
    </div>
  )
} 

export default Home