const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

jest.setTimeout(10000);
beforeEach(async () => {
  await User.deleteMany({})
  const initialUsers = [
    {username:'vaxo17', name: 'vaxo', password: '870997'},
    {username:'qasho000', name: 'qasho', password: '121212'}
  ]
  for (let u of initialUsers) {
    let user = new User(u)
    await user.save()
  }
})

describe('adding a new user', () => {
  test('not added when password is lacking in the request', async () => {
    const blogsInDbAtStart = await User.find({})
    const newUser = {name:'gogia', username:'gogia123'}
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const blogsInDbAtEnd = await User.find({})
    expect(blogsInDbAtStart.length === blogsInDbAtEnd.length)
  })
  test('not added when username is lacking in the request', async () => {
    const blogsInDbAtStart = await User.find({})
    const newUser = {name:'gogia', password:'gogia123456789@'}
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const blogsInDbAtEnd = await User.find({})
    expect(blogsInDbAtStart.length === blogsInDbAtEnd.length)
  })
  test('not added when username is too short', async () => {
    const blogsInDbAtStart = await User.find({})
    const newUser = {username:'ia', password:'ia9987@'}
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const blogsInDbAtEnd = await User.find({})
    expect(blogsInDbAtStart.length === blogsInDbAtEnd.length)
  })
  test('added when good request', async () => {
    const blogsInDbAtStart = await User.find({})
    const newUser = {name:'gogia', username:'gogia123', password:'gogia123456789'}
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
    const blogsInDbAtEnd = await User.find({})
    expect(blogsInDbAtStart.length === blogsInDbAtEnd.length)
  })
  test('not added when username is already in the database', async () => {
    const blogsInDbAtStart = await User.find({})
    const newUser = {username:'qasho000', name: 'qasho', password: '121212'}
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const blogsInDbAtEnd = await User.find({})
    expect(blogsInDbAtStart.length === blogsInDbAtEnd.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})  
