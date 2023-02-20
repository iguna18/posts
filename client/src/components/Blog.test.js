import React, { useSyncExternalStore } from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog /> rendering', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'titletest',
      author: 'authortest',
      url: 'urltest',
      likes: 7
    }

    const removeBlog = () => {}
    const addLike = () => {}
  
    container = render(<Blog blog = {blog} blogStyle={{}} removeBlog={removeBlog}
      addLike={ addLike } isCreatedByCurrentUser = { true }/>).container
  })

  test('correct initial rendering', async () => {

    let element = screen.queryByText('titletest by authortest')
    expect(element).not.toBeNull()
    
    element = screen.queryByText('urltest')
    expect(element).toBeNull()

    element = screen.queryByText('7')
    expect(element).toBeNull()
  })

  test('correct rendering after clicking \'view\'', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#viewbutton')
    expect(button).not.toBeNull()
    await user.click(button)
    
    let element = screen.queryByText('urltest')
    expect(element).not.toBeNull()
  
    element = screen.queryByText('7')
    expect(element).not.toBeNull()
  })


})

test('<Blog /> functions', async () => {
  const blog = { title: 'titletest', author: 'authortest',
    url: 'urltest', likes: 7 }
  const removeBlog = () => {}
  let counter = 0
  const mockHandler = jest.fn()
  const fn = (blog) => () => {
    mockHandler(blog)
  }
  const container = render(<Blog blog = {blog} blogStyle={{}} removeBlog={removeBlog}
    addLike={fn} isCreatedByCurrentUser = { true }/>).container

  const user = userEvent.setup()
  //inflating Blog
  const viewbutton = container.querySelector('#viewbutton')
  await user.click(viewbutton)

  const likebutton = container.querySelector('#likebutton')

  await user.click(likebutton)
  await user.click(likebutton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})