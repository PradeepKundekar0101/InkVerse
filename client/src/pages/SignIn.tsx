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

const SignIn = () => {

    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
   
    const [error, setError] = useState<string>('');

    const dispatch = useDispatch();
    const handleSubmit =async (e:any)=>
    {
      
        try
        {
          e.preventDefault();
          if ( !email || !password  ) {
            return;
          }
          const url = serverUrl+"/api/user/login" 
          const response = await axios.post(url,{password,email});
          if(response.status===200)
          {
            alert("Login Successfull");
            const {token,user} =response.data;
            dispatch( login({token,user}) )
          }
          
        } catch (error:any)
        {
          if (error.response)  setError(error.response.data.message);
          else  setError('An unexpected error occurred. Please try again later.');
        }    
    }
    function googleAuth(){
        signInWithPopup(auth,provider).then( async (data2)=>{
          const {email} = data2.user;
        try {
 
          const response = await axios.post(serverUrl+"/api/user/signin",{email,google:true});
          console.log(response)
          if(response.status===200)
          {
            alert("Login Successfull");
            const {token,user} =response.data;
            dispatch( login({token,user}) )
            
          }
        } catch (error:any) {
          console.log(error)
          //  alert(error)
        }
      })
     }

  return (
    <div className='f container-signup'>
        <h1 className='text-2xl'>Sign In </h1>
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

            <button 
              type='submit' 
              onClick={handleSubmit}
              className='btn-primary'>Signup         
            </button>
            {error && <p className="text-red-500">{error}</p>} 
        </form>
        <p className='text-slate-400 text-sm my-2'> ---- OR ----</p>
        <p>Sign In with</p>
        <button className='btn-secondary my-2' onClick={googleAuth}>  <FcGoogle/> Google </button>
              <Link to="/signup"> Create an account  </Link>
            </div>
    </div>
  )
}

export default SignIn