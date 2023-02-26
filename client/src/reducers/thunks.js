import { addBlog, setBlogs, updateBlog } from "./blogsSlice"
import { addBlogToUser, setUserField, setUsers } from "./usersSlice"
import { setMessage } from "./messageSlice"
import blogsService from "../services/blogs"
import usersService from "../services/users"
import {cloneDeep} from 'lodash' 

export const setNotification = (text) => (dispatch) => {
    dispatch(setMessage(text))
    setTimeout(()=>{
    dispatch(setMessage(null))
    }, 5000)
}

export const createBlog = (title, author, url, userId) => async (dispatch) => {
  const newBlog = await blogsService.create({ title, author, url })
  // newBlog returned from server has 'id' and 'likes' fields too
  dispatch(addBlog(newBlog))
  dispatch(addBlogToUser({newBlog}))
  dispatch(setNotification('New post added'))
}

export const likeBlog = (blog) => async (dispatch, getState) => {
  await blogsService.increaseLike(blog)
  const id = blog.id
  const blogs = getState().blogs
  let theBlog = blogs.find(b => b.id == id)
  theBlog = {...theBlog}
  theBlog.likes++
  dispatch(updateBlog(theBlog))
}


export const initializeBlogs = () => async (dispatch) => {
  try {
    let blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs))
  } catch (error) {
    dispatch(setNotification(error.message))
  }
}

export const deleteBlog = (blog) => async (dispatch, getState) => {
  await blogsService.removeOne(blog.id)
  const blogs = getState().blogs
  dispatch(setBlogs(blogs.filter(b=>b.id != blog.id)))
}


export const initializeUsers = () => async (dispatch) => {
  try {
    let users = await usersService.getAll()
    dispatch(setUsers(users))
  } catch (error) {
    dispatch(setNotification(error.message))
  }
}

export const newComment = (blog, comment) => async (dispatch, getState) => {
  try {
    const commentAndId = await blogsService.addComment(blog.id, comment)
    let theBlog = getState().blogs.find(b=>b.id == blog.id)
    theBlog = cloneDeep(theBlog)
    theBlog.comments.push(commentAndId)
    dispatch(updateBlog(theBlog))
  } catch (error) {
    console.log(error);
    dispatch(setNotification(error.message))
  }
}

export const toggleCommentLike = (blogid, commentid, userid) => async (dispatch, getState) => {
  try {
    await blogsService.toggleCommentLike(blogid, commentid)
    let theBlog = getState().blogs.find(b=>b.id == blogid)
    theBlog = cloneDeep(theBlog)
    const commentInState = theBlog.comments.find(c => c.id == commentid)
    const hasLiked = commentInState.likers.find(uid => uid == userid)
    if(hasLiked) {
      commentInState.likers = commentInState.likers.filter(uid => uid != userid)
    } else {
      commentInState.likers.push(userid)
    }
    dispatch(updateBlog(theBlog))
    dispatch(setNotification(`toggled like from user ${userid} to comment ${commentid} on blog ${blogid}`))
  } catch (error) {
    dispatch(setNotification(error.message))
  }
}