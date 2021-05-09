import request from '@/utils/request'
import { Message } from 'element-ui'
const state = {
  dismantle: {},
  dismantles: [],
  pagination: {}
}

const getters = {
  pagination: state => state.pagination,
  dismantles: state => state.dismantles,
  dismantle: state => state.dismantle
}

const mutations = {
  SET_DISMANTLES(state, payload) {
    state.dismantles = payload
  },
  SET_DISMANTLES_PAGINATION(state, payload) {
    state.pagination = payload
  },
  SET_DISMANTLE(state, payload) {
    state.dismantle = payload
  },
  CLEAR_DISMANTLE(state) {
    state.dismantle = {}
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  async ADD_DISMANTLE(state, { formData }) {
    try {
      const { data } = await request({
        url: '/api/dismantles',
        method: 'post',
        data: formData
      })
      Message({
        message: data?.message || 'Success',
        type: 'success',
        duration: 3 * 1000
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async UPDATE_DISMANTLE(state, { id, formData }) {
    try {
      const { data } = await request({
        url: `api/dismantle/edit/${id}`,
        method: 'post',
        data: formData
      })
      Message({
        message: data?.message || 'Success',
        type: 'success',
        duration: 3 * 1000
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async DELETE_DISMANTLE_IMAGE(state, { id }) {
    try {
      const { data } = await request({
        url: `/api/dismantle/image/${id}`,
        method: 'delete'
      })
      Message({
        message: data?.message || 'Success',
        type: 'success',
        duration: 3 * 1000
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_DISMANTLES({ commit }, { page = 1 }) {
    const { data } = await request({
      url: `/api/sellerDismantles?page=${page}`,
      method: 'get'
    })
    commit('SET_DISMANTLES', data?.data)
    commit('SET_DISMANTLES_PAGINATION', data?.meta)
  },
  async DELETE_DISMANTLE({ commit, dispatch }, { id, page = 1 }) {
    try {
      const { data } = await request({
        url: `/api/dismantle/${id}`,
        method: 'delete'
      })
      Message({
        message: data?.message || 'Successs',
        type: 'success',
        duration: 3 * 1000
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    await dispatch('GET_DISMANTLES', {
      page
    })
  },
  async GET_DISMANTLE({ commit }, { id }) {
    try {
      const { data } = await request({
        url: `/api/dismantles/${id}`,
        method: 'get'
      })
      commit('SET_DISMANTLE', data?.data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
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
