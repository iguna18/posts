import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import UserPage from './components/UserPage'
import LoginPage from './components/LoginPage'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from './reducers/userSlice'
import { Container } from '@mui/system'
import { setpopupContentN } from './reducers/popupSlice'
import _enum from './components/enum'

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

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        dispatch(setpopupContentN(_enum.NO_POPUP))
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    };
  }, []);

  const style = {
    width: '100%',
    // maxWidth: '500px',
    // backgroundImage: 'linear-gradient(purple, blue)',
    height:'100vh',
  }

  return (
    // <div style={style}>
    <Container fixed>
      {user != null ? <UserPage/> : <LoginPage/>}

    </Container>
    // </div>
  )
}

export default App
