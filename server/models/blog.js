const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: 'String'
  },
  text: {
    type: 'String',
    // required: true
  },
  imageinfos: [
    {
      mimetype: {
        type:String,
        required:true
      },
      originalname: {
        type:String,
        required:true
      },
      data: {
        type:String,
        required:true
      }
    }
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sharingBlogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  likes: { 
    type: Number,
    default: 0 
  },
  likers: [mongoose.Schema.Types.ObjectId],
  creationDate:{
    type: Date,
    required: true,
    default:0
  },
  comments: [
    {
    text:{
      type:String
    },
    parentCommentId:{
      type: Number,
      ref: 'Comment'
    },
    childCommentIds:[
      {
        type: Number,
        ref: 'Comment'
      }
    ],
    creationDate:{
      type: Date,
      required: true,
      default:0
    },
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