import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
})

// request interceptor
service.interceptors.request.use(config => {
  // do something before request is sent
  if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    config.headers['Authorization'] = 'Bearer ' + getToken()
  }
  config.headers['Content-Type'] = 'application/json'
  config.headers['Accept'] = 'application/json'
  config.headers['Content-Language'] = i18n?.locale || 'az'
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(/**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */ response => {
    const res = response
    // if the custom code is not 20000, it is judged as an error.
    if (res.status < 200 || res.status > 299) {
      Message({
        message: res?.message || i18n.t('error'), type: 'error', duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login', cancelButtonText: 'Cancel', type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res?.message || i18n.t('error')))
    } else {
      return res
    }
  }, error => {
    let defaultError = i18n.t('error')
    const errors = error?.response?.data?.errors || error?.response?.data?.message || [defaultError]
    const errorMessage = typeof errors === 'string' ? (error?.response?.data?.message || defaultError) : Object.values(errors).join('<br>')

    Message({
      dangerouslyUseHTMLString: true, message: errorMessage, type: 'error', duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
