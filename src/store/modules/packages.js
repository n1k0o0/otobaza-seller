import request from '@/utils/request'
import { Message } from 'element-ui'

const state = {
  packages: [],
  current_package: {}
}

const getters = {
  packages: state => state.packages,
  current_package: state => state.current_package
}

const mutations = {
  SET_SELLER_PACKAGES: (state, payload) => {
    state.packages = payload
  },
  SET_SELLER_PACKAGE: (state, payload) => {
    state.current_package = payload
  }
}

const actions = {
  async GET_SELLER_PACKAGES({ commit }, { currency }) {
    try {
      const { data } = await request({
        url: `/api/packages?currency=${currency}`,
        method: 'get'
      })
      commit('SET_SELLER_PACKAGES', data?.data || [])
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_SELLER_PACKAGE({ commit }) {
    try {
      const { data } = await request({
        url: `/api/user/package`,
        method: 'get'
      })
      commit('SET_SELLER_PACKAGE', data?.data?.current || {})
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async PROLONG_PACKAGE({ commit }) {
    try {
      const { data } = await request({
        url: `/api/user/package/prolong`,
        method: 'post'
      })
      return data
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async SELLER_PACKAGE_CHANGE({ commit }, seller_package_id) {
    try {
      const { data } = await request({
        url: `/api/user/package/edit`,
        method: 'post',
        data: {
          seller_package_id
        }
      })
      return data
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return e
    }
  },
  async BUY_REQUESTS () {
    try {
      const { data } = await request({
        url: '/api/user/package/sorgu/buy',
        method: 'post'
      })
      return data
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
