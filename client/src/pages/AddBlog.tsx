import {useRef,useState} from 'react'
//@ts-ignore
import {blogSchema} from './../utils/validationSchema.js'
import {Formik,Form,Field,useFormikContext} from 'formik'
import {MdCancel} from 'react-icons/md'
import {AiOutlineCloudUpload} from 'react-icons/ai'

import {storage} from '../firebase.ts'
import {StorageReference, getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import axios from 'axios'
import { serverUrl } from '../conf/conf.js'

import { useAppSelector } from '../app/hooks.ts'

type initialValuesType ={
    title:string
    content:string
    imageUrl:string
    tags:string[]
    imageFile: File | null
    tagsInput:string
}
const AddBlog = () => {
    const token = useAppSelector((state)=>{return state.auth.token});
    const [imageUrl, setImageUrl] = useState<string>("https://tinyurl.com/2b8um47r");
    const [image, setImage] = useState<File>();
    const initialValues : initialValuesType = {
        title:"",
        content:"",
        imageUrl:"",
        tags:[],
        tagsInput:"",
        imageFile:null
    }
    const imageInputRef= useRef<HTMLInputElement>(null);
    
    const handleImageChange = (e:any)=>{
        e.preventDefault();
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        console.log(imageUrl)
    }
    
  return (
    <div className="overflow-x-visible">
        <h1 className='text-3xl px-4 py-6 font-bold'> Add Blog </h1>
                <div className={`w-90% h-44 bg-cover  border border-slate-300  bg-center flex items-end justify-center`}
                    style={{backgroundImage:`url(${imageUrl})`}}
                >

        { imageUrl==="https://tinyurl.com/2b8um47r" ?  <button
                    className='btn-primary1'
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
            onSubmit= {async(values)=>{
                const imageRef:StorageReference = ref(storage,`blogs/${Date.now()}`);
                if(!image) return 
                const imageUpload = await uploadBytes(imageRef,image)
                if(imageUpload)
                {
                  const downloadURL = await getDownloadURL(ref(storage,imageUpload.metadata.fullPath))
                  setImageUrl(downloadURL)
                }
                const {title,content,tags,imageUrl} = values;
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`, 
                };
                const postData = {
                    title,
                    content,
                    tags,
                    image:imageUrl
                }
                const data = await axios.post(serverUrl+"/blog/post",postData,{headers})
            }}
            validationSchema={blogSchema}


        >
        { ({errors,setFieldValue,values})=>(
            <Form className='px-2 h-auto '>
                

                <div className="input flex flex-col items-start my-3">
                <label className='text-md' htmlFor="title">Title</label>
                <Field className='border border-slate-300 rounded-md py-1 px-2 outline-none text-2xl w-full' type="text" name="title" placeholder="Enter Title"/>
                {errors.title && <small className=' text-red-700 rounded-md'>{errors.title}</small>}
                </div>

                <div className="input flex flex-col items-start my-3 ">
                <label htmlFor="title">Content</label>
                <Field className='border border-slate-300 rounded-md py-1 px-2 outline-black' as="textarea" cols={40} rows={10} name="content" placeholder="Enter Content"/>
                {errors.content && <small className=' text-red-700  rounded-md'>{errors.content}</small>}
                </div>

            <div className="input flex flex-col items-start  h-auto">
              <label htmlFor="tags">Tags</label>
              <div className="flex items-center space-x-2">
                <Field
                  className="border border-slate-300 rounded-md py-1 px-2 outline-black"
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
                    className='btn-primary1'
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
                    <div className='flex items-center m-1 rounded-full justify-center tagbox bg-slate-100 px-2 py-1' key={i}>
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
            <button type="submit" className='w-full bg-blue-600 text-white py-2  my-4 rounded-lg' >Publish</button>
            </Form>
        ) }
        </Formik>
    </div>
  )
}

export default AddBlog