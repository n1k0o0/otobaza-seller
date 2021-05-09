import request from '@/utils/request'
import { Message } from 'element-ui'
const state = {
  order: {},
  orders: [],
  pagination: {},
  order_statuses: []
}

const getters = {
  order: state => state.order,
  orders: state => state.orders,
  pagination: state => state.pagination,
  order_statuses: state => state.order_statuses
}

const mutations = {
  SET_ORDERS(state, payload) {
    state.orders = payload
  },
  SET_ORDERS_PAGINATION(state, payload) {
    state.pagination = payload
  },
  SET_ORDER(state, payload) {
    state.order = payload
  },
  SET_ORDER_STATUSES(state, payload) {
    state.order_statuses = payload
  }
}

const actions = {
  async GET_ORDERS({ commit }, { page = 1 }) {
    try {
      const { data } = await request({
        url: `/api/sellerOrders?limit=10&page=${page}`,
        method: 'get'
      })
      commit('SET_ORDERS', data?.data)
      commit('SET_ORDERS_PAGINATION', data?.meta)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_ORDER({ commit }, { id }) {
    try {
      const { data } = await request({
        url: `/api/order/${id}`,
        method: 'get'
      })
      commit('SET_ORDER', data?.data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_ORDER_STATUSES({ commit }) {
    try {
      const { data } = await request({
        url: `/api/order/statuses`,
        method: 'get'
      })
      commit('SET_ORDER_STATUSES', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async SET_ORDER_STATUS(state, { order_id, id }) {
    try {
      return await request({
        url: `/api/setOrderStatus`,
        method: 'post',
        data: {
          order_id,
          order_statuses: {
            id
          }
        }
      })
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
