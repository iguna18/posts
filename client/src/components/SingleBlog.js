import { Link } from "react-router-dom"

export const SingleBlog = ({blogToShow, addLike, addComment}) => {
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