import { Link } from "react-router-dom"
import { toggleCommentLike } from "../reducers/thunks";
import { useDispatch } from "react-redux";

const Comment = ({comment, loggedUserId, blog, dispatch}) => {
  const blogid = blog.id
  console.log(comment);
  const userLikesComment = comment.likers.find(uid => uid == loggedUserId)
  console.log(comment.likers, loggedUserId, userLikesComment)
  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
        <li key={comment.id}>{comment.text} {comment.id} {comment._id} {comment.creationDate}</li>
        <button style={{fontSize:'0.8em'}} onClick={() => 
          dispatch(toggleCommentLike(blogid, comment.id, loggedUserId))}>
          { userLikesComment ? 'unlike comment' : 'like comment' }
        </button>
      </div>
      <div style={{color:'red',backgroundColor:'green', marginLeft:'30px'}}>
        
        {comment.childCommentIds.map(childId => {
          const childComment = blog.comments.find(c => c.id == childId)
          //checking twice just in case ;)
          if(childComment && childComment.parentCommentId == comment.id) {
            return (
              <Comment key={childId} comment={childComment} loggedUserId={loggedUserId} 
                blog={blog} dispatch={dispatch}/>
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
      <a href={blogToShow.url}>{blogToShow.url}</a>
      <p>{blogToShow.likes} likes</p>
      <p>added by <Link to={`/users/${blogToShow.user_id.id}`}>
        @{blogToShow.user_id.username}</Link></p>
      <button onClick={addLike(blogToShow)}>like</button>
      <h5>comments</h5>
      <form onSubmit={addComment(null)}>
        <input name='inp'></input>
        <button>add comment</button>
      </form>
      <ol style = {{textAlign:'left'}}>
        {
          blogToShow.comments.map(c => {
            if(!c.parentCommentId) { //is a comment, not reply
              return (
                <Comment key={c.id} comment={c} loggedUserId={loggedUserId} 
                  blog={blogToShow} dispatch={dispatch}/>
              )
            }
            return null  
          })
        }
      </ol>
  </div>
  )
}