import { useDispatch, useSelector } from "react-redux"
import { setNotification } from "../reducers/thunks"
import { addFollow, removeFollow } from "../reducers/usersSlice"
import usersService from '../services/users'

export const SingleUser = ({userToShow, loggedUser}) => {
  const dispatch = useDispatch()
  const loggedUserId = useSelector(state => {
    return state.users.find(u => u.username == loggedUser.username).id
  })
  
  const followState = useSelector(state => {
    return (
      state.users.find(u => u.id == userToShow.id).follower_ids.some(f => f == loggedUserId)
    )
  })

  const handleFollow = () => {
    if(!followState) {
      return usersService
      .addFollow(loggedUserId, userToShow.id)
      .then((data) => {
        dispatch(addFollow({fromId:loggedUserId, toId:userToShow.id}))
      })
      .catch(err => {
        dispatch(setNotification(err.message))
      })
    }
    usersService
    .removeFollow(loggedUserId, userToShow.id)
    .then(data => {
      dispatch(removeFollow({fromId:loggedUserId, toId:userToShow.id}))
    })
    // .catch(err => {
      // dispatch(setNotification(err.message))
    // })
  }

  if(!userToShow)
    return (
      <div></div>
    )
  return (
    <div>
      <h3><span style={{fontSize:'0.7em', fontStyle: 'italic'}}>user: </span>{userToShow.name}</h3>
      <div>
        <button onClick={handleFollow}>
          {followState ? 'unfollow' : 'follow'}
        </button>
      </div>
      <h3><span style={{fontSize:'0.7em', fontStyle: 'italic'}}>added blogs:</span></h3>
      <ul>
      {
        userToShow.blog_ids.map(b => {
          return (
            <li key = {b.id}>
              {b.title}
            </li>
          )
        })
      }
      </ul>
  </div>
  )
}