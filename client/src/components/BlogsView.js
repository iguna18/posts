import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import _enum from "./enum"
import { setpopupContentN, setPopupProps } from "../reducers/popupSlice"
import Blog from "./Blog"
import CreateNewBlog from "./CreateNewBlog"
import Togglable from "./Togglable"
import { useNavigate } from 'react-router-dom'
import '../styles/BlogsView.css'

const onClickNewBlog = (dispatch) => () => {
  dispatch(setpopupContentN(_enum.ADD_BLOG_POPUP))
}
const onClickBlog = (navigate, blogid) => () => {
  navigate(`${blogid}`)
}

export const BlogsView = ({blogs, removeBlog, user, addComment, loggedUserId}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const us =
    useSelector(state => state.users.find(u => u.username == user.username))  
  const userid = us.id

  // console.log(blogs[blogs.length-1].user_id.follower_ids)
  // console.log(          blogs
  //   .filter(b => b.user_id.follower_ids.find(fid => fid == userid))
  //   .sort((a, b) => b.likes - a.likes));
  return (
    <div>
      <button onClick={()=>console.log(us)}>aee</button>
      <h3>Blogs</h3>
      <button onClick={onClickNewBlog(dispatch)}>axali blog</button>
      <Togglable buttonLabel='new blog' >
        <CreateNewBlog user={user}/>
      </Togglable>
      <div>
        <button>popularity</button><button>date</button>
      </div>
      {/* <div style={{
        display:'grid'
      }}> */}
      <div className='ulist'>
        {
          blogs
            .filter(b => b.user_id.follower_ids.find(fid => fid == userid))
            .sort((a, b) => b.likes - a.likes)
            .map(blog => {
              return (
                <div key={blog.id} className='blogwrapper' onClick={onClickBlog(navigate, blog.id)}>
                  <Blog blog={blog} addComment={addComment} loggedUserId={loggedUserId}
                    isCreatedByCurrentUser={blog.user_id.username === user.username}/>
                </div>
              )
            })
        }
      {/* </div> */}
      </div>
    </div>
  )
}