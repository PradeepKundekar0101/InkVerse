import {useRef,useState} from 'react'
//@ts-ignore
import {blogSchema} from './../utils/validationSchema.js'
import {Formik,Form,Field} from 'formik'
import {MdCancel} from 'react-icons/md'
import {AiOutlineCloudUpload} from 'react-icons/ai'

import {storage} from '../firebase.ts'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import axios from 'axios'
import { serverUrl } from '../conf/conf.js'

import { useAppSelector } from '../app/hooks.ts'

import { useNavigate } from 'react-router'

import {blogCategories} from '../utils/data.ts'

type initialValuesType ={
    title:string
    content:string
    imageUrl:string
    tags:string[]
    imageFile: File | null
    tagsInput:string,
    category:string
}
const AddBlog = () => {
    const token = useAppSelector((state)=>{return state.auth.token});
    const [imageUrl, setImageUrl] = useState<string>("https://tinyurl.com/2b8um47r");
    const [image, setImage] = useState<File|null>(null);
    const initialValues : initialValuesType = {
        title:"",
        content:"",
        imageUrl:"",
        tags:[],
        tagsInput:"",
        imageFile:null,
        category:"all"
    }
    const imageInputRef= useRef<HTMLInputElement>(null);
    
    const navigate = useNavigate();

    const handleImageChange = (e:any)=>{
        e.preventDefault();
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  
    const handleSubmit = async (values:any) => {
      
      let downloadURL:string = ""
      if (image) {
        const imageRef = ref(storage, `blogs/${Date.now()}`);
        const imageUpload = await uploadBytes(imageRef, image);
        if (imageUpload)
           downloadURL = await getDownloadURL(ref(storage, imageUpload.metadata.fullPath));
        else{
          alert("Image Uploading failed")
          return;
        }
      }
      else{
        downloadURL="https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png"
      }
      const { title, content, tags,category } = values;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      };
      
  
      const postData = {title,content,tags,image: downloadURL,category};
  console.log(category)
      try {
        const url =  serverUrl+"/api/blog/post"; 
        const response = await axios.post(url,postData,{ headers });
        if(response.status===200)
        {
          alert("Blog added");
          console.log(response.data)
          // navigate("/");
        }
      } catch (error:any) {
        alert(error.response.data.data);
        console.error('Error submitting the blog:', error);
      }
    };
  
  return (
    <div className='dark:bg-gray-950'>

    
    <div className="overflow-x-visible py-10 lg:mx-72 mx-5 dark:bg-gray-950 dark:text-white">
        <h1 className='text-3xl px-4 py-6 font-bold '> Add Blog </h1>
        
              <div className={` mx-3 rounded-md h-44 bg-cover  shadow-lg bg-center flex items-end justify-center`}
                    style={{backgroundImage:`url(${imageUrl})`}}
                >

        { imageUrl==="https://tinyurl.com/2b8um47r" ?  <button
                    className='flex  items-center bg-slate-100 p-1 dark:text-black rounded-md'
                    onClick={()=>{imageInputRef && imageInputRef.current && imageInputRef.current.click()}}>
                        Upload Image&nbsp;<AiOutlineCloudUpload size={20}/> 
                </button> :
                <button
                className='btn-primary1'
                onClick={()=>{imageInputRef && imageInputRef.current && imageInputRef.current.click()}}>
                    Change Image&nbsp;<AiOutlineCloudUpload size={20}/> 
            </button> }
               
                </div>
        <Formik 
            initialValues={initialValues}
            onSubmit= {handleSubmit}
            validationSchema={blogSchema}
        >
        { ({errors,setFieldValue,values})=>(
            <Form className='px-2 h-auto'>
                <div className="input flex flex-col items-start my-3">
                  <label className='text-md' htmlFor="title">Title</label>
                  <Field className=' rounded-md focus:outline-none py-1 outline-none text-2xl w-full dark:bg-gray-950' type="text" name="title" placeholder="Enter Title"/>
                  {errors.title && <small className=' text-red-700 dark:text-red-500'>{errors.title}</small>}
                </div>

                <div className="input flex flex-col items-start my-3 ">
                  {/* <label htmlFor="title">Content</label> */}
                  <Field className='rounded-md py-1  w-full  focus:outline-none dark:bg-gray-950' as="textarea" rows={10} name="content" placeholder="Enter Content"/>
                  {errors.content && <small className=' text-red-700 dark:text-red-500'>{errors.content}</small>}
                </div>


              <div>
              <label htmlFor="category"> Select Category </label><br />
              <Field
                as="select"
                name="category"
                className="border border-gray-300 w-full rounded-md py-2 px-1 my-3 dark:bg-slate-800 dark:border-none outline-none"
              >
                {blogCategories.map((e:string,i:number)=>{
                  return <option key={i} value={e.toLowerCase()}>{e}</option>
                })}
              </Field>
              </div>


              <div className="input flex flex-col items-start w-full my-2  h-auto">

              <label htmlFor="tags my-3">Tags</label>
              <div className="flex items-center space-x-2">
                <Field
                  className="border border-slate-300 rounded-md py-1 px-2 outline-black dark:bg-slate-800 my-3"
                  type="text"
                  name="tagsInput"
                  placeholder="Add Tags"
                  onKeyDown={(e:any) => {
                    if (e.key === 'Enter') {
                        if(values.tagsInput.length<=1) return;
                      e.preventDefault();
                      setFieldValue('tags', [...values.tags, e.target.value]);
                      setFieldValue('tagsInput','')
                      e.target.value = '';
                    }
                  }}
                />
                  <button
                    type="button"
                    disabled={values.tagsInput.length<=1}
                    className=' bg-blue-900 text-white px-2 py-1 rounded-sm'
                    onClick={() => {
                        setFieldValue('tags', [...values.tags, values.tagsInput]);
                        setFieldValue('tagsInput','');
                    }}
                >
                Add Tag
                </button> 

                </div>
                <div className=' flex flex-wrap py-3 '>
                    {values.tags.map((tag,i) => (
                    <div className='flex items-center m-1 rounded-full justify-center tagbox bg-slate-100 px-2 py-1 dark:bg-slate-700' key={i}>
                    {tag}
                     <button  
                        className='mx-1' 
                        type="button" 
                        onClick={()=>{ let newTags = [...values.tags]; newTags.splice(i,1); setFieldValue('tags',newTags) }}>
                    <MdCancel/>
                    </button> 
                </div>
          ))}

         {values.tags.length > 0 && (
          <button type="button" className='' onClick={()=>{ setFieldValue('tags',[]) }} >
            Clear All
          </button>
        )} 
        </div>
        { errors.tags && <small className='text-red'>{errors.tags}</small> }
        </div>

        <input 
            type="file" 
            ref={imageInputRef}
            onChange={handleImageChange} 
            name="image" 
            className='hidden'
          />
          <div className='lg:flex items-center justify-start'>

            <button type="submit" className='w-full lg:w-auto lg:px-10 mr-5 bg-black text-white py-2 border-none my-2 flex items-center justify-center dark:bg-blue-600 ' > Publish </button>
            <button onClick={()=>{navigate("/")}} className='w-full text-black lg:w-auto lg:px-10 bg-slate-100 py-2 my-2'>Cancel</button>
          </div>
            </Form>
        ) }
        </Formik>
    </div>
    </div>
  )
}

export default AddBlog