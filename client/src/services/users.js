import axios from 'axios'
import { token } from './blogs'
const baseUrl = 'http://localhost:3005/api/users'
// const baseUrl = '/api/users'

const getAll = () => {
  return (
    axios
      .get(baseUrl)
      .then(response => {
        // console.log(response.data);
        return response.data
      })
  )
}

const addUser = (username, name, password) => {
  return (
    axios
      .post(baseUrl, {username,name,password})
      .then(response => response.data)
  )
}

const addFollow = (from, to) => {
  return (
    axios
      .post(`${baseUrl}/follow`, {from, to})
      .then(response => response.data)
  )
}

const removeFollow = (from,to) => {
  return (
    axios
      .post(`${baseUrl}/unfollow`, {from, to})
      .then(response => response.data)
  )
}

const getFollowers = (blogid) => {
  return (
    axios
      .get(`${baseUrl}/${blogid}/follower_ids/`)
      .then(response => response.data)
  )
}

const getFollowings = (blogid) => {
  return (
    axios
      .get(`${baseUrl}/${blogid}/following_ids/`)
      .then(response => response.data)
  )
}

const uploadPfp = (userid, formdataWithFile) => {
  const config = {
    headers: { 
      Authorization:token,
      'Content-Type': 'multipart/form-data'
    }
  }
  return (
    axios
      .post(`${baseUrl}/${userid}/pfp/`, formdataWithFile, config)
      .then(response => response.data)
  )
}

export default { getAll, addUser, addFollow, removeFollow, getFollowers, getFollowings, uploadPfp }