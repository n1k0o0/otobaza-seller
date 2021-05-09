import request from '@/utils/request'

const state = {
  manufacturers: null,
  manufacturer_models: null,
  model_cars: null,
  colors: null
}
const getters = {
  manufacturers: state => state.manufacturers,
  manufacturer_models: state => state.manufacturer_models,
  model_cars: state => state.model_cars,
  colors: state => state.colors
}

const mutations = {
  SET_USER(state, payload) {
    state.detail = payload
  },
  SET_MANUFACTURERS(state, payload) {
    state.manufacturers = payload
  },
  SET_MANUFACTURER_MODEL(state, payload) {
    state.manufacturer_models = payload
  },
  SET_MODEL_CARS(state, payload) {
    state.model_cars = payload
  },
  SET_COLORS: (state, payload) => {
    state.colors = payload
  }
}

const actions = {
  async GET_MANUFACTURERS({ commit }) {
    const { data } = await request({
      url: process.env.VUE_APP_CATALOG_API_URL + `/api/avto`,
      method: 'get'
    })
    commit('SET_MANUFACTURERS', data)
    return data
  },
  async GET_MANUFACTURER_MODELS({ commit }, { manufacturer }) {
    const { data } = await request({
      url: process.env.VUE_APP_CATALOG_API_URL + `/api/avto/${manufacturer}`,
      method: 'get'
    })
    commit('SET_MANUFACTURER_MODEL', data)
    return data
  },
  async GET_MODEL_CARS({ commit }, { model }) {
    const { data } = await request({
      url: process.env.VUE_APP_CATALOG_API_URL + `/api/cars/${model}`,
      method: 'get'
    })
    commit('SET_MODEL_CARS', data)
    return data
  },
  async GET_COLORS({ commit }) {
    const { data } = await request({
      url: '/api/colors',
      method: 'get'
    })
    commit('SET_COLORS', data)
    return data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
