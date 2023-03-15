import { Grid } from "@mui/material"
import './styles/BlogsView.css'
import { useSelector } from "react-redux"
import Blog from "./Blog"
import CreateNewBlog from "./CreateNewBlog"
import Togglable from "./Togglable"


export const BlogsView = ({blogs, removeBlog, user}) => {
  const userid =
    useSelector(state => state.users.find(u => u.username == user.username)).id
  return (
    <div>
      <h3>Blogs</h3>
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
              return (
                // <div key={blog.id} className='blogwrapper'>
                  <Blog blog={blog}
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