import React from 'react'
import { useState } from 'react'
import MyInput from './MyInput'


const RegistrationForm = ({registrationFunction}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    registrationFunction(username, name, password)
    setUsername('')
    setPassword('')
    setName('')
  }

  return (
    <form onSubmit={ handleSubmit }>
      username (must be unique) 
      <MyInput value={ username } setValue={ setUsername }/>
      <br/>
      name 
      <MyInput value={ name } setValue={ setName }/>
      <br/>
      password <MyInput value={ password } setValue={ setPassword }/>
      <br/>
      <button>register</button>
    </form>
  )
}

export default RegistrationForm