import request from '@/utils/request'
import { Message } from 'element-ui'

const state = {
  statistics: [],
  payment_history: [],
  pagination: {},
  statistics_by_date: {},
  payment: {
    min_amount: 0
  }
}

const getters = {
  pagination: state => state.pagination,
  statistics: state => state.statistics,
  payment_history: state => state.payment_history,
  statistics_by_date: state => state.statistics_by_date,
  min_amount: state => state.payment.min_amount
}

const mutations = {
  SET_STATISTICS: (state, { data, meta }) => {
    state.statistics = data
    state.pagination = meta
  },
  SET_PAYMENT_HISTORY: (state, { data, meta }) => {
    state.payment_history = data
    state.pagination = meta
  },
  SET_STATISTICS_BY_DATE: (state, data) => {
    state.statistics_by_date = data
  },
  SET_MINIMUM_AMOUNT: (state, amount) => {
    state.payment.min_amount = amount
  }
}

const actions = {
  async GET_STATISTICS({ commit }, { page = 1 }) {
    try {
      const { data } = await request({
        url: `/api/statistics/click?page=${page}`,
        method: 'get'
      })
      commit('SET_STATISTICS', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_STATISTICS_BY_DATE({ commit }, { date }) {
    try {
      const { data } = await request({
        url: '/api/click/activity',
        method: 'post',
        data: {
          date
        }
      })
      commit('SET_STATISTICS_BY_DATE', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error GET_STATISTICS_BY_DATE',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_PAYMENT_HISTORY({ commit }, { page = 1 }) {
    try {
      const { data } = await request({
        url: `/api/statistics/payment/history?page=${page}`,
        method: 'get'
      })
      commit('SET_PAYMENT_HISTORY', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_MINIMUM_AMOUNT({ commit }) {
    try {
      const { data } = await request({
        url: `/api/click/minimumAmount`,
        method: 'get'
      })
      commit('SET_MINIMUM_AMOUNT', data?.amount || 1)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return e
    }
  },
  async PAY_AMOUNT(state, amount) {
    try {
      const { data } = await request({
        url: `/api/click/pay`,
        method: 'post',
        data: {
          amount
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
