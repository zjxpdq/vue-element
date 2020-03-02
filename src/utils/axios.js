import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

service.interceptors.response.use(res => {
  return res.data
}, error => {
  return Promise.reject(error.response)
})

service.interceptors.request.use(config => {
  return config
}, err => {
  Promise.reject(err)
})

export default service
