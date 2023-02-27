import { useState } from 'react'
import MyInput from './MyInput'
import {createBlog} from '../reducers/thunks'
import { useDispatch } from 'react-redux'

const CreateNewBlog = ({user}) => {
  const [text, setText] = useState('')

  const dispatch = useDispatch()
  const handleCreate = (event) => {
    event.preventDefault()
    dispatch(createBlog(text))
    setText('')
  }

  return (
    <div >
      <h3>create new</h3>
      <form onSubmit = {handleCreate}>
        <textarea value={text} onChange={e => setText(e.target.value)}/>
        <button id='createbutton'>create</button>
      </form>
    </div>
  )
}


export default CreateNewBlog