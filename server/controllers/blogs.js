const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user_id')
  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  request.body.user_id = request.user_id
  if(!request.body.title && !request.body.url) {
    response.status(400).end()
    return
  }
  const user = await User.findById(request.body.user_id)
  if(!user) {
    return response.status(401).end({error:"token in correct format but the passed id deosnt belong to any user (expired token?)"})
  }
  console.log('eger',request.body);
  if(!request.body.comments)
    request.body.comments = []
  
  const blog = new Blog(request.body)
  const saved = await blog.save()

  if(!user.blog_ids) //in case the document is not in the format described in the scheme
    user.blog_ids = []
  
  user.blog_ids = user.blog_ids.concat(saved.id)
  await user.save()

  const result = await Blog.findById(saved.id).populate('user_id')
  response.status(201).json(result)
})
 

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if(!blog) 
    return response.status(404).send({error:"nothing to delete"})
  

  if (blog.user_id.toString() != request.user_id.toString()) {
    return response.status(401).send({error:"unauthorized, this blog was not created by the currently logged in user, cannot delete"})
  }

  //deleting every mention of this blog in creator user's bloglist
  const user = await User.findById(blog.user_id)
  user.blog_ids = user.blog_ids.filter(b_id => b_id != blog.id)
  user.save()

  await Blog.findByIdAndRemove(request.params.id)
  response.json({deleted:blog})
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response, next) => {
  console.log('aqanato', request.body);
  const blog = await Blog.findById(request.params.id)
  if(!blog) 
    return response.status(404).send({error:"blog not found"})

  // Returns a random integer from 0 to 100:
  const commentId = Math.floor(Math.random() * 10000)
  try {
    blog.comments = blog.comments.concat({text:request.body.comment, id:commentId})
    console.log('dziakavo');
    blog.save()
  } catch(e) {
    return response.status(501).end(e.message)
  }
  return response.json({text:request.body.comment, id:commentId})
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
  
  const blogFromClient = request.body
  if(blogFromClient.id != request.params.id) {
    return response.status(400).send({error:"different blog sent to different address"})
  }
    
  const blogFromDB = await Blog.findById(request.params.id)
  
  if(blogFromDB == null) 
    return response.status(404).send({error:"no blog to alter"})

  const ret = await Blog.findByIdAndUpdate(blogFromClient.id, blogFromClient, {new:true}).populate('user_id')
  response.status(200).send(ret)
})

module.exports = blogsRouter
