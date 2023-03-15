const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: 'String',
    minLength: 3,
    required: true
  },
  name: String,
  firstname: String,
  lastname: String,
  password: {
    type: 'String',
    required: true
  },
  blog_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    } 
  ],
  follower_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.password
  }
})
const User = mongoose.model('User', userSchema)
module.exports = User