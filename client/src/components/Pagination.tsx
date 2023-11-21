import React from 'react'
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi'
import { useAppSelector } from '../app/hooks'
type PropsType={
    totalPages:number
    pageNo:number
    setPageNo: React.Dispatch<React.SetStateAction<number>>
}
const Pagination:React.FC<PropsType> = ({totalPages,setPageNo,pageNo}) => {
    const mode = useAppSelector((state)=>{return state.mode.mode});
   
  return (
    
    <div className='pagination-btns flex justify-center py-10 items-center w-full mx-auto  '>
            <button className="bg-slate-200 rounded-full p-2 dark:bg-slate-700" style={pageNo==1?{visibility:"hidden"}:{visibility:"visible"}} onClick={()=>{setPageNo(pageNo-1)}}  ><BiLeftArrowAlt fill={ mode==="dark"? "#fff" : "#000"}/></button>
            {Array.from({length:totalPages}).map((_,i)=>(
                <button
                    key={i}
                    onClick={()=>{setPageNo(i+1)}} 
                    style={pageNo===i+1?{background:"#3498db"}:{}}
                    className='mx-3 flex items-center dark:text-white w-7 h-7 justify-center rounded-full'>
                {i+1}
                </button>))}
                <button className="bg-slate-200 rounded-full p-2 dark:bg-slate-700" style={pageNo==totalPages?{visibility:"hidden"}:{visibility:"visible"}} onClick={()=>{setPageNo(pageNo+1)}}  ><BiRightArrowAlt fill={ mode==="dark"? "#fff" : "#000"}/></button>
        </div>
  )
}

export default Pagination