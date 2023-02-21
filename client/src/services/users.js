import axios from 'axios'
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
  // return (

  // )
}

export default { getAll, addUser }