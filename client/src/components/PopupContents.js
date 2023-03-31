import Blog from './Blog'
import { SingleBlog } from './SingleBlog'
import { addComment } from './UserPage'
import '../styles/PopupContent.css'
import CreateNewBlog from './CreateNewBlog'
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go"
import { useSelector } from 'react-redux'

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
  console.log(props)
  const imageinfos = useSelector(state => state.blogs[props.blogindex].imageinfos)
  return (
    <div className='ipdiv'>
      <div className='arrowdiv'><GoTriangleLeft/></div>
      <div>

      </div>
      <div className='arrowdiv'><GoTriangleRight/></div>
    </div>
  )
}