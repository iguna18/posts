const blog = require('../models/blog')

const initialBlogs = [  
  {title: 'rvauli', author: 'kote', url: 'www.kotesblog.com/rvauli', likes:14},
  {title: 'kaxelebi', author: 'daur bigvava', url: 'www.tarielovich.com/kaxelebi', likes:2}
]

const nonExistingId = async () => {
  const blog = new blog({ title: 'cignebis sakitxi', author: 'manul', url: 'www.manulsblog.com/ziganer', likes:5 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}