const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

jest.setTimeout(10000);
beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
    
  }
})
test('blogs are returned as json and there are two blogs', async () => {
  await api
  .get('/api/blogs')
  .expect(200)
    .expect('Content-Type', /application\/json/)
    
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
}, 150000)

test('unique identifier property of the blog posts is named id', async ()=>{
  const response = await api.get('/api/blogs')
  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog =   {title: 'jojoebi', author: 'dzianika', url: 'www.dzianikadaily.com/joj', likes:9}
  await api
    .post('/api/blogs')
    .set({Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwbGl5dmkiLCJpZCI6IjYzMTllYmI0YTlkYTVjYTk0OTU1MmQwMyIsImlhdCI6MTY2MjY0MzE2M30.bKD_3aa2vGeHhZkJGYhMqFFtSAFOAvrEp7LGyeUE1Uk'})
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()  
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain(
    'jojoebi'
  )
}, 100000)

test('likes parameter is defaulted to 0 if there is none in the request', async () => {
  const newBlog = {title:'orxevi', author: 'nika', url: 'www.nikadaily.com/samgori2022'} //has no likes
  const response = await api
  .post('/api/blogs')
  .set({Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwbGl5dmkiLCJpZCI6IjYzMTllYmI0YTlkYTVjYTk0OTU1MmQwMyIsImlhdCI6MTY2MjY0MzE2M30.bKD_3aa2vGeHhZkJGYhMqFFtSAFOAvrEp7LGyeUE1Uk'})
  .send(newBlog)
  .expect(201)
  expect(response.body.likes).toBe(0)
})

test('status code 400 is returned if the title and url properties are missing from the request', async () => {
  const newBlog = {author: 'nika', likes:19}
  await api
    .post('/api/blogs')
    .set({Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwbGl5dmkiLCJpZCI6IjYzMTllYmI0YTlkYTVjYTk0OTU1MmQwMyIsImlhdCI6MTY2MjY0MzE2M30.bKD_3aa2vGeHhZkJGYhMqFFtSAFOAvrEp7LGyeUE1Uk'})
    .send(newBlog)
    .expect(400)
})

test('existing blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({Authorization:'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNwbGl5dmkiLCJpZCI6IjYzMTllYmI0YTlkYTVjYTk0OTU1MmQwMyIsImlhdCI6MTY2MjY0MzE2M30.bKD_3aa2vGeHhZkJGYhMqFFtSAFOAvrEp7LGyeUE1Uk'})
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toEqual(blogsAtStart.length - 1)

  //checking deleted blog is no more in the database
  titlesAtEnd = blogsAtEnd.map(b => b.title)
  expect(titlesAtEnd).not.toContain(blogToDelete.title)
}, 200000)

test('individual blog can be updated', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const initialTitle = blogToUpdate.title

  blogToUpdate.title = 'changedTitle'
  blogToUpdate.url = 'changedUrl'
  blogToUpdate.author = 'changedAuthor'

  const r = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
  
  expect(response.body.title).not.toBe(initialTitle)
  expect(response.body.title).toBe('changedTitle')
})

afterAll(() => {
  mongoose.connection.close()
})  
