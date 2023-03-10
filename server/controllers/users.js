const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.patch('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    const {field,value} = req.body
    user[field] = value 
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

usersRouter.post('/follow', async (req, res) => {
  const {from, to} = req.body

  const userFrom = await User.findById(from)
  const userTo = await User.findById(to)
  if(!userFrom || !userTo){
    res.status(404).end()
    return
  }
  if(!userFrom.following_ids.find(f=>f==to))
    userFrom.following_ids = userFrom.following_ids.concat(to)
  
  if(!userTo.follower_ids.find(f=>f==from))
    userTo.follower_ids = userTo.follower_ids.concat(from)  
  
  const resultFrom = await userFrom.save()
  const resultTo = await userTo.save()
  res.status(201).json({from:resultFrom, to:resultTo})
})

usersRouter.post('/unfollow', async (req, res) => {
  const {from, to} = req.body
  const userFrom = await User.findById(from)
  const userTo = await User.findById(to)
  if(!userFrom || !userTo){
    res.status(404).end()
    return
  }
  userFrom.following_ids = userFrom.following_ids.filter(id => id!=to)
  userTo.follower_ids = userTo.follower_ids.filter(id => id!=from)  
  
  const resultFrom = await userFrom.save()
  const resultTo = await userTo.save()
  res.status(201).json({from:resultFrom, to:resultTo})
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
