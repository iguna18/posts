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

export const BlogsView = ({blogsCopy, addLike,removeBlog, user}) => {
  return (
    <div>
      <h3>Blogs</h3>
      <Togglable buttonLabel='new blog' >
        <CreateNewBlog user={user}/>
      </Togglable>
      <ul>
        {
          blogsCopy
            .sort((a, b) => b.likes - a.likes)
            .map(blog => {
              return (
                <Blog key={blog.id} 
                  blog={blog} blogStyle={blogStyle}
                  addLike={addLike} removeBlog={removeBlog}
                  isCreatedByCurrentUser={blog.user_id.username === user.name}/>
              )
            })
        }
      </ul>
    </div>
  )
}