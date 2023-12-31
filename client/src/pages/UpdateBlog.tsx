import {useRef,useState,useEffect} from 'react'
//@ts-ignore
import {blogSchema} from '../utils/validationSchema.js'
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
import { useParams } from 'react-router-dom'

import { Toaster,toast } from 'react-hot-toast'

type initialValuesType ={
    title:string
    content:string
    imageUrl:string
    tags:string[]
    imageFile: File | null
    tagsInput:string,
    category:string
}

const UpdateBlog = () => {

  const {blogId} = useParams();
  const token = useAppSelector((state)=>{return state.auth.token});
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [image, setImage] = useState<File|null>(null);
  const [title,setTitle] = useState<string>("");
  const [content,setContent] = useState<string>("");
  const [category,setCategory] = useState<string>("");
  const [tags,setTags] = useState<string[]>([]);
  
  const imageInputRef= useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [loading,setLoading] = useState<boolean>(false);
  const [updated,setUpdated] = useState<boolean>(false);

  const fetchBlog = async()=>{
    try {
      const url =  serverUrl+"/api/blog/"+blogId; 
      const response = await axios.get(url);
      if(response.status===200)
      {
          const {title,content,image,tags,category} = response.data.data;
          setTitle(title);
          setContent(content);
          setImageUrl(image);
          setTags(tags);
          setCategory(category);
      }
    } catch (error:any) {
      alert(error.response.data.data);
      console.error('Error submitting the blog:', error);
    }
  }
  useEffect(() => {
      fetchBlog()
    
  }, [])
  const initialValues : initialValuesType = {
    title,
    content,
    imageUrl,
    tags,
    tagsInput:"",
    category,
    imageFile:null,
  }
 
    const handleImageChange = (e:any)=>{
        e.preventDefault();
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  
    const handleSubmit = async (values:any) => {
      setLoading(true);
      toast.loading("Updating...");
      let downloadURL:string = ""
      if (image) {
        const imageRef = ref(storage, `blogs/${Date.now()}`);
        const imageUpload = await uploadBytes(imageRef, image);
        if (imageUpload)
           downloadURL = await getDownloadURL(ref(storage, imageUpload.metadata.fullPath));
        else{
          toast.error("Image Uploading failed");
          return;
        }
      }
      else{
        downloadURL= imageUrl
      }

      const { title, content, tags,category } = values;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      };
      
  
      const postData = {title,content,tags,image: downloadURL,category};
      try {
        const url =  serverUrl+"/api/blog/update/"+blogId; 
        const response = await axios.put(url,postData,{ headers });
        toast.dismiss();
        if(response.status===200)
        {
          toast.success("Blog Updated!");
          setLoading(false);
          setUpdated(true);
        }
      } catch (error:any) {
        toast.error(error.response.data.data);
        setLoading(false);
      }
    };
  
  return (
    <div className="overflow-x-visible dark:bg-gray-950 dark:text-white lg:px-72 py-10">
      <Toaster/>
        <h1 className='text-3xl px-4 py-6 font-bold'> 
          Update Blog 
        </h1>
        <div 
          className={` mx-3 rounded-md h-44 bg-cover  shadow-lg bg-center flex items-end lg:h-64 justify-center`}
          style={{backgroundImage:`url(${imageUrl})`}}
        >

        { imageUrl==="https://tinyurl.com/2b8um47r" ?  <button
                    className='flex  items-center bg-slate-100 p-1 rounded-md'
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
            enableReinitialize={true}
            onSubmit= {handleSubmit}
            validationSchema={blogSchema}
        >
        { ({errors,setFieldValue,values})=>(
            <Form className='px-2 h-auto '>
                <div className="input flex flex-col items-start my-3">
                  <label className='text-md' htmlFor="title">Title</label>
                  <Field 
                  value={values.title} 
                  className=' rounded-md focus:outline-none py-1 outline-none text-2xl w-full dark:bg-slate-800' 
                  type="text" name="title" placeholder="Enter Title"/>
                  {errors.title && <small className=' text-red-700 rounded-md'>{errors.title}</small>}
                </div>

                <div className="input flex flex-col items-start my-3 ">
                  <Field 
                  className='rounded-md py-1 w-full h-auto  focus:outline-none dark:bg-slate-800' as="textarea" cols={40} rows={7} name="content" placeholder="Enter Content"/>
                  <span className='text-sm' style={values.content.length>360?{color:"red"}:{color:"green"}}> { values.content.length } / 360 </span>
                  {errors.content && <small className=' text-red-700  rounded-md'>{errors.content}</small>}
                </div>


              <div>
              <label htmlFor="category"> Select Category </label><br />
              <Field
                as="select"
                name="category"
                className="border border-gray-300 w-full rounded-md p-1 dark:bg-slate-800 py-2 dark:border-none"
              >
                {blogCategories.map((e:string,i:number)=>{
                  return <option key={i} value={e.toLowerCase()}>{e}</option>
                })}
              </Field>
              </div>


              <div className="input flex flex-col items-start w-full my-2  h-auto">

              <label htmlFor="tags">Tags</label>
              <div className="flex items-center space-x-2 my-2">
                <Field
                  className="border border-slate-300 rounded-md py-1 px-2 outline-black dark:bg-slate-800 dark:border-slate-900"
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
                <div className=' flex flex-wrap '>
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
          <div className='lg:flex lg:space-x-1'>
            {
               updated? <button
               type='button' onClick={()=>{navigate("/blog/"+blogId)}} className='w-full lg:w-auto lg:px-10 mr-5 bg-black text-white py-2 border-none my-2 flex items-center justify-center dark:bg-blue-600 '>Preview Blog</button>:
               <>
                 <button 
            type="submit" 
            disabled={loading}
            className='w-full rounded-md bg-black text-white py-2 border-none my-2 flex items-center justify-center dark:bg-blue-500 dark:text-black ' 
            > {loading?"Updating...":"Update"} </button>
            <button 
              disabled={loading}
            onClick={()=>{navigate("/blog/"+blogId)}} className='w-full rounded-md bg-slate-100 py-2 my-2 dark:text-black dark:bg-slate-100'>Cancel</button>
               </>
            }
          
          </div>
            </Form>
        ) }
        </Formik>
    </div>
  )
}

export default UpdateBlog
