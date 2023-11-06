type BlogCardProps = {
    title:string,
    content:string,
    image:string,
    likes:number,
    createdAt: string,
}

const BlogCard:React.FC<BlogCardProps> = ({title,content,image,likes,createdAt}) => {
  return (
    <div>

        <img src={image} alt="Blog Image" />
        <h1>{title}</h1>
    
    </div>
  )
}

export default BlogCard