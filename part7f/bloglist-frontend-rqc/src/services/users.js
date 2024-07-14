import axios from 'axios'
const baseUrl = '/api/users'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  console.log('response.data', response.data)
  return response.data
}

// const create = async (newObject) => {
//   const config = {
//     headers: { Authorization: token },
//   }

//   const response = await axios.post(baseUrl, newObject, config)
//   return response.data
// }

// const update = async (updatedObject) => {
//   const config = {
//     headers: { Authorization: token },
//   }

//   const response = await axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject, config)
//   return response.data
// }

// const remove = async (id) => {
//   const config = {
//     headers: { Authorization: token },
//   }

//   await axios.delete(`${baseUrl}/${id}`, config)
//   return id
// }

export default { getAll, getById, setToken }
