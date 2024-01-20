import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import _enum from "./enum"
import { setpopupContentN, setPopupProps } from "../reducers/popupSlice"
import Blog from "./Blog"
import CreateNewBlog from "./CreateNewBlog"
import Togglable from "./Togglable"
import '../styles/BlogsView.css'

const onClickNewBlog = (dispatch) => () => {
  dispatch(setpopupContentN(_enum.ADD_BLOG_POPUP))
}

export const BlogsView = ({blogs, removeBlog, user, addComment, loggedUserId}) => {
  const dispatch = useDispatch()
  // const us =
  //   useSelector(state => state.users.find(u => u.username == user.username))  
  // const userid = us.id

  return (
    <div>
      <h3>Blogs</h3>
      <button onClick={onClickNewBlog(dispatch)}>axali blog</button>
      <Togglable buttonLabel='new blog' >
        <CreateNewBlog user={user}/>
      </Togglable>
      <div>
        <button>popularity</button><button>date</button>
      </div>

      <div className='ulist'>
        {
          blogs
            .filter(b => b.user_id.follower_ids.find(fid => fid == loggedUserId))
            .sort((a, b) => b.likes - a.likes)
            .map(blog => {
              return (
                <Blog key={blog.id} blog={blog} addComment={addComment} loggedUserId={loggedUserId}
                  isCreatedByCurrentUser={blog.user_id.username == user.username}/>
              )
            })
        }
      </div>
    </div>
  )
}