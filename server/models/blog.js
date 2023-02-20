const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: 'String',
    required: true
  },
  author: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  url: String,
  likes: { 
    type: Number,
    default: 0 
  },
  comments: [
    {
    text:{
      type:String
    },
    id:{
      type:Number
    }
  }
  ]
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog