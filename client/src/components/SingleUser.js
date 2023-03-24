import { useDispatch, useSelector } from "react-redux"
import { setNotification, toggleFollow, uploadPfp } from "../reducers/thunks"
import { addFollow, removeFollow } from "../reducers/usersSlice"
import usersService from '../services/users'
import Blog from "./Blog"
import '../styles/SingleUser.css'
import { setpopupContentN, setPopupProps } from "../reducers/popupSlice"
import _enum from "./enum"

const onClickFollowers = (dispatch, userid) => async () => {
  try {
    let followers = await usersService.getFollowers(userid)
    dispatch(setpopupContentN(_enum.USER_LIST_POPUP))
    dispatch(setPopupProps({userList:followers}))    
  } catch (error) {
    console.log(error)
  }
}

const onClickFollowings = (dispatch, userid) => async () => {
  try {
    let followings = await usersService.getFollowings(userid)
    dispatch(setpopupContentN(_enum.USER_LIST_POPUP))
    dispatch(setPopupProps({userList:followings}))    
  } catch (error) {
    console.log(error)
  }
}

const onFileChange = (dispatch, userid) => (event) => {
  const formData = new FormData();
  formData.append('pfp', event.target.files[0]);
  dispatch(uploadPfp(userid, formData))
}

export const SingleUser = ({userToShow, loggedUserId}) => {
  const dispatch = useDispatch()

  const followState = useSelector(state => {
    return (
      state.users.find(u => u.id == userToShow.id).follower_ids.some(f => f == loggedUserId)
    )
  })

  console.log(userToShow.firstname, userToShow.lastname );
  const name = userToShow.firstname.charAt(0).toUpperCase()+userToShow.firstname.slice(1)
    +' '+userToShow.lastname.charAt(0).toUpperCase()+userToShow.lastname.slice(1)
  console.log(name);
  const pfpSrc = userToShow.imageinfo ?
    `data:${userToShow.imageinfo.mimetype};base64,${userToShow.imageinfo.data}`
    : '/logo192.png'
  return (
    <div>
      <div style={{
        display:'flex',
        flexDirection:'row'
      }}>
        <div className='p'>
        <div style={{ position:'relative' }} className=''>
          <input type='file' id='pfpinput' accept="image/png, image/jpeg" 
            maxlength="10000000" onChange={onFileChange(dispatch, userToShow.id)} />
          <label htmlFor='pfpinput' id='pfpinputlabel'>Upload a pfp (only png and jpg files smaller than 10mb)</label>
          <img className='pfp' src={pfpSrc}/>
        </div>
        <h3>{name}</h3>
        <div>@{userToShow.username}</div>
        <div className='f'>
          <span onClick={onClickFollowers(dispatch, userToShow.id)}>
          <span>{userToShow.follower_ids.length}</span> followers 
          </span>
          <span onClick={onClickFollowings(dispatch, userToShow.id)}>
          <span> {userToShow.following_ids.length}</span> followings
          </span>
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
            <Blog key={b.id} blog={b}/>
          )
        })
      }
      </ul>
  </div>
  )
}