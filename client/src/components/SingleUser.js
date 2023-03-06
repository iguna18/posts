import { useDispatch, useSelector } from "react-redux"
import { setNotification, toggleFollow } from "../reducers/thunks"
import { addFollow, removeFollow } from "../reducers/usersSlice"
import usersService from '../services/users'

export const SingleUser = ({userToShow, loggedUserId}) => {
  const dispatch = useDispatch()

  const followState = useSelector(state => {
    return (
      state.users.find(u => u.id == userToShow.id).follower_ids.some(f => f == loggedUserId)
    )
  })

  if(!userToShow)
    return (
      <div></div>
    )
  return (
    <div>
      <h3><span style={{fontSize:'0.7em', fontStyle: 'italic'}}>user: </span>{userToShow.name}</h3>
      <div>
        {
          userToShow.id != loggedUserId ?
            <button onClick={() => dispatch(toggleFollow(loggedUserId, userToShow.id, followState))}>
              {followState ? 'unfollow' : 'follow'}
            </button>
          : null
        }
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