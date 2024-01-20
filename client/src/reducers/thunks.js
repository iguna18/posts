import { addBlog, setBlogs, updateBlog } from "./blogsSlice"
import { addBlogToUser, addFollow, removeFollow, setUserField, setUsers, updateUser } from "./usersSlice"
import { setMessage } from "./messageSlice"
import blogsService from "../services/blogs"
import usersService from "../services/users"
import {cloneDeep} from 'lodash' 
import { setpopupContentN } from "./popupSlice"
import _enum from "../components/enum"

export const setNotification = (text, noTimeout) => (dispatch) => {
    dispatch(setMessage(text))
    if(noTimeout) return

    setTimeout(()=>{
    dispatch(setMessage(null))
    }, 5000)
}

export const createBlog = (blog, formdataWithFiles) => async (dispatch) => {
  dispatch(setNotification('WAIT'), true)
  try {
    let newBlog = await blogsService.create(blog)
    newBlog = await blogsService.addFiles(newBlog.id, formdataWithFiles)
    dispatch(addBlog(newBlog))
    dispatch(addBlogToUser({newBlog}))
    dispatch(setNotification('New post added'))
    dispatch(setpopupContentN(_enum.NO_POPUP))
  } catch (error) {
    console.log(error);
    dispatch(setNotification(error.message))
  }
}

export const toggleBlogLike = (blogid) => async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
  try {
    await blogsService.toggleLike(blogid)
    const loggedusername = getState().user.username
    const loggeduserid = getState().users.find(u => u.username == loggedusername).id
    const blogs = getState().blogs
    let theBlog = blogs.find(b => b.id == blogid)
    theBlog = cloneDeep(theBlog)
    const hasLiked = theBlog.likers.find(uid => uid == loggeduserid)
    if(hasLiked) {
      theBlog.likers = theBlog.likers.filter(uid => uid != loggeduserid)
    } else {
      theBlog.likers.push(loggeduserid)
    }
    dispatch(updateBlog(theBlog))
    dispatch(setNotification(`toggled like for blog: "${theBlog.text}"`))
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message)) 
  }
}

export const initializeBlogs = () => async (dispatch) => {
  dispatch(setNotification('WAIT'), true)
  try {
    let blogs = await blogsService.getAll()
    console.log('zhig', blogs[0]);
    dispatch(setBlogs(blogs))
    dispatch(setNotification(null), true)
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message))
  }
}

export const deleteBlog = (blog) => async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
  try {
    await blogsService.removeOne(blog.id)
    const blogs = getState().blogs
    dispatch(setBlogs(blogs.filter(b=>b.id != blog.id)))
    dispatch(setNotification(`removed blog: ${blog.text}`))
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message))
  }
}


export const initializeUsers = () => async (dispatch) => {
  dispatch(setNotification('WAIT'), true)
  try {
    let users = await usersService.getAll()
    dispatch(setUsers(users))
    dispatch(setNotification(null), true)
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message))
  }
}

export const newComment = (blog, comment, parentCommentId) => async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
  try {
    //{text,id,creationDate,parentCommentId}
    const commentObj = await blogsService.addComment(blog.id, comment, parentCommentId)
    let theBlog = getState().blogs.find(b=>b.id == blog.id)
    theBlog = cloneDeep(theBlog)
    theBlog.comments.push(commentObj)
    if(parentCommentId) {
      theBlog.comments.find(c => c.id == parentCommentId).childCommentIds.push(commentObj.id)
    }
    dispatch(updateBlog(theBlog))
    dispatch(setNotification(`added comment "${comment}" to blog: ${blog.text}`))
  } catch (error) {
    console.log(error);
    dispatch(setNotification(error.message))
  }
}

export const toggleCommentLike = (blogid, commentid, userid) => async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
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
    console.log(error)
    dispatch(setNotification(error.message))
  }
}

export const toggleFollow = (fromid, toid, followState) =>  async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
  const s = followState ? 'unfollowed' : 'followed'
  try {
    if(!followState) {
      await usersService.addFollow(fromid, toid)
      dispatch(addFollow({fromid, toid}))
    } else {
      await usersService.removeFollow(fromid, toid)
      dispatch(removeFollow({fromid, toid}))
    }
    dispatch(setNotification(`${s} toid`))
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message))
  }
}

export const uploadPfp = (userid, formdataWithFile) => async (dispatch, getState) => {
  dispatch(setNotification('WAIT'), true)
  try {
    const updatedUser = await usersService.uploadPfp(userid, formdataWithFile)
    dispatch(updateUser(updatedUser))
    dispatch(setNotification(`updated pfp for user ${userid}`))
  } catch (error) {
    console.log(error)
    dispatch(setNotification(error.message))
  }
}

