import { useEffect } from 'react'
import Popup from './Popup'
import { useSelector, useDispatch } from 'react-redux'
import {toggleBlogLike, setNotification, deleteBlog,initializeBlogs, initializeUsers, newComment} from '../reducers/thunks'
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
export const addComment = (parentCommentId, blog, dispatch) => (e) => {
  e.preventDefault()
  const c = e.target.inp.value
  dispatch(newComment(blog, c, parentCommentId))
}

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
  
  let match = useMatch('/users/:id')
  const userToShow = match ? users.find(u => u.id === match.params.id) : null
  match = useMatch('/blogs/:id')
  const blogToShow = match ? blogs.find(b => b.id === match.params.id) : null
  


  return (
    <Div>
      <Popup/>
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
        <BlogsView blogs={blogs} user = {user}
          addComment={addComment}
          loggedUserId={loggedUserId}
          />
        } />
        <Route path='/users' element={ // users view
          <UsersView users={users}/>
        } />
        <Route path='/users/:id' element={
          <SingleUser userToShow={userToShow} loggedUserId={loggedUserId}/>
        }/>
        <Route path='/blogs/:id' element={
          <SingleBlog blogToShow={blogToShow} addComment={addComment}
            loggedUserId={loggedUserId}/>
        }/>
      </Routes>

    </Div>
  )
}
export default UserPage