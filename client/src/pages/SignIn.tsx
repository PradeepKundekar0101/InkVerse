import { useState} from 'react'

import {provider,auth} from '../firebase.ts'
import {serverUrl} from '../conf/conf'
import {signInWithPopup} from "firebase/auth";

import {FcGoogle} from 'react-icons/fc'
import axios from 'axios';
import { useDispatch } from 'react-redux';

//@ts-ignore
import {login} from '../app/slices/authSlice.js'

import { Link } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';

const SignIn = () => {

    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
   
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
  
    const dispatch = useDispatch();
    function validateEmail(email:string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
    const handleSubmit =async (e:any)=>
    {
      
        try
        {
          e.preventDefault();

          if ( !email || !password  ) {
            toast.error("Fill All the fields");
            return;
          }
          if(!validateEmail(email)){
            toast.error("Invalid Email");
            return;
          }
          setLoading(true);
          toast.loading("Signing In");
          const url = serverUrl+"/api/user/login" 
          const response = await axios.post(url,{password,email});
          if(response.status===200)
          {
            toast.dismiss();
            toast.success("Login Success");
            const {token,user} =response.data;
            dispatch( login({token,user}) )
          }
          setLoading(false);
          
        } catch (error:any)
        {
          if (error.response)   toast.error(error.response.data.message);
          else  toast.error('An unexpected error occurred. Please try again later.');
          setLoading(false);
        }    
    }
    function googleAuth(){
        signInWithPopup(auth,provider).then( async (data2)=>{
        toast.loading("Signing in");
        const {email} = data2.user;
        try {
            setLoading(true);
            const response = await axios.post(serverUrl+"/api/user/signin",{email,google:true});
            toast.dismiss();
            if(response.status===200)
            {
              toast.success("Login Success!");
              const {token,user} =response.data;
              dispatch( login({token,user}) )
              setLoading(false);
          }
        } catch (error:any) {
          toast.dismiss();
          if (error.response)   toast.error(error.response.data.message);
          else  toast.error('An unexpected error occurred. Please try again later.');
          setLoading(false);
        }
      })
     }

  return (
    <div className='f container-signup  dark:text-white px-3 lg:px-96'>
      <Toaster/>
        <div className='bg-white flex flex-col w-full  items-center  dark:bg-slate-800 py-24 rounded-lg shadow-2xl'>
        <h1 className='text-3xl font-bold '>Welcome Back! </h1>

        <form onSubmit={handleSubmit} className='flex flex-col w-full px-10 justify-center items-center'>
            <input 
              className='my-5 mb-2.5 py-1.5 px-1 w-full rounded-md dark:bg-slate-700 text-lg bg-slate-100 dark:text-white outline-none' 
              value={email} 
              onChange={(e)=>{setEmail(e.target.value)}} 
              type="email" 
              placeholder='email' 
              />

            <input
              className='my-5 py-1.5 px-1 rounded-md dark:bg-slate-700 text-lg w-full bg-slate-100 dark:text-white outline-none'
              onChange={(e)=>{setPassword(e.target.value)}} 
              value={password}  
              type="password" 
              placeholder='password' 
              />

            <button 
              type='submit' 
              onClick={handleSubmit}
              className=' w-full py-2  text-white bg-blue-600 font-bold rounded-md '> Log In       
            </button>
            {error && <p className="text-red-500">{error}</p>} 
        <p className='text-slate-400 text-sm my-2'> ---- OR ----</p>
        <p>Sign In with</p>
        <button type='button' className='py-2 flex w-full  px-20 rounded-lg justify-center text-mdlg:w-full lg:mx-4  bg-slate-200 dark:text-white mx-10 text-black my-2 dark:bg-slate-700 items-center' onClick={googleAuth}>  <FcGoogle/> &nbsp; Google </button>
              <Link to="/signup" className="underline"> Create an account  </Link>
        </form>
            </div>
    </div>
  )
}

export default SignIn