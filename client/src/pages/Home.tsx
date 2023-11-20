import { useEffect, useRef, useState } from 'react';
import { categories } from '../utils/data.ts';
import { motion } from 'framer-motion';
import { Features } from '../components/Features.tsx';
import { Link } from 'react-router-dom';


const Home = () => {
  const [width, setWidth] = useState<number>(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousel.current) 
    {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      // Add auto-scroll effect
      const scrollInterval = setInterval(() => {
        if (carousel.current) {
          carousel.current.scrollLeft += 1; // Change the scroll speed as needed
          if (carousel.current.scrollLeft >= width) {
            carousel.current.scrollLeft = 0;
          }
        }
      }, 25); // Adjust the interval duration as per the desired scroll speed
      return () => clearInterval(scrollInterval); // Cleanup function to clear interval on unmount
    }
  }, [width]);

  return (
    <div className='dark:text-white dark:bg-gray-950'>
      {/* HERO SECTION */}
        <section  
        className='hero bg-cover flex flex-col items-center space-y-4 h-[90vh] md:px-24 px-5 justify-center lg:items-start lg:px-14' style={{backgroundImage:" linear-gradient(0deg,#0006,#0006), url(/hero.jpg)"}}>
        
        <motion.h1 
          transition={{ease:"backInOut",duration:"1",delay:0}}
          initial={{opacity:0,x:20}}
          animate={{ opacity: 1,x:0 }}
          exit={{opacity:0,x:0}}
        className='hero-heading text-4xl font-extrabold text-center text-white fill-none lg:text-7xl lg:w-[60%] lg:text-left'>
          Unleash your creativity with Inkverse
        </motion.h1>

        <motion.p
          transition={{ease:"backInOut",duration:"1",delay:1}}
          initial={{opacity:0,x:20}}
          animate={{ opacity: 1,x:0 }}
          exit={{opacity:0,x:0}}
        className='text-center text-white  lg:w-[60%] lg:text-left'>
          Welcome to our vibrant blogging community, where words come to life and stories unfold. Dive into a diverse collection of articles written by passionate individuals sharing their insights, experiences, and knowledge
        </motion.p>


        <Link to="/blog/explore" className="relative inline-block px-10 py-2 font-medium group">
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
        <span className="relative text-black group-hover:text-white">Explore</span>
        </Link>
      

      </section>

      {/* FEATURES SECTION */}
      <section className='py-10'>
          <Features/>
      </section>

      {/* CATEGORY SECTION */}
      <section className="mx-5 lg:mx-40 py-10 dark:text-white dark:bg-gray-950">
        <motion.h1 transition={{ ease: 'backInOut', duration: '1' }} className='text-3xl font-semibold py-4 px-3 lg:text-5xl'>
          Browse By Category
        </motion.h1>
        <motion.div className='outer-corousel overflow-x-hidden cursor-grab flex' ref={carousel}>
          <motion.div className='inner-corousel flex py-7' drag="x" dragConstraints={{ right: 0, left: -width }}>
            {categories.map((blog, i) => (
              <motion.div key={i} className=' p-3 w-52 lg:p-6  lg:h-96 lg:w-72 '>
                <img src={blog.img} alt="" className='w-100% h-[100%] w-[100%] object-fill rounded-lg pointer-events-none' />
                <Link to={"/blog/category/"+blog.name} className=' m-1 text-center py-6' >{blog.name.toUpperCase()}</Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
