import './index.css'
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
const App = () => {
    const user =  useAppSelector((state)=>{ return state.auth.user })
    const router = createBrowserRouter(createRoutesFromElements(
        <Route path='/' element={<Layout/>}>
            <Route path='' element={<Home/>}/>
             <Route path='signin' element={!user?<SignIn/>:<Navigate to="/"/>}/>
            <Route path='signup' element={<SignUp/>}/>
            <Route path='user/:userId' element={<Profile/>}/> 
            <Route path='user/update/:userId' element={<UpdateProfile/>}/> 

            <Route path='blog/addblog' element={<AddBlog/>} />
            <Route path='blog/explore' element={<AllBlogs/>} />
            <Route path='blog/:blogId' element={<SingleBlog/>} />
            <Route path='blog/update/:blogId' element={<UpdateBlog/>} />

        </Route>
      ))  
  return (
    <>
    <RouterProvider router={router}/> 
    </>
  )
}
export default App





