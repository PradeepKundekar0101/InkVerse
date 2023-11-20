import { useState} from 'react'

import {provider,auth} from '../firebase.ts'

import {serverUrl} from '../conf/conf'
import {signInWithPopup} from "firebase/auth";

import {FcGoogle} from 'react-icons/fc'
import { debounce } from 'lodash';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
//@ts-ignore
import {login} from '../app/slices/authSlice.js'
import {RiVerifiedBadgeFill} from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
    const [user_name,setUser_name] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
   
    const [error, setError] = useState<string>('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const handleSubmit =async (e:any)=>
    {
        try
        {
          e.preventDefault();
          if(emailError || passwordError || usernameError) return;

          setLoading(true);
          toast.loading("Creating Account");
          const url = serverUrl+"/api/user/register" 
          const response = await axios.post(url,{user_name, password,email});
         
          toast.dismiss();
          toast.success("User Created")
          if(response.status===200)
          {
            setLoading(false);
            dispatch( login({token:response.data.token,user:response.data.user}) )
          }

        
          navigate("/");
        
        } catch (error:any)
        {
          setLoading(false);
          toast.dismiss();
          if (error.response)  toast.error(error.response.data.message);
          else  toast.error('An unexpected error occurred. Please try again later.');
        }    
    }
    function handleGoogleSignUp()
    {
      signInWithPopup(auth,provider).then( async (data2)=>
      {
        const {displayName,email,photoURL} = data2.user;
        try {
            setLoading(true);
            toast.loading("Creating Account");
            const url = serverUrl+"/api/user/register"
            const response = await axios.post(url,{user_name:displayName?.split(" ")[0].toLowerCase(),profile_picture: photoURL,email});
            toast.dismiss();
            if(response.status===200)
            {
              toast.success("User created")
              dispatch( login({token:response.data.token,user:response.data.user}) )
            }
        } catch (error:any)
        {
          toast.dismiss();
          
          if (error.response)  toast.error(error.response.data.message);
          else  toast.error('An unexpected error occurred. Please try again later.');
        }
        finally{
          setLoading(false);
          
        }
    })
   }
   const validateEmail = (email:string)=>{
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        setEmailError("Invalid Email")
        return;
      }
      setEmailError(null);
   }
   const validatePassword = (password:string)=>{
     
      if(password.length<3){
        setPasswordError("Password must min 3 character");
        return;
      }
      if(password.length>20){
        setPasswordError("Password must exceed 20 character");
        return;
      }
      if(password.split(" ").length>1)
      {
        setPasswordError("Password must not contains spaces");
        return;
      }
      setPasswordError(null);
   }

   const checkAvailability =  async(input:string) => {
        
    // Perform the real-time availability check
    try {
      const url = serverUrl+"/api/user/name/"+input 
      const data = await axios.get(url);
      if(!data.data.success) setUsernameError("this user name is already taken");

    } catch (error:any) {
      alert(error.response.data.data)
    }
  };
  const debouncedCheckAvailability = debounce(checkAvailability, 500);
    const validateUsername = (val :string)=>
    {
      if(val.length<3)
      setUsernameError("Min 3 characters");
      else if(val.split(" ").length>1)
      setUsernameError("User name must be single word, No spaces allowed");
      else if(val.length>20)
      setUsernameError("User name must not exceed 20 characters");
      else if(!/^[a-z0-9]+$/.test(val)) setError("User Name must contain only lowercase characters and numbers")
      else{
            debouncedCheckAvailability(val);
            setUsernameError(null)
          }
   }

  return (
    <div className='f container-signup  dark:text-white px-3 lg:px-96'>
      <Toaster/>
        <div className='bg-white flex flex-col w-full  items-center  dark:bg-slate-800 py-24 rounded-lg shadow-2xl'>
        <h1 className='text-3xl font-bold mb-7 '>Create an account </h1>

        <form onSubmit={handleSubmit} className='flex flex-col w-full px-10 justify-center items-center'>
           
           <div className='flex items-center mb-1 dark:bg-slate-700 text-lg py-1 px-1 w-full rounded-lg bg-slate-100'>
           
            <input 
              className='px-1 w-full rounded-md dark:bg-slate-700 text-lg bg-slate-100 dark:text-white outline-none py-1' 
              value={email} 
              onChange={(e)=>{validateEmail(e.target.value);setEmail(e.target.value);}} 
              type="email" 
              placeholder='email' 
              />
            {
              email.length>0 ?  emailError? <MdCancel size={28} fill="#e74c3c"/> :
              <RiVerifiedBadgeFill size={28} fill="#27ae60"/> :<></>
              }
            
           </div>
            { <h3 className='text-left self-start px-2 mb-1 text-red-500' style={emailError?{visibility:"visible"}:{visibility:"hidden"}}>{emailError}</h3>}

        <div className='flex items-center mb-1 dark:bg-slate-700 text-lg py-1 px-1 w-full rounded-lg bg-slate-100'>

            <input
              className='px-1 w-full rounded-md dark:bg-slate-700 text-lg bg-slate-100 dark:text-white outline-none py-1'
              onChange={(e)=>{setPassword(e.target.value);validatePassword(e.target.value)}} 
              value={password}  
              type="password" 
              placeholder='password' 
              />
              { 
                password.length>0?
                passwordError? <MdCancel size={28} fill="#e74c3c"/> :
              <RiVerifiedBadgeFill size={28} fill="#27ae60"/> :<></>
              }
              </div>
               <h3 className='text-left self-start px-2 mb-1 text-red-500' style={passwordError?{visibility:"visible"}:{visibility:"hidden"}} >{passwordError}</h3>

      <div className='flex items-center mb-1 dark:bg-slate-700 text-lg py-1 px-1 w-full rounded-lg bg-slate-100'>

            <input 
              className='px-1 w-full rounded-md dark:bg-slate-700 text-lg bg-slate-100 dark:text-white outline-none py-1' 
              onChange={(e)=>{setUser_name(e.target.value);validateUsername(e.target.value)}} 
              value={user_name}  
              type="text" 
              placeholder='user name' 
              />
              {
                user_name.length >0?
                usernameError? <MdCancel size={28} fill="#e74c3c"/> :
              <RiVerifiedBadgeFill size={28} fill="#27ae60"/>:<></>
              }
              </div>
             <h3 className='text-left self-start px-2 mb-1 text-red-500' style={usernameError?{visibility:"visible"}:{visibility:"hidden"}}>{usernameError}</h3>
            <button 
              type='submit' 
              onClick={handleSubmit}
              disabled={loading}
              className=' w-full py-2  text-white bg-blue-600 font-bold rounded-md '>{ loading?"Creating...":"Sign Up"} 
            </button>
            {error && <p className="text-red-500">{error}</p>} 
        <p className='text-slate-400 text-sm my-2'> ---- OR ----</p>
        <p>Sign Up with</p>
        <button type="button" className='py-2 flex  px-20 rounded-lg justify-center text-xl lg:w-full lg:mx-4  items-center bg-slate-200 dark:text-white mx-10 text-black my-2 dark:bg-slate-700 ' onClick={handleGoogleSignUp}>  <FcGoogle/> Google </button>
            <p>Already have an account? <Link className='underline' to="/signin">Login</Link> </p>
        </form>

            </div>
    </div>
  )
}

export default SignUp