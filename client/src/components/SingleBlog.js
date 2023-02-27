import { Link } from "react-router-dom"
import { toggleCommentLike } from "../reducers/thunks";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { updateBlog } from "../reducers/blogsSlice";

const Undercomment = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  padding:0px 100px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  span{
    cursor: pointer;
  }
`
//in react i have Blog component which renders 5 Comment component. Comment component is recursive, it may on its own render other comment components inside itself. Let's take a certain Comment component rendered by Blog. It also has a button which when clicked should increase a number state stored in redux. This number state determines how many Comment components should our chosen Comment component render. Problem is, though the button click correctly  increases the number state in redux, the number of our chosen Comment's rendered Comment components doesn't change.

const Comment = ({comment, loggedUserId, blog, dispatch, addComment}) => {
  const onClickLikes = () => {}
  const [replyInputVisible, setReplyInputVisible] = useState(false)
  const blogid = blog.id
  const userLikesComment = comment.likers.find(uid => uid == loggedUserId)
  const likesNumber = comment.likers.length
  return (
    <div>
      <div>
        <div style={{display:'flex', flexDirection:'row'}}>
          <li key={comment.id}>{comment.text} </li>{/*{comment.id} {comment._id}</li>*/}
        </div>
        <Undercomment>
          <span onClick={() => {
            setReplyInputVisible(!replyInputVisible)
          }}>reply</span>
          <span onClick={() => 
            dispatch(toggleCommentLike(blogid, comment.id, loggedUserId))}>
            { userLikesComment ? 'unlike' : 'like' } 
          </span>
          <span onClick={onClickLikes}>{likesNumber} likes</span>
          <span>{new Date(comment.creationDate).toLocaleString('en-UK')}</span>
        </Undercomment>
      </div>
      <div style={{marginLeft:'40px'}}>
        { replyInputVisible &&
          <form onSubmit={addComment(comment.id)}>
            <input name='inp'></input>
            <button>add comment</button>
          </form>
        }

        {blog.comments.find(c=>c.id==comment.id).childCommentIds.map(childId => {
          const childComment = blog.comments.find(c => c.id == childId)
          //checking twice just in case ;)
          if(childComment && childComment.parentCommentId == comment.id) {
            return (
              <Comment key={childId} comment={childComment} loggedUserId={loggedUserId} 
                blog={blog} dispatch={dispatch} addComment={addComment}/>
              )
            }
            return null
        })}
      </div>
    </div>
  )
}

export const SingleBlog = ({blogToShow, addLike, addComment, loggedUserId}) => {
  const dispatch = useDispatch()
  if(!blogToShow)
    return (
      <div></div>
    )
  return (
    <div>
      <h3>{blogToShow.title}</h3>
      <p>
        {blogToShow.text}
      </p>
      <p>{blogToShow.likes} likes</p>
      <p>added by <Link to={`/users/${blogToShow.user_id.id}`}>
        @{blogToShow.user_id.username}</Link></p>
      <button onClick={addLike(blogToShow)}>like</button>
      <h5>comments</h5>
      <form onSubmit={addComment(null)}>
        <input name='inp'></input>
        <button>add comment</button>
      </form>
      <ul style = {{textAlign:'left', listStyleType:'none'}}>
        {
          blogToShow.comments.map(c => {
            if(!c.parentCommentId) { //is a comment, not reply
              return (
                <Comment key={c.id} comment={c} loggedUserId={loggedUserId} 
                  blog={blogToShow} dispatch={dispatch} addComment={addComment}/>
              )
            }
            return null  
          })
        }
      </ul>
  </div>
  )
}