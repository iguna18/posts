import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'message',
  initialState:null,
  reducers: {
    setMessage: (state, action) => {
      return action.payload
    }
  }
})

export const { setMessage } = messageSlice.actions

export default messageSlice.reducer
