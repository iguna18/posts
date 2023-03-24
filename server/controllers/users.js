const middleware = require('../utils/middleware')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()
const multer = require('multer')
const sharp = require('sharp')

const fileStorageEngine = multer.memoryStorage()

const upload = multer({ 
  storage: fileStorageEngine,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 megabytes
  }
})

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

//add pfp to user 
usersRouter.post('/:id/pfp', upload.single('pfp'), middleware.userExtractor, async (request, response) => {
  if(request.params.id.toString() != request.user_id.toString()) {
    return response.status(401).send({error:'an user\'s pfp can be update only by themselves'})
  }

  const user = await User.findById(request.params.id)
  if(!user) {
    return response.status(404).end()
  }
  user.imageinfo = {
    mimetype:request.file.mimetype,
    originalname:request.file.originalname,
    data:request.file.buffer.toString('base64')
  }
  let resizedImageBuffer = null
  try{
    resizedImageBuffer = await sharp(request.file.buffer)
    .resize(80, 80)
    .jpeg({ quality: 90 })
    .toBuffer()
  } catch(error) {
    console.log('egi',error);
    return response.status(500).json({error})
  }
  user.littleimageinfo = {
    mimetype:'image/jpeg',
    originalname:`${request.file.originalname}_small`,
    data:resizedImageBuffer.toString('base64')
  }
  try{
    await user.save()
    response.status(201).json(user)
  } catch (error){
    console.log(error)
    response.status(500).end()
  }
})

//for followers popup on frontend
usersRouter.get('/:id/follower_ids', async (request, response) => {
  const userid = request.params.id
  const user = await User.findById(userid)
  if(!user) {
    return response.status(404).end()
  }
  const u = await user.populate({
    path:'follower_ids',
    select:'username firstname lastname littleimageinfo'
  })
  return response.json(u.follower_ids)
})

//for followings popup on frontend
usersRouter.get('/:id/following_ids', async (request, response) => {
  const userid = request.params.id
  const user = await User.findById(userid)
  if(!user) {
    return response.status(404).end()
  }
  const u = await user.populate({
    path:'following_ids',
    select:'username firstname lastname littleimageinfo'
  })
  return response.json(u.following_ids)
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
  
  console.log('axca')
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
