import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Link
} from "react-router-dom"
import blogsService from '../services/blogs'
import { deleteBlog, toggleBlogLike } from '../reducers/thunks'
import { useDispatch } from 'react-redux'
import { setpopupContentN, setPopupProps } from "../reducers/popupSlice"
import '../styles/Blog.css'
import { useNavigate } from 'react-router-dom'
import _enum from './enum'
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { BiCommentDots } from "react-icons/bi";

const ImagesSection = ({imageinfos}) => {
  if(!imageinfos || imageinfos.length == 0) {
    return null
  }
  return (
    <div className='imagesection'>
      <div className={imageinfos.length > 1 ? 'imagesectionoverlay' : 'nodisplay'}>
      {imageinfos.length} photos
      </div>
      <img src={`data:${imageinfos[0].mimetype};base64,${imageinfos[0].data}`}
        alt={imageinfos[0].originalname}/>
    </div>
  )
}

const navigateToBlog = (navigate, blogid) => () => {
  navigate(`${blogid}`)
}

const onClickLikes = (dispatch, blogid, likes) => async () => {
  if(likes == 0)
    return
  try {
    let likers = await blogsService.getBlogLikers(blogid)
    dispatch(setpopupContentN(_enum.USER_LIST_POPUP))
    dispatch(setPopupProps({userList:likers}))
  } catch (error) {
    console.log(error)
  }
}

const Blog = ({ blog, blogStyle, isCreatedByCurrentUser, loggedUserId }) => {
  const [isRemoved, setIsRemoved] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div style={isRemoved ? { display:'none' } : blogStyle} className='blogdiv' 
      onClick={navigateToBlog(navigate, blog.id)}>
      <div className='textandimage'>
        <div>
          {blog.text}
        </div>
        <ImagesSection imageinfos={blog.imageinfos}/>
      </div>
      <div className='underbar'>
        <div className='b' onClick={() => dispatch(toggleBlogLike(blog.id))}>
          {
            blog.likers.some(uid => uid == loggedUserId) ?
            <AiFillLike/>
            :
            <AiOutlineLike/>
          }
        </div>
        <div className='b'>
          <BiCommentDots/>
        </div>
      </div>
      <div className='underbar'>
        <div className='b' onClick={onClickLikes(dispatch, blog.id, blog.likes)}>
          {blog.likers.length} like{blog.likers.length > 1 ? 's' : ''}
        </div>
        <div className='b'>
          {blog.comments.length} comment{blog.comments.length > 1 ? 's' : ''}
        </div>
      </div>
      {
        isCreatedByCurrentUser && (
          <p>
            <button onClick={() => dispatch(deleteBlog(blog, setIsRemoved))}>
              remove
            </button>
          </p>
        )
      }

    </div>
  )
}

export default Blog