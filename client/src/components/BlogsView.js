import { Grid } from "@mui/material"
import './styles/BlogsView.css'
import { useSelector, useDispatch } from "react-redux"
import _enum from "./enum"
import { setpopupContentN, setPopupProps } from "../reducers/popupSlice"
import Blog from "./Blog"
import CreateNewBlog from "./CreateNewBlog"
import Togglable from "./Togglable"


export const BlogsView = ({blogs, removeBlog, user, addComment, loggedUserId}) => {
  const dispatch = useDispatch()
  const us =
    useSelector(state => state.users.find(u => u.username == user.username))  
  const userid = us.id

  console.log(blogs[blogs.length-1].user_id.follower_ids)
  // console.log(          blogs
  //   .filter(b => b.user_id.follower_ids.find(fid => fid == userid))
  //   .sort((a, b) => b.likes - a.likes));
  return (
    <div>
      <button onClick={()=>console.log(us)}>aee</button>
      <h3>Blogs</h3>
      <button onClick={()=>{
        
      }}>axali blog</button>
      <Togglable buttonLabel='new blog' >
        <CreateNewBlog user={user}/>
      </Togglable>
      <div>
        <button>popularity</button><button>date</button>
      </div>
      {/* <div style={{
        display:'grid'
      }}> */}
      <Grid container>
        {
          blogs
            .filter(b => b.user_id.follower_ids.find(fid => fid == userid))
            .sort((a, b) => b.likes - a.likes)
            .map(blog => {
              console.log('yleo');
              return (
                // <div key={blog.id} className='blogwrapper'>
                  <Blog blog={blog} key={blog.id} addComment={addComment} loggedUserId={loggedUserId}
                    isCreatedByCurrentUser={blog.user_id.username === user.username}/>
                // </div>
              )
            })
        }
      {/* </div> */}
      </Grid>
    </div>
  )
}