import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlog: (state, action) => {
      return [...state, action.payload]
    },
    setBlogs: (state, action) => {
      return action.payload
    },
    updateBlog: (state, action) => {
      const blog = action.payload
      return state.map(b => b.id === blog.id ? blog : b)
    }
  }
})

export const { addBlog, setBlogs, updateBlog } = blogsSlice.actions

export default blogsSlice.reducer
