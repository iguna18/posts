import Blog from './Blog'
import { SingleBlog } from './SingleBlog'
import { addComment } from './UserPage'

export const BlogPopup = (props) => {
  // return (
  //   <Blog {...props}/>
  // )
  return (
    <SingleBlog {...props} addComment={addComment}/>
  )
}

export const AddBlogPopup = (props) => {
  return (
    <div>
      ZD
    </div>
  )
}


