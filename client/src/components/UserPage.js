import { useEffect } from 'react'
import Message from './Message'
import { useSelector, useDispatch } from 'react-redux'
import {likeBlog, setNotification, deleteBlog,initializeBlogs, initializeUsers, newComment} from '../reducers/thunks'
import { setUser } from '../reducers/userSlice'
import {
  Routes, Route, Link, useMatch 
} from "react-router-dom"
import { UsersView } from './UsersView'
import { BlogsView } from './BlogsView'
import { SingleBlog } from './SingleBlog'
import { SingleUser } from './SingleUser'
import styled from 'styled-components'

const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Div = styled.div`
  /* row-gap:0px;
  display: flex;
  flex-direction: column;
  background-color: red; */
`

const UserPage = () => {
  const dispatch = useDispatch()
  
  const users = useSelector(state => state.users)
  useEffect(()=>{
    dispatch(initializeUsers())
  },[])

  const user = useSelector(state => state.user)
  const loggedUserId = useSelector(state => {
    const userObj = state.users.find(u => u.username == user.username)
    if(userObj) return userObj.id
  })
  
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

  const addComment = (parentCommentId) => (e) => {
    e.preventDefault()
    const c = e.target.inp.value
    dispatch(newComment(blogToShow, c, parentCommentId))
    dispatch(setNotification(`added comment ${c} to blog ${blogToShow.title}`))
  }

  
  let match = useMatch('/users/:id')
  const userToShow = match ? users.find(u => u.id === match.params.id) : null
  match = useMatch('/blogs/:id')
  const blogToShow = match ? blogs.find(b => b.id === match.params.id) : null

  // we want to sort the array for the view so we copy it due to its immutability
  let blogsCopy = [...blogs]
  return (
    <Div>
      <Message/>
      <Navigation>
        <div>
          <Link style={{marginRight:'5px'}} to='/blogs'>blogs</Link>
          <Link to='/users'>users </Link> 
        </div>
        <div>
          <span>{user.name} </span>
          <img src='/logo192.png' style={{height:'10%'}}/>
          <button onClick = {onLogOut}>log out</button>        
        </div>
      </Navigation>
      <Routes>
        <Route path='/blogs' element={ // blogs view
          <BlogsView addLike={addLike} removeBlog={removeBlog} blogsCopy={blogsCopy}
            user = {user}/>
        } />
        <Route path='/users' element={ // users view
          <UsersView users={users}/>
        } />
        <Route path='/users/:id' element={
          <SingleUser userToShow={userToShow} loggedUserId={loggedUserId}/>
        }/>
        <Route path='/blogs/:id' element={
          <SingleBlog blogToShow={blogToShow} addLike={addLike} addComment={addComment}
            loggedUserId={loggedUserId}/>
        }/>
      </Routes>

    </Div>
  )
}
export default UserPage