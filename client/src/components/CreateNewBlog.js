import React from 'react'
import { useEffect, useRef, useState } from 'react'
import {createBlog} from '../reducers/thunks'
import { useDispatch } from 'react-redux'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Register the plugins
registerPlugin(FilePondPluginImagePreview);


const CreateNewBlog = ({user}) => {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])

  const dispatch = useDispatch()
  const handleCreate = (event) => {
    event.preventDefault()
    dispatch(createBlog({text}))
    setText('')
  }

  const onClick = () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i].file);
    }
    dispatch(createBlog({text},formData))
    // setText('')
    // setFiles([])
  }

  const b = () => {
    console.log(files)
    const formData = new FormData();
    console.log(formData)
  }
  const fileReader = new FileReader();
  return (
    <div >
      <h3>create new</h3>
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true }
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />
      <button onClick={onClick}>huh</button>
      <textarea value={text} onChange={e => setText(e.target.value)}/>
      <button onClick={handleCreate}>create</button>
    </div>
  )
}


export default CreateNewBlog