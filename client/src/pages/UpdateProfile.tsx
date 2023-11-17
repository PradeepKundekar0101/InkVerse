import  {useEffect, useState,useRef} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { debounce } from 'lodash';
import { serverUrl } from '../conf/conf'
import { useAppSelector,useAppDispatch} from '../app/hooks.ts'
import {useNavigate} from 'react-router-dom'

import {storage} from '../firebase.ts'
import { StorageReference, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import {AiFillCheckCircle} from 'react-icons/ai'
import {FcCancel} from 'react-icons/fc'

import {login} from '../app/slices/authSlice.ts'
import { Toaster,toast } from 'react-hot-toast';

const UpdateProfile = () => {

    const token = useAppSelector((state)=>{return state.auth.token});
    const user = useAppSelector((state)=>{ return state.auth.user});
    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const {userId}= useParams<string>();
    const [user_name,setUsername] = useState<string>("");
    const [bio,setBio] = useState<string>("");
    const [profile_picture,setProfilePicture] = useState<File | null>();
    const [profile_picture_url,setProfilePictureUrl] = useState<string>("");

    const [error,setError] = useState<string>();
    const [userNameAvailable,setUserNameAvailable] = useState<boolean>();
    const [loading,setLoading] = useState<boolean>(false);
    

    const imageBtnRef = useRef<any>(null);

    

    //METHOD 1 
    const handleFileChange = (e:any)=>{
        if(!e) return;
        setProfilePicture(e.target.files[0])
        setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
    }

    //METHOD 2
    const fetchUser = async() => {
        try {
          const url = `${serverUrl}/api/user/id/${userId}`
          const res = await axios.get(url);
          const {user_name,bio,profile_picture} = res.data.user;
          setUsername(user_name);
          setBio(bio);
          setProfilePicture(profile_picture);
          setProfilePictureUrl(profile_picture);
        } catch (error:any){
            toast.error(error.response.data.data)
        }
      }
      useEffect(() => {
          fetchUser();
      }, [])

      //METHOD 3
      const checkAvailability =  async(input:string) => {
        
        // Perform the real-time availability check
        try {
          const url = serverUrl+"/api/user/name/"+input 
          const data = await axios.get(url);
          setUserNameAvailable(data.data.success);

        } catch (error:any) {
          alert(error.response.data.data)
        }
      };
      const debouncedCheckAvailability = debounce(checkAvailability, 1000);

      const handleUserNameChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
          const val = e.target.value;
          setUsername(e.target.value);
          if(val.length<3)
            setError("Min 3 characters");
          else if(val.split(" ").length>1)
            setError("User name must be single word, No spaces allowed");
          else if(val.length>20)
            setError("User name must not exceed 20 characters");
          else if(!/^[a-z0-9]+$/.test(val)) setError("User Name must contain only lowercase characters and numbers")
          else{
            debouncedCheckAvailability(val);
            setError("")
          }

      }
     

      //METHOD 5
      const handleChangeProfile = (e:any)=>{
        e.preventDefault()
        imageBtnRef.current.click();
      }

      //METHOD 6  
     
      const handleSubmit = async(e:any)=>{
  
        e.preventDefault()
        setLoading(true);
        toast.loading("Updating profile...");
        if ( !user_name || !profile_picture ) {
            toast.dismiss();
            toast.error("All Fields are required");
            return;
        }
        try {
            const imageRef:StorageReference = ref(storage,`profiles/${Date.now()}`);
            if(!profile_picture ) return 
            let downloadURL:string = profile_picture_url;
            if(!(typeof profile_picture==='string'))
            {
                const imageUpload = await uploadBytes(imageRef,profile_picture)
                if(imageUpload)
                   downloadURL = await getDownloadURL(ref(storage,imageUpload.metadata.fullPath))
                else
                {
                    toast.error("Image Uploading failed");
                    return;
                }
            }
             const url = serverUrl+"/api/user/"+userId 
              const postData ={
              user_name,profile_picture: downloadURL, bio
            }
            const headers = {"Content-Type":"application/json","Authorization":token }
            const response = await axios.put(url,postData,{headers});
            toast.dismiss();
           if(response.status===200)
           {
             toast.success("User Updated");
             setLoading(false);
             console.log(response.data.user)
             dispatch(login({user:response.data.user,token}));
             
           }
        } catch (error:any) {
          toast.dismiss();
          setLoading(false);
          toast.error(error.response.data.data)
        }
        
      }

  return (
    <div className='py-10 dark:bg-gray-950 dark:text-white'>
      <Toaster/>
        <h1 className='text-3xl  lg:mx-72 py-10 lg:text-4xl mx-4'>Update Profile</h1>
        <form onSubmit={handleSubmit} className='flex lg:mx-72 flex-col items-start justify-start space-y-2 mx-4'>
          <div className='flex items-center flex-col mx-auto'>
            <img 
              src={profile_picture_url} 
              className='h-32 w-32 rounded-full border-blue-100 border-4 my-2 shadow-lg lg:h-52 lg:w-52' alt="profile" />
            <button onClick={handleChangeProfile} className='border-slate-200 mx-auto bg-slate-200 px-2 py-1  my-4 rounded-sm dark:text-black '>Change Profile</button>
          </div>
            <input 
              type="text" 
              value={user_name}  
              className='border border-slate-300 py-2 outline-none focus:ouline-none rounded-md px-2 w-full dark:bg-slate-700
              dark:border-none' 
              onChange={handleUserNameChange}  
            />
            {error && <small className='text-red-500'>{error}</small>}
            { error?.length===0 && userNameAvailable && user &&  user.user_name!==user_name && <small className='text-green-600 flex items-center'> User name available &nbsp; <AiFillCheckCircle size={15}/> </small> }
            { error?.length===0 && !userNameAvailable && user &&  user.user_name!==user_name && <small className='text-red-600 flex items-center'> User name taken &nbsp; <FcCancel size={15}/> </small> }
            
            <label htmlFor="bio" className='text-left'>Bio</label>
            <textarea 
                name="bio"
                className='border border-slate-200 outline-none rounded-md p-2 w-full dark:bg-slate-700
                dark:border-none '
                value= {bio}
                onChange={(e)=>{if(bio.length<=100) setBio(e.target.value) }}
                cols={40} rows={10}
                maxLength={100}
            ></textarea>
            <span>{bio.length}/100</span>
            
            <input type="file" onChange={handleFileChange} className='hidden' ref={imageBtnRef} />
            <div className='flex space-x-1'>
          
            <input type="submit" disabled={loading} className='btn-primary1' value={loading?"Updating...":"Update"} />
            <button disabled={loading} className='bg-slate-200 px-4 rounded-md dark:text-black' onClick={()=>{navigate("/")}} >Cancel</button>
            
          
            </div>
        </form>
    </div>
  )
}

export default UpdateProfile