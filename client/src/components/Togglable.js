import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <div>
        <button id='showbutton' onClick={() => setVisible(!visible)} style={visible?{display:'none'}:{}}>
          { props.buttonLabel }
        </button>
      </div>
      {visible ? props.children : <></>}
      <div>
        <button onClick={() => setVisible(!visible)} style={visible?{}:{display:'none'}}>
          cancel
        </button>
      </div>
    </div>
  )
}

export default Togglable
