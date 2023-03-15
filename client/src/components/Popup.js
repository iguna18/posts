import {useDispatch, useSelector} from 'react-redux'
import { Alert } from 'react-bootstrap'
import {setMessage} from '../reducers/messageSlice';
import '../styles/Popup.css'
import _enum from './enum';
import {BlogPopup, AddBlogPopup} from './PopupContents'

const handleClose = (dispatch) => (e) => {
  dispatch(setMessage(null))
}

const Popup = () => {
  const dispatch = useDispatch()
  let message = useSelector(state => state.message)
  let popupContentN = useSelector(state => state.popupContentN)
  let popupProps = useSelector(state => state.popupProps)
  if(message) {
    return (
      <div className='overlay'>
        <Alert variant="success">
          {message}
          <button onClick={handleClose(dispatch)}>
            close
          </button>
        </Alert>
      </div>
    )
  }
  return null
  if(popupContentN == _enum.NO_POPUP)
    return
  
  let PopupContent = null
  switch (popupContentN) {
    case _enum.ADD_BLOG_POPUP: 
      PopupContent = BlogPopup
      break;
    case _enum.BLOG_POPUP:
      PopupContent = AddBlogPopup
      break;
    default:
      break;
  }
  
  return (
    <div className='overlay'>
      <div>
        <PopupContent {...popupProps}/>
      </div>
    </div>
  )
}

export default Popup