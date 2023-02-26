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
    parentCommentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    // creationDate:{
    //   type: Date,
    //   required: true,
    //   default:0
    // },
    id:{
      type:Number
    },
    likers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
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