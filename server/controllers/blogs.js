const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const multer = require('multer')
const fs = require('fs')

const fileStorageEngine = multer.memoryStorage()

const upload = multer({ 
  storage: fileStorageEngine,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 megabytes
  }
})

const blogsRouter = require('express').Router()

//get every blog
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user_id')
  response.json(blogs)
})

//add a new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  request.body.user_id = request.user_id

  if(!request.body.text) {
    response.status(400).end()
    return
  }
  const user = await User.findById(request.body.user_id)
  if(!user) {
    return response.status(401).end({error:"token in correct format but the passed id deosnt belong to any user (expired token?)"})
  }
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

// toggle like to the blog
blogsRouter.post('/:id/like', middleware.userExtractor, async (request, response) => {
  const blogid = request.params.id
  const user_id = request.user_id
  const blog = await Blog.findById(blogid)
  if(blog) {
    const hasLiked = blog.likers.find(uid => uid == user_id)
    if(!hasLiked) {
      blog.likers.push(user_id)
    } else {
      blog.likers = blog.likers.filter(uid => uid != user_id)
    }
    await blog.save()
    return response.json(blog)
  } else {
    response.status(404).end()
  }
})

//add images to the blog (save imags to ./images and save their unique names in the database) 
blogsRouter.post('/:id/images', upload.array('images'), middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(404).end()
  }

  if (blog.user_id.toString() != request.user_id.toString()) {
    return response.status(401).send({error:"unauthorized, only the author can add images to the blog"})
  }
  if(!blog.imageinfos)
    blog.imageinfos = []
  
  console.log('request.files',request.files);
  console.log('request.body',request.body);

  for(let i=0; i<request.files.length; i++) {
    blog.imageinfos.push({
      mimetype:request.files[i].mimetype,
      originalname:request.files[i].originalname,
      data:request.files[i].buffer.toString('base64')
    })
  }
  try{
    await blog.save()
    response.status(201).send(await blog.populate('user_id'))
  } catch (error){
    console.log(error)
    response.status(500).end()
  }
})

//delete the blog
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

//get the blog
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

//get comments to the blog
blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog) 
    return response.status(404).send({error:"blog not found"})

  // Returns a random integer from 0 to 100000:
  const commentId = Math.floor(Math.random() * 100000)
  try {
    blog.comments = blog.comments.concat({
      text:request.body.comment, 
      id:commentId,
      creationDate:new Date(),
      parentCommentId:request.body.parentCommentId
    })

    //find the parent comment and add the new comment id to its childrens
    if(request.body.parentCommentId) {
      blog.comments.find(c => c.id == request.body.parentCommentId).childCommentIds.push(commentId)
    }
    blog.save()

    return response.json(blog.comments.find(c => c.id == commentId))
  } catch(e) {
    return response.status(501).end(e.message)
  }
})

//get the comment
blogsRouter.get('/:blogid/comments/:commentid', async (request, response) => {
  const blogid = request.params.blogid
  const commentid = request.params.commentid
  const blog = await Blog.findById(blogid)
  if(blog) {
    const com = blog.comments.find(c => c.id == commentid)
    if(com) {
      response.json(com)
    } else {
      response.status(404).end()
    }
  } else {
    response.status(404).end()
  }
})

// toggle like to the comment  (add the logged-in user id to the comment's "likers" field, or remove from it)
blogsRouter.post('/:blogid/comments/:commentid/like', middleware.userExtractor, async (request, response) => {
  const blogid = request.params.blogid
  const commentid = request.params.commentid
  const user_id = request.user_id
  const blog = await Blog.findById(blogid)
  if(blog) {
    const theComment = blog.comments.find(c => c.id == commentid)
    if(!theComment) {
      return response.status(404).end()
    }
    const hasLiked = theComment.likers.find(uid => uid == user_id)
    if(!hasLiked) {
      theComment.likers = theComment.likers.concat(user_id)
    } else {
      theComment.likers = theComment.likers.filter(uid => uid != user_id)
    }
    await blog.save()
    return response.json(theComment)
  } else {
    response.status(404).end()
  }
})

//replace the blog
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
