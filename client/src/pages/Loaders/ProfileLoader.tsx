
import AllBlogLoader from './AllBlogLoader'
const ProfileLoader = () => {
  return (
    <div className='lg:px-36 dark:bg-gray-950 px-3 '>
        <div className='flex justify-between'>
        <div className='rounded-md my-4 h-32 w-32 shadow-xl animate-pulse bg-slate-400 dark:bg-slate-700 lg:h-48 lg:w-48 '>
        </div>
        <div className='h-8 animate-pulse w-28 bg-slate-400 dark:bg-slate-700 my-10'></div>
        </div>
        <div className='h-7 w-28 mb-2 rounded-full bg-slate-400 dark:bg-slate-700'></div>
        <div className='h-2.5 w-48 rounded-full mb-2 bg-slate-400 dark:bg-slate-700'></div>
        <div className='h-2.5 w-52 rounded-full bg-slate-400 dark:bg-slate-700'></div>
        <div className='mx-auto h-5 w-44 bg-slate-400 my-4 rounded-full dark:bg-slate-700'></div>
        <AllBlogLoader/>
    </div>
  )
}

export default ProfileLoader