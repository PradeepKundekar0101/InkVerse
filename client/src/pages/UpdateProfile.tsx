import React, {useEffect, useState,useRef} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../conf/conf'


import {storage} from '../firebase.ts'

import { StorageReference, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
type User ={
    user_name:string
    email:string
    profile_picture:string
}
const UpdateProfile = () => {
    const {userId}= useParams<string>();
    const [user_name,setUsername] = useState<string>("");
    const [bio,setBio] = useState<string>("");
    const [profile_picture,setProfilePicture] = useState<File | null>();
    const [profile_picture_url,setProfilePictureUrl] = useState<string>();

    const imageBtnRef = useRef<any>(null);

    const handleFileChange = (e:any)=>{
        if(!e) return;
        setProfilePicture(e.target.files[0])
        setProfilePictureUrl(URL.createObjectURL(e.target.files[0]));
    }

    const fetchUser = async() => {
        try {
          const res = await axios.get(`${serverUrl}/api/user/${userId}`);
          const {user_name,bio,profile_picture} = res.data.user;
          setUsername(user_name);
          setBio(bio);
          setProfilePicture(profile_picture);
          setProfilePictureUrl(String(res.data.user.profile_picture))
        } catch (error){
            
        }
      }
      useEffect(() => {
          fetchUser();
      }, [])

      const handleChangeProfile = (e:any)=>{
        e.preventDefault()
        imageBtnRef.current.click();
      }
      const handleSubmit = async(e:any)=>{
        e.preventDefault()
        if ( !user_name || !profile_picture ) {
            return;
          }
        try {
            const imageRef:StorageReference = ref(storage,`profiles/${Date.now()}`);
            if(!profile_picture) return 
            const imageUpload = await uploadBytes(imageRef,profile_picture)
            if(imageUpload)
            {
              const downloadURL = await getDownloadURL(ref(storage,imageUpload.metadata.fullPath))
              setProfilePictureUrl(downloadURL)
            }
            const url = serverUrl+"/api/user/"+userId 
            const response = await axios.put(url,{user_name,profile_picture: profile_picture_url, bio});
          
           if(response.status===200)
           {
             alert("User Updated");
           }
           else if(response.status===409)
           {

           }
        } catch (error) {
            console.log(error)
        }
        
      }

  return (
    <div>
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col items-center space-y-2'>
            <img src={profile_picture_url} className='h-32 w-32 rounded-full border border-blue-700 border-spacing-x-2.5' alt="" />
            <button onClick={handleChangeProfile} className='border-slate-200 bg-slate-200 px-2 py-1 rounded-md'>Change Profile</button>
            <input type="text" value={user_name}  className='border border-slate-300 py-1 rounded-md px-1' onChange={(e)=>{setUsername(e.target.value)}} />
            <label htmlFor="bio">Add Bio:</label>
            <textarea 
                name="bio"
                className='border border-slate-200 bg-slate-100 rounded-md'
                value= {bio}
                onChange={(e)=>{if(bio.length<=100) setBio(e.target.value) }}
                cols={40} rows={10}
                maxLength={100}
            ></textarea>
            <span>{bio.length}/100</span>
            <input type="file" onChange={handleFileChange} className='hidden' ref={imageBtnRef} />
            <input type="submit" className='btn-primary1' value="update" />
        </form>
    </div>
  )
}

export default UpdateProfile