import request from '@/utils/request'

export function login(data) {
  return request({
    url: process.env.VUE_APP_BASE_API_URL + '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: process.env.VUE_APP_BASE_API_URL + '/api/user/me',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: process.env.VUE_APP_BASE_API_URL + '/api/user/logout',
    method: 'get',
    params: { token }
  })
}
