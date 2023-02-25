import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      return action.payload
    },
    setUserField: (state, action) => {
      const {id, field, value} = action.payload
      const userIndex = state.findIndex(e => e.id == id)
      state[userIndex][field] = value
      return
    },
    addBlogToUser: (state, action) => {
      const {newBlog} = action.payload
      const userIndex = state.findIndex(e =>  {
        return e.id == newBlog.user_id.id
      })
      state[userIndex].blog_ids = state[userIndex].blog_ids.concat(newBlog) 
      return
    },
    addFollow: (state, action) => {
      const {fromId, toId} = action.payload
      const followingsOfFrom = state.find(u => u.id == fromId).following_ids
      const followersOfTo = state.find(u => u.id == toId).follower_ids

      if(!followingsOfFrom.some(id => id==toId))
        followingsOfFrom.push(toId)

      if(!followersOfTo.some(id => id==fromId))
        followersOfTo.push(fromId)
      
      return
    },
    removeFollow: (state,action) => {
      const {fromId, toId} = action.payload
      const fromIdx = state.findIndex(u => u.id == fromId)
      const toIdx = state.findIndex(u => u.id == toId)

      state[fromIdx].following_ids =
        state[fromIdx].following_ids.filter(id => id!=toId)
      state[toIdx].follower_ids =
        state[toIdx].follower_ids.filter(id => id!=fromId)
      return
    }
  }
})

export const { setUsers, setUserField, addBlogToUser, addFollow, removeFollow } = usersSlice.actions

export default usersSlice.reducer
