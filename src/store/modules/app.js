import request from '@/utils/request'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'

const currency = localStorage.getItem('currency') || 4

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: Cookies.get('language') ? Cookies.get('language') : 'az',
  dashboard: {},
  dashboard_orders: [],
  currencies: [],
  currency: +currency,
  countries: [],
  account_status: {
    products_invisible: false,
    products_invisible_msg: '',
    balance_overed: false,
    balance_overed_msg: '',
    package_expired: false,
    package_expired_msg: ''
  }
}

const getters = {
  dashboard: state => state.dashboard,
  dashboard_orders: state => state.dashboard_orders,
  currencies: state => state.currencies,
  currency: state => state.currency,
  countries: state => state.countries,
  account_status: state => state.account_status
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    Cookies.set('language', language)
    state.language = language
  },
  SET_DASHBOARD: (state, payload) => {
    state.dashboard = payload
  },
  SET_DASHBOARD_ORDERS: (state, payload) => {
    state.dashboard_orders = payload
  },
  SET_CURRENCIES: (state, payload) => {
    state.currencies = payload.filter(item => item.has_price)
  },
  SET_CURRENCY: (state, payload) => {
    state.currency = payload
  },
  SET_COUNTRIES: (state, payload) => {
    state.countries = payload
  },
  SET_ACCOUNT_STATUS: (state, payload) => {
    state.account_status = payload
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
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  async GET_DASHBOARD({ commit }) {
    const { data } = await request({
      url: '/api/dashboard',
      method: 'get'
    })
    commit('SET_DASHBOARD', data)
    return data
  },
  async GET_DASHBOARD_ORDERS({ commit }, { limit }) {
    const { data } = await request({
      url: `/api/sellerOrders?limit=${limit}`,
      method: 'get'
    })
    commit('SET_DASHBOARD_ORDERS', data?.data || [])
    return data
  },
  async GET_CURRENCIES({ commit }) {
    try {
      const { data } = await request({
        url: '/api/priceTypes',
        method: 'get'
      })
      commit('SET_CURRENCIES', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_SETTINGS({ commit }) {
    try {
      const { data: settings } = await request({
        url: '/api/settings',
        method: 'get'
      })
      commit('SET_COUNTRIES', settings?.country || [])
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_ACCOUNT_STATUS({ commit }) {
    try {
      const { data } = await request({
        url: '/api/accountStatus',
        method: 'get'
      })
      commit('SET_ACCOUNT_STATUS', data || {})
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
