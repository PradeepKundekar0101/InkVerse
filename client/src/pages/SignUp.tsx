import { useState} from 'react'

import {provider,auth} from '../firebase.ts'

import {serverUrl} from '../conf/conf'
import {signInWithPopup} from "firebase/auth";

import {FcGoogle} from 'react-icons/fc'
import axios from 'axios';
import { useDispatch } from 'react-redux';

//@ts-ignore
import {login} from '../app/slices/authSlice.js'

const SignUp = () => {
    const [user_name,setUser_name] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
   
    const [error, setError] = useState<string>('');

    const dispatch = useDispatch();
    const handleSubmit =async (e:any)=>
    {
      
        try
        {
          e.preventDefault();
          if ( !email || !password || !user_name ) {
            return;
          }
          
          const url = serverUrl+"/api/user/register" 
          const response = await axios.post(url,{user_name, password,email});
         
          if(response.status===200)
          {
            alert("User Created");
            dispatch( login({token:response.data.token,user:response.data.user}) )
          }
          
        } catch (error:any)
        {
          if (error.response)  setError(error.response.data.message);
          else  setError('An unexpected error occurred. Please try again later.');
        }    
    }
    function handleGoogleSignUp()
    {
      signInWithPopup(auth,provider).then( async (data2)=>
      {
        const {displayName,email,photoURL} = data2.user;
        try {
            
            const url = serverUrl+"/api/user/register"
            const response = await axios.post(url,{user_name:displayName,profile_picture: photoURL,email});
            if(response.status===200)
            {
              alert("User Created");
            }
        } catch (error:any)
        {
          if (error.response)  setError(error.response.data.message);
          else  setError('An unexpected error occurred. Please try again later.');
        }
    })
   }

  return (
    <div className='f container-signup'>
        <h1 className='text-2xl'>Sign Up </h1>
        <div className='bg-white flex flex-col w-80 items-center shadow-md'>

        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center'>
            <input 
              className='my-5' 
              value={email} 
              onChange={(e)=>{setEmail(e.target.value)}} 
              type="email" 
              placeholder='email' 
              />
            <input
              className='my-5'
              onChange={(e)=>{setPassword(e.target.value)}} 
              value={password}  
              type="password" 
              placeholder='password' 
              />

            <input 
              className='my-5' 
              onChange={(e)=>{setUser_name(e.target.value)}} 
              value={user_name}  
              type="text" 
              placeholder='user name' 
              />

            <button 
              type='submit' 
              onClick={handleSubmit}
              className='btn-primary'>Signup         
            </button>
            {error && <p className="text-red-500">{error}</p>} 
        </form>
        <p className='text-slate-400 text-sm my-2'> ---- OR ----</p>
        <p>Sign Up with</p>
        <button className='btn-secondary my-2' onClick={handleGoogleSignUp}>  <FcGoogle/> Google </button>

            </div>
    </div>
  )
}

export default SignUp