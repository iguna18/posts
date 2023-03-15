import { useDispatch, useSelector } from "react-redux"
import { setNotification, toggleFollow } from "../reducers/thunks"
import { addFollow, removeFollow } from "../reducers/usersSlice"
import usersService from '../services/users'
import Blog from "./Blog"
import '../styles/SingleUser.css'

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

  console.log(userToShow.firstname, userToShow.lastname );
  const name = userToShow.firstname.charAt(0).toUpperCase()+userToShow.firstname.slice(1)
    +' '+userToShow.lastname.charAt(0).toUpperCase()+userToShow.lastname.slice(1)
  console.log(name);
  return (
    <div>
      <div style={{
        display:'flex',
        flexDirection:'row'
      }}>
        <div className='p'>
        <h3>{name}</h3>
        <div>@{userToShow.username}</div>
        <div className='f'>
          <span>{userToShow.follower_ids.length}</span> followers 
          <span> {userToShow.following_ids.length}</span> followings
        </div>
        </div>
      </div>
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
            // <li key = {b.id}>
            //   {b.title}
            // </li>
            <Blog blog={b}/>
          )
        })
      }
      </ul>
  </div>
  )
}