import { getInfo, login, logout } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
import request from '@/utils/request'
import { Message } from 'element-ui'
import i18n from '@/lang'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    detail: {}
  }
}

const getters = {
  user: state => state.detail,
  token: state => state.token
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER(state, payload) {
    if (!payload.social_links) {
      payload.social_links = [{ name: '', value: '' }]
    }
    state.detail = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone, password })
        .then(response => {
          const { data } = response
          if (data.data.group.id === 2) {
            commit('SET_TOKEN', data.data.token)
            setToken(data.data.token)
            resolve()
          } else {
            Message({
              message: i18n.t('error'),
              type: 'error',
              duration: 5 * 1000
            })
            resolve()
          }
        })
        .catch(e => {
          const errors = Object.values(e?.response?.data?.errors)
            .map(item => item[0])
            .join('<br>')
          Message({
            message: errors || i18n.t('error'),
            type: 'error',
            duration: 5 * 1000
          })
          reject(e)
        })
    })
  },

  async SIGN_UP({ commit }, user) {
    try {
      return await request({
        url: '/api/user/register',
        method: 'post',
        data: user
      })
    } catch (e) {
      const errors = Object.values(e?.response?.data?.errors)
        .map(item => item[0])
        .join('<br>')
      Message({
        dangerouslyUseHTMLString: true,
        message: errors || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async SEND_OTP(state, { token, code }) {
    try {
      return await request({
        url: '/api/user/phone/edit',
        method: 'put',
        data: {
          code
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      throw Error(e)
    }
  },

  async RESEND_OTP(state, { token }) {
    try {
      return await request({
        url: '/api/user/phone/resend',
        method: 'put',
        data: {},
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      throw Error(e)
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data.data) {
            reject('Verification failed, please Login again.')
          }

          const { first_name } = data?.data
          commit('SET_NAME', first_name)
          commit('SET_USER', data?.data)
          resolve(data?.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout ({ commit }) {
    return new Promise((resolve) => {
      logout()
        .finally(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  async UPDATE_PROFILE(state, profile) {
    try {
      return await request({
        url: '/api/user/edit',
        method: 'post',
        data: profile
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async CHANGE_EMAIL(state, new_email) {
    try {
      const res = await request({
        url: '/api/user/email/edit',
        method: 'post',
        data: {
          new_email
        }
      })
      if (res?.data?.message) {
        Message({
          message: res?.data?.message,
          type: 'success',
          duration: 5 * 1000
        })
      }
      return res
    } catch (e) {
      Message({
        message: e?.response?.data?.errors?.new_email?.[0] || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async CHANGE_PASSWORD(state, password) {
    try {
      const res = await request({
        url: '/api/user/password/edit',
        method: 'post',
        data: password
      })
      if (res?.data?.message) {
        Message({
          message: res?.data?.message,
          type: 'success',
          duration: 5 * 1000
        })
      }
      return res
    } catch (e) {
      Message({
        message: e?.response?.data?.errors?.new_email?.[0] || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async CHANGE_PHONE(state, new_phone) {
    try {
      const res = await request({
        url: '/api/user/phone/edit',
        method: 'post',
        data: {
          new_phone
        }
      })
      if (res?.data?.message) {
        Message({
          message: res?.data?.message,
          type: 'success',
          duration: 5 * 1000
        })
      }
      return res
    } catch (e) {
      Message({
        message: e?.response?.data?.errors?.new_phone?.[0] || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      throw Error(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
