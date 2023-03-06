import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Link
} from "react-router-dom"
import { deleteBlog, toggleBlogLike } from '../reducers/thunks'
import { useDispatch } from 'react-redux'
const Blog = ({ blog, blogStyle, isCreatedByCurrentUser }) => {
  const [visible, setVisible] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)
  const dispatch = useDispatch()

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <li style={isRemoved ? { display:'none' } : blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      <button id='viewbutton' onClick={toggleVisible}>{visible?'hide':'view'}</button>
      {
        visible && (
          <>
            <p>{blog.url}</p>
            <p>
              {blog.likes}
              <button id='likebutton' onClick={() => dispatch(toggleBlogLike(blog.id))}>like</button>
            </p>
            {
              isCreatedByCurrentUser && (
                <p>
                  <button onClick={() => dispatch(deleteBlog(blog, setIsRemoved))}>
                    remove
                  </button>
                </p>
              )
            }
          </>
        )
      }
    </li>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogStyle: PropTypes.object,
  isCreatedByCurrentUser: PropTypes.bool.isRequired
}

export default Blog