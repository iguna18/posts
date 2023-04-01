import Blog from './Blog'
import { SingleBlog } from './SingleBlog'
import { addComment } from './UserPage'
import '../styles/PopupContent.css'
import CreateNewBlog from './CreateNewBlog'
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go"
import { useSelector } from 'react-redux'
import { useState } from 'react'

//cancel this
export const BlogPopup = (props) => {
  // return (
  //   <Blog {...props}/>
  // )
  return (
    <SingleBlog {...props} addComment={addComment}/>
  )
}

export const AddBlogPopup = (props) => {
  return (
    <CreateNewBlog/>
  )
}

export const UserListPopup = (props) => {
  console.log(props)
  return (
    <div>
      {props.userList.map(u => {
        const imgsrc = u.littleimageinfo ?
        `data:${u.littleimageinfo.mimetype};base64,${u.littleimageinfo.data}`
        : '/logo192.png'
        return (
          <div className='u'>
            <div className='uimgdiv'>
              <img src={imgsrc}/>
            </div>
            <div className='unamediv'>
              <h7>{u.firstname} {u.lastname}</h7>
              <span>@{u.username}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const ImagePopup = (props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  console.log(props)
  const imageinfos = useSelector(state => 
    state.blogs.find(b => b.id == props.blogid).imageinfos)
  console.log(imageinfos.length);
  
  return (
    <div className='outdiv'>
    <div className='ipdiv'>
      <div onClick={()=>{
        if(currentImageIndex == 0) {
          return
        }
        setCurrentImageIndex(currentImageIndex -1)}
      }>
        <GoTriangleLeft className={currentImageIndex==0?'inv':'tri'}/>
      </div>
      <div>
      <img src={`data:${imageinfos[currentImageIndex].mimetype};base64,${imageinfos[currentImageIndex].data}`} 
        alt={imageinfos[currentImageIndex].originalname}/>
      </div>
      <div onClick={()=>{
        if(currentImageIndex == imageinfos.length-1) {
          return
        }
        setCurrentImageIndex(currentImageIndex+1)
      }}>
        <GoTriangleRight className={currentImageIndex==imageinfos.length-1?'inv':'tri'}/>
      </div>
    </div>
    <div className='imgindex'>
      {currentImageIndex + 1}/{imageinfos.length}
    </div>
    </div>
  )
}