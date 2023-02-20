import React, { useSyncExternalStore } from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import CreateNewBlog from './CreateNewBlog'

test('From inside <CreateNewBlog/> function createBlog passed as prop is called right', 
  async () => {
  const mockHandler = jest.fn()

  const container = render(<CreateNewBlog createBlog={mockHandler}/>).container
  const boxes = screen.queryAllByRole('textbox')
  const user = userEvent.setup()
  user.type(boxes[0], 'a')
  user.type(boxes[1], 'b')
  user.type(boxes[2], 'c')
  const button = screen.queryByRole('button')
  await user.click(button)
  expect(mockHandler.mock.calls[0][0]).toEqual('a')
  expect(mockHandler.mock.calls[0][1]).toEqual('b')
  expect(mockHandler.mock.calls[0][2]).toEqual('c')
})