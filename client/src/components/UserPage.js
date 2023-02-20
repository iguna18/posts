import { useEffect } from 'react'
import Blog from './Blog'
import CreateNewBlog from './CreateNewBlog'
import Message from './Message'
import Togglable from './Togglable'
import { useSelector, useDispatch } from 'react-redux'
import {likeBlog, setNotification, deleteBlog,initializeBlogs, initializeUsers, newComment} from '../reducers/thunks'
import { setUser } from '../reducers/userSlice'
import {
  Routes, Route, Link, useMatch 
} from "react-router-dom"
import { Table } from 'react-bootstrap'

const SingleUser = ({userToShow}) => {
  if(!userToShow)
    return (
      <div></div>
    )
  return (
    <div>
      <h3><span style={{fontSize:'0.7em', fontStyle: 'italic'}}>user: </span>{userToShow.name}</h3>
      <h3><span style={{fontSize:'0.7em', fontStyle: 'italic'}}>added blogs:</span></h3>
      <ul>
      {
        userToShow.blog_ids.map(b => {
          return (
            <li key = {b.id}>
              {b.title}
            </li>
          )
        })
      }
      </ul>
  </div>
  )
}

const SingleBlog = ({blogToShow, addLike, addComment}) => {
  if(!blogToShow)
    return (
      <div></div>
    )
  return (
    <div>
      <h3>{blogToShow.title}</h3>
      <a href={blogToShow.url}>{blogToShow.url}</a>
      <p>{blogToShow.likes} likes</p>
      <p>added by @{blogToShow.user_id.username}</p>
      <button onClick={addLike(blogToShow)}>like</button>
      <h5>comments</h5>
      <form onSubmit={addComment}>
        <input name='inp'></input>
        <button>add comment</button>
      </form>
      <ul style = {{textAlign:'left'}}>
        {
          blogToShow.comments.map(c => {
            return <li key={c.id}>{c.text}</li>
          })
        }
      </ul>
  </div>
  )
}

const UserPage = () => {
  const dispatch = useDispatch()
  
  const users = useSelector(state => state.users)
  useEffect(()=>{
    dispatch(initializeUsers())
  },[])

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  useEffect(()=>{
      dispatch(initializeBlogs())
  }, [])

  const onLogOut = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addLike = (blog) => () => {
    try {
      dispatch(likeBlog(blog))
      dispatch(setNotification(`added like to ${blog.title} by ${blog.author}`))
    } catch (error) {
      dispatch(setNotification(error.message))
    } 
  }

  const removeBlog = (blog, setIsRemoved) => async () => {
    try {
      dispatch(deleteBlog(blog))
      dispatch(setNotification(`removed ${blog.title} by ${blog.author}`))
    } catch (error) {
      dispatch(setNotification(error.message))
    } 
  }

  const addComment = (e) => {
    e.preventDefault()
    const c = e.target.inp.value
    dispatch(newComment(blogToShow, c))
    dispatch(setNotification(`added comment ${c} to blog ${blogToShow.title}`))
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  let match = useMatch('/users/:id')
  const userToShow = match ? users.find(u => u.id === match.params.id) : null
  match = useMatch('/blogs/:id')
  const blogToShow = match ? blogs.find(b => b.id === match.params.id) : null

  // we want to sort the array for the view so we copy it due to its immutability
  let blogsCopy = [...blogs]
  return (
    <div >
      <div style={{backgroundColor:'red', color:'green'}}>
        <h2 >blog app</h2>
      </div>
      <nav>
        <Link style={{marginRight:'5px'}} to='/blogs'>blogs</Link>
        <Link to='/users'>users </Link> <br/>
        <span style={{fontSize:'0.9em', fontStyle: 'italic'}}>currently logged in user: </span>{user.name}
        <button onClick = {onLogOut}>log out</button>        
      </nav>
        <Message/>
      <Routes>
        <Route path='/blogs' element={ // blogs view
          <div>
            <h3>Blogs</h3>
            <Togglable buttonLabel='new blog' >
              <CreateNewBlog />
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
                        isCreatedByCurrentUser={blog.user_id.username === user.username}/>
                    )
                  })
              }
            </ul>
          </div>
        } />
        <Route path='/users' element={ // users view
          <div>
            <h3>Users</h3>
            <Table striped>
              <thead>
                <tr>
                  <th> </th>
                  <th>blogs created</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map(u => {
                    return (
                      <tr key={u.id}>
                        <td>
                          <Link to={`/users/${u.id}`}>{u.name}</Link>
                        </td>
                        <td>
                          {u.blog_ids.length}
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
        } />
        <Route path='/users/:id' element={
          <SingleUser userToShow={userToShow}/>
        }/>
        <Route path='/blogs/:id' element={
          <SingleBlog blogToShow={blogToShow} addLike={addLike} addComment={addComment}/>
        }/>
      </Routes>

    </div>
  )
}
export default UserPage