import { Grid } from "@mui/material"
import { Card } from "react-bootstrap"
import Blog from "./Blog"
import CreateNewBlog from "./CreateNewBlog"
import Togglable from "./Togglable"

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export const BlogsView = ({blogs, removeBlog, user}) => {
  // const file = blogs.find(b => b.id =='64062b19943fa4a7b89fd53a').imageinfos[0]
  return (
    <div>
      <h3>Blogs</h3>
      <Togglable buttonLabel='new blog' >
        <CreateNewBlog user={user}/>
      </Togglable>
      {/* <div style={{
        display:'grid'
      }}> */}
      <Grid container>
        {
          blogs
            .filter(()=>true)
            .sort((a, b) => b.likes - a.likes)
            .map(blog => {
              return (
                <Blog key={blog.id} 
                  blog={blog} blogStyle={blogStyle}
                  isCreatedByCurrentUser={blog.user_id.username === user.username}/>
              )
            })
        }
      {/* </div> */}
      </Grid>
    </div>
  )
}