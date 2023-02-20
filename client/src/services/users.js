import axios from 'axios'
const baseUrl = 'http://localhost:3005/api/users'
// const baseUrl = '/api/users'

const getAll = async () => {
  return (
    axios
      .get(baseUrl)
      .then(response => response.data)
  )
}

export default { getAll }