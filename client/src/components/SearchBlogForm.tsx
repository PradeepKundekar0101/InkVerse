import React,{useState} from 'react'
import { BiSearch } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'


const SearchBlogForm:React.FC = () => {
    const navigate = useNavigate();
    const [search,setSearch] = useState<string>("");
  return (
    <div>
         <form className='flex justify-center w-full' onSubmit={()=>{navigate("/blog/search/"+search)}}>
                <div 
                    className='bg-white rounded-full flex mx-4 lg:mx-28 items center py-1 w-full justify-between px-2 dark:bg-gray-800 '>
                    <input 
                        type="text" 
                        placeholder='Search by title or tags' 
                        onChange={(e)=>{setSearch(e.target.value)}} 
                        value={search} 
                        className='outline-none px-2 w-full dark:bg-gray-800 ' 
                    /> 
                    <button 
                        className='text-white bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center'
                    > 
                    <BiSearch/> 
                    </button>
                </div>
            </form>
    </div>
  )
}

export default SearchBlogForm