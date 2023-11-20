import './index.css'
import { useEffect } from 'react'
import SignUp from './pages/SignUp'
import {RouterProvider,createBrowserRouter,createRoutesFromElements,Route,Navigate} from 'react-router-dom'
import SignIn from './pages/SignIn.js'
import Profile from './pages/Profile.js'
import Home from './pages/Home.js'
import { useAppSelector } from './app/hooks.js'
import UpdateProfile from './pages/UpdateProfile.js'
import AddBlog from './pages/AddBlog.js'
import AllBlogs from './pages/AllBlogs.js'
import SingleBlog from './pages/SingleBlog.js'
import UpdateBlog from './pages/UpdateBlog.js'
import Layout from './pages/Layout.js'
import CategoryBlog from './pages/CategoryBlog.js'
import SearchBlog from './pages/Search.js'
import NotFound from './pages/NotFound.js'

const App = () => {
  const mode = useAppSelector ((state)=>{return state.mode.mode});
  useEffect(() => {
      if(mode==="dark")
      {
          document.documentElement.classList.add("dark");
      }
      else{
        document.documentElement.classList.remove("dark");
      }
  }, [mode])
  
    const user =  useAppSelector((state)=>{ return state.auth.user })
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path='/' element={<Layout/>}>
            <Route path='' element={<Home/>}/>
             <Route path='signin' element={!user?<SignIn/>:<Navigate to="/"/>}/>
            <Route path='signup' element={!user?<SignUp/>:<Navigate to="/"/>}/>
            <Route path='user/:userId' element={<Profile/>}/> 
            <Route path='user/update/:userId' element={<UpdateProfile/>}/> 

            <Route path='blog/addblog' element={user?<AddBlog/>:<Navigate to="/signin"/>} />
            <Route path='blog/explore' element={<AllBlogs/>} />
            <Route path='blog/:blogId' element={<SingleBlog/>} />
            <Route path='blog/update/:blogId' element={user?<UpdateBlog/>:<Navigate to="/sigin"/>} />
            <Route path='blog/category/:blogCat' element={<CategoryBlog/>} />
            <Route path='blog/search/:search' element={<SearchBlog/>} />

            <Route path='/notfound' element={<NotFound/>}/>

        </Route>
      ))  
  return (
    <>
    <RouterProvider router={router}/> 
    </>
  )
}
export default App





