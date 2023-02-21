import {useDispatch, useSelector} from 'react-redux'
import { Alert } from 'react-bootstrap'
import styled from "styled-components";
import {setMessage} from '../reducers/messageSlice';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledPopup = styled.div`
  background-color: white;
  position: relative;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: fit-content;
`

const handleClose = (dispatch) => (e) => {
  dispatch(setMessage(null))
}

const Message = () => {
  const dispatch = useDispatch()
  let text = useSelector(state => state.message)
  const messageStyle = {
    color:'purple'
  }
  if(!text)
    return null

  return (
    <PopupOverlay>
      <Alert variant="success">
        {text}
        <button onClick={handleClose(dispatch)}>
          close
        </button>
      </Alert>
    </PopupOverlay>
  )
}

export default Message