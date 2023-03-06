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
      const {fromid, toid} = action.payload
      const followingsOfFrom = state.find(u => u.id == fromid).following_ids
      const followersOfTo = state.find(u => u.id == toid).follower_ids

      if(!followingsOfFrom.some(id => id==toid))
        followingsOfFrom.push(toid)

      if(!followersOfTo.some(id => id==fromid))
        followersOfTo.push(fromid)
      
      return
    },
    removeFollow: (state,action) => {
      const {fromid, toid} = action.payload
      const fromIndex = state.findIndex(u => u.id == fromid)
      const toIndex = state.findIndex(u => u.id == toid)

      state[fromIndex].following_ids =
        state[fromIndex].following_ids.filter(id => id!=toid)
      state[toIndex].follower_ids =
        state[toIndex].follower_ids.filter(id => id!=fromid)
      return
    }
  }
})

export const { setUsers, setUserField, addBlogToUser, addFollow, removeFollow } = usersSlice.actions

export default usersSlice.reducer
