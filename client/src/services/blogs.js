import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${ newToken }`
}

const getAll = async () => {
  return (
    axios
      .get(baseUrl)
      .then(response => response.data)
  )
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization:token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const increaseLike = async (blog) => {
  const config = {
    headers: { Authorization:token }
  }
  const newBlog = { ...blog }
  newBlog.likes = (blog.likes || 0) + 1
  newBlog.user_id = blog.user_id.id
  const res = await axios.put(baseUrl + `/${ newBlog.id }`, newBlog, config)
  return res.data
}

const removeOne = (blog_id) => {
  const config = {
    headers: { Authorization:token }
  }
  return (
    axios
      .delete(baseUrl+'/'+blog_id, config)
      .then(response => response.data)
  )
}

const addComment = (blog_id, comment) => {
  const config = {
    headers: { Authorization:token }
  }
  return (
    axios
      .post(`${baseUrl}/${blog_id}/comments`, {comment:comment}, config)
      .then(response => response.data)
  )
}

export default { getAll, create, setToken, increaseLike, removeOne, addComment}