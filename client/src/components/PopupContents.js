import React from 'react'
import Blog from './Blog'
import { SingleBlog } from './SingleBlog'
import { addComment } from './UserPage'
import '../styles/PopupContent.css'
import CreateNewBlog from './CreateNewBlog'
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go"
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

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

  const prevImg = ()=>{
    if(currentImageIndex == 0) {
      return
    }
    setCurrentImageIndex(currentImageIndex-1)
  }
  const nextImg = ()=>{
    if(currentImageIndex == imageinfos.length-1) {
      return
    }
    setCurrentImageIndex(currentImageIndex+1)
  }

  useEffect(() => {
    const handleArrows = (event) => {
      if (event.key === 'ArrowLeft') {
        console.log('left')
        prevImg()
      } else if (event.key === 'ArrowRight') {
        console.log('right')
        nextImg()
      }
    }
    
    document.addEventListener('keydown', handleArrows)
    return () => {
      document.removeEventListener('keydown', handleArrows)
    };
  }, []);

  const imageinfos = useSelector(state => 
    state.blogs.find(b => b.id == props.blogid).imageinfos)
  
  return (
    <div className='outdiv'>
    <div className='ipdiv'>
      <div onClick={prevImg}>
        <GoTriangleLeft className={currentImageIndex==0?'inv':'tri'}/>
      </div>
      <div>
      <img src={`data:${imageinfos[currentImageIndex].mimetype};base64,${imageinfos[currentImageIndex].data}`} 
        alt={imageinfos[currentImageIndex].originalname}/>
      </div>
      <div onClick={nextImg}>
        <GoTriangleRight className={currentImageIndex==imageinfos.length-1?'inv':'tri'}/>
      </div>
    </div>
    <div className='imgindex'>
      {currentImageIndex + 1}/{imageinfos.length}
    </div>
    </div>
  )
}