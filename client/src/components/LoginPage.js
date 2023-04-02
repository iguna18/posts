import React from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Popup from './Popup'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import { setNotification } from '../reducers/thunks'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userSlice'
import { useNavigate } from 'react-router-dom'
import RegistrationForm from './RegistrationForm'
import userService from '../services/users'

const LoginPage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const LogIn = (username, password) => {
    loginService
      .login(username, password)
      .then(retrievedUser => {
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(retrievedUser))
        dispatch(setUser(retrievedUser))
        blogService.setToken(retrievedUser.token)
        dispatch(setNotification('logged in'))
        navigate('/blogs')
      })
      .catch(exception => {
        dispatch(setNotification(exception.message))
      })
  }

  const register = (username, name, password) => {
    userService
      .addUser(username,name,password)
      .then((resData => {
        dispatch(setNotification('added new user'))
      })).catch(err => {
        dispatch(setNotification(err.message))
      })
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Popup/>
      <LoginForm loginFunction={LogIn} />
      <Togglable buttonLabel='registration'>
        <RegistrationForm registrationFunction={register}/>
      </Togglable>
    </div>
  )
}

export default LoginPage