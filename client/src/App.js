import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import UserPage from './components/UserPage'
import LoginPage from './components/LoginPage'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from './reducers/userSlice'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const localStorageUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(localStorageUser))
      blogService.setToken(localStorageUser.token)
    }
  }, [])

  const style = {
    width: '80%',
    maxWidth: '500px',
    padding: '30px',
    backgroundColor: 'lightgray',
    textAlign: 'center'  
  }

  return (
    <div className="container" style={style}>
      {user != null ? <UserPage/> : <LoginPage/>}
    </div>
  )
}

export default App
