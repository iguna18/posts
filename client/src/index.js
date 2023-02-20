import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {  BrowserRouter } from "react-router-dom"

import messageReducer from './reducers/messageSlice'
import blogsReducer from './reducers/blogsSlice'
import userReducer from './reducers/userSlice'
import usersReducer from './reducers/usersSlice'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

let store = configureStore({
  reducer: {
    message: messageReducer,
    blogs: blogsReducer,
    user: userReducer,
    users: usersReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
