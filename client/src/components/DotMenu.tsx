import React, {Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {BsThreeDotsVertical } from 'react-icons/bs'
import {AiFillEdit,AiFillDelete} from 'react-icons/ai'
import { BiShare } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

type MenuProps ={
    ownBlog:boolean
    blogId:string
    setShowModal:Dispatch<SetStateAction<boolean>>
}

const DotMenu: React.FC<MenuProps>= ({ownBlog,blogId,setShowModal}) => {
    const navigate = useNavigate();
    const [isFrameVisible, setFrameVisible] = useState(false);
    
    const showFrame = () => {
        setFrameVisible(true);
    };
    const hideFrame = () => {
        setFrameVisible(false);
    };
    const frameRef = useRef<any>();
    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if(!frameRef) return;
        if (frameRef.current && !frameRef.current.contains(event.target)) {
            hideFrame();
        }
        };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="place-items-center relative">
      <button onClick={isFrameVisible ? hideFrame : showFrame}>
        <BsThreeDotsVertical size={30} />
      </button>
      <div
        ref={frameRef}
        style={{ visibility: isFrameVisible ? 'visible' : 'hidden' }}
        className="absolute flex flex-col mt-2 ml-[-100px] border-10 p-2 px-4 rounded-lg border-black bg-slate-100"
        id="frame1"
      >
        {
            ownBlog?
            <>
       <div className="info my-1">
            <button className='flex items-center' onClick={()=>{ navigate("/blog/update/"+blogId) }}>  <AiFillEdit/>&nbsp; Edit   </button>
        </div>
        <div className="info my-1">
            <button className='flex items-center' onClick={()=>{setShowModal(true)}}><AiFillDelete/> &nbsp; Delete</button>
        </div>
            </>:<></>
        }
        <div className="info my-1">
            <button className='flex items-center'>   <BiShare/>&nbsp; Share  </button>
        </div>

      </div>
    </div>
  );

};

export default DotMenu;
