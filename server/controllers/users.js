const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.patch('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.blogs = user.blogs.concat(req.body.newBlog)
    const result = await user.save()
    res.json(result)
  } else {
    res.status(404).end()
  }
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate({path:'blog_ids', model:"Blog"})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const {username, name, password} = req.body
  if(!password || !username) {
    return res.status(400).json({
      error: `password and username are required` 
    })
  }
  if(password.length < 3) {
    return res.status(400).json({
      error: 'password must be at least 3 characters long' 
    })
  }
  const existing = await User.findOne({username})
  if(existing) {
    return res.status(400).json({
      error: 'username must be unique' 
    })
  }
  const passwordHash = await hashPassword(password)
  const result = await saveUser(username, name, passwordHash)
  res.status(201).json(result)
})

module.exports = usersRouter

async function saveUser(username, name, passwordHash) {
  const user = new User({username, name, password:passwordHash})
  const result = await user.save()
  return result
}

async function hashPassword(password) {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}
