/**
 * 基于axios封装的请求模块
 */

import axios from 'axios'
const Cookie = process.client ? require('js-cookie'): undefined

const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

request.interceptors.request.use(function (config) {
  try {
    const user = JSON.parse(Cookie.get('user') || '{}')
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
  } catch {
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

export default request