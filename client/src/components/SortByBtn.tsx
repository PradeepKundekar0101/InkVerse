import {useState}from 'react'
import { BsSortDownAlt } from 'react-icons/bs';

type PropsType = {
    sortBlog:( parameter:string )=>{}
}
const SortByBtn:React.FC<PropsType> = ({sortBlog}) => {
    const [showSortMenu,setShowSortMenu] = useState<boolean>(false);

  return (
    <div className='flex mx-5 justify-end '>  
    <div className='lg:mx-28'>
        <button 
            onClick={()=>{setShowSortMenu(!showSortMenu)}} 
            className="text-black dark:text-white flex items-center  bg-slate-100 outline  bg-transparent font-medium rounded-lg text-sm px-5 my-2 py-2 text-centeritems-center  " type="button"
            >
            <BsSortDownAlt size={20}/>
                Sort By 
        </button>

        <div style={showSortMenu?{visibility:"visible"}:{visibility:"hidden"}} 
        className="z-10 bg-white  rounded-lg shadow  dark:bg-gray-70 absolute">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-black">
            <li>
                <button onClick={()=>{setShowSortMenu(false); sortBlog("a-z")}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">A-Z</button>
            </li>
            <li>
                <button onClick={()=>{setShowSortMenu(false);;sortBlog("z-a")}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">Z-A</button>
            </li>
            <li>
                <button onClick={()=>{sortBlog("views");setShowSortMenu(false)}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">Views</button>
            </li>
            <li>
                <button onClick={()=>{sortBlog("likes");setShowSortMenu(false);}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">Likes</button>
            </li>
            <li>
                <button onClick={()=>{sortBlog("new");setShowSortMenu(false);}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">New-Old</button>
            </li>
            <li>
                <button onClick={()=>{sortBlog("old");setShowSortMenu(false);}} className="block px-4 py-2 w-full hover:bg-gray-100 text-left dark:hover:bg-gray-600 dark:hover:text-white ">Old-New</button>
            </li>
            </ul>
        </div>
        </div> 
        </div>
  )
}

export default SortByBtn