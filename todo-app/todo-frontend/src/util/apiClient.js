import axios from 'axios'

const apiUrl = process.env.REACT_APP_BACKEND_URL

const apiClient = axios.create({
  baseURL: `${apiUrl}`,
})

export default apiClient