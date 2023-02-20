import {useDispatch, useSelector} from 'react-redux'
import { Alert } from 'react-bootstrap'

const Message = () => {
  let text = useSelector(state => state.message)
  const messageStyle = {
    color:'purple'
  }
  if(!text)
    return null

  return (
    <Alert variant="success">
      {text}
    </Alert>
  )
}

export default Message