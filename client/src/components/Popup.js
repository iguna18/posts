import {useDispatch, useSelector} from 'react-redux'
import { Alert } from 'react-bootstrap'
import {setMessage} from '../reducers/messageSlice';
import '../styles/Popup.css'
import _enum from './enum';
import {BlogPopup, AddBlogPopup, UserListPopup} from './PopupContents'
import { setpopupContentN } from '../reducers/popupSlice';
import '../styles/lds-spinner.css'

const handleClose = (dispatch) => (e) => {
  dispatch(setMessage(null))
}
const handleClose2 = (dispatch) => (e) => {
  dispatch(setpopupContentN(_enum.NO_POPUP))
}
const Popup = () => {
  const dispatch = useDispatch()
  let message = useSelector(state => state.message)
  let popupContentN = useSelector(state => state.popup.popupContentN)
  let popupProps = useSelector(state => state.popup.popupProps)
  // if(message == 'WAIT') {
  //   return (<div>ASAS</div>
  //     )
  // }

  if(message) {
    return (
      <div className='overlay'>
        <Alert variant="success">
          {message=='WAIT'?<img src='/tail-spin.svg'/>:message}
          <button onClick={handleClose(dispatch)}>
            close
          </button>
        </Alert>
      </div>
    )
  }
  if(popupContentN == _enum.NO_POPUP)
    return null
  
  let PopupContent = null
  switch (popupContentN) {
    case _enum.ADD_BLOG_POPUP: 
      PopupContent = AddBlogPopup
      break;
    case _enum.BLOG_POPUP:
      PopupContent = BlogPopup
      break;
    case _enum.USER_LIST_POPUP:
      PopupContent = UserListPopup
      break;
    default:
      break;
  }
  
  return (
    <div className='overlay'>
      <div>
        <div className='x'>
          <span onClick={handleClose2(dispatch)}>X</span>  
        </div>
        <PopupContent {...popupProps}/>
      </div>
    </div>
  )
}

export default Popup