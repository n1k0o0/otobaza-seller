import request from '@/utils/request'
import { Message } from 'element-ui'

const state = {
  products: [],
  product: {
    car_manu_id: '',
    car_manu_name: '',
    car_mod_id: '',
    car_mod_name: '',
    title: '',
    price: '',
    price_type: '',
    description: '',
    images: []
  },
  pagination: {},
  status: '',
  search: '',
  loading: false,
}

const getters = {
  products: state => state.products,
  product: state => state.product,
  pagination: state => state.pagination,
  loading: state => state.loading,
  status: state => state.status,
  search: state => state.search,
}

const mutations = {
  SET_ORDERS_PAGINATION (state, payload) {
    state.pagination = payload
  },
  SET_PRODUCTS (state, payload) {
    state.products = payload
  },
  SET_PRODUCT (state, payload) {
    state.product = payload
    state.product.price_type = payload.price_type.id
    state.product.deleted_files = []
  },
  TOGGLE_LOADING (state) {
    state.loading = !state.loading
  },
  SET_STATUS (state, payload) {
    state.status = payload
  },
  SET_SEARCH (state, payload) {
    state.search = payload
  }
}

const actions = {
  async GET_PRODUCTS ({ commit, state }, { status = null, page = 1 }) {
    try {
      commit('TOGGLE_LOADING')
      if (status) {
        commit('SET_STATUS', status)
      }
      let url = `/api/seller/used-parts/search?page=${page}`

      if (+state.status !== 9) {
        url += `&status=${state.status}`
      }
      const { data } = await request({
        url: url,
        method: 'post',
        data: {
          keyword: state.search.length >= 4 ? state.search : ''
        }
      })
      commit('SET_PRODUCTS', data?.data)

      commit('SET_ORDERS_PAGINATION', data?.meta)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } finally {
      commit('TOGGLE_LOADING')
    }
  },
  async GET_PRODUCT ({ commit }, id) {
    try {
      commit('TOGGLE_LOADING')
      const { data } = await request({
        url: `/api/seller/used-parts/${id}`,
        method: 'get'
      })
      commit('SET_PRODUCT', data?.data)

    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    } finally {
      commit('TOGGLE_LOADING')
    }
  },
  async SAVE_PRODUCT ({ commit, state }) {
    let data = state.product

    const formData = new FormData()
    Object.keys(state.product).forEach(function (key) {
      if (data[key] === 'null' || data[key] === null) {
        data[key] = ''
      }
      if (key === 'images') {
        data[key].forEach((el) => {
          if (el.raw) {
            formData.append(`${key}[]`, el.raw)
          }
        })
      } else if (key === 'deleted_files') {

        let arr = data[key]

        for (let i = 0; i < arr.length; i++) {
          formData.append(`${key}[${i}]`, arr[i])
        }

      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        Object.keys(data[key]).forEach(function (subKey) {
          formData.append(`${key}[${subKey}]`, data[key][subKey])
        })
      } else {
        formData.append(`${key}`, data[key])
      }
    })

    console.log(formData)
    const { res } = await request.post(
      `/api/seller/used-parts/edit/${state.product.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

  },
  async CREATE_PRODUCT ({ commit, }, data) {
    const formData = new FormData()
    Object.keys(data).forEach(function (key) {
      if (data[key] === 'null' || data[key] === null) {
        data[key] = ''
      }
      if (key === 'images') {
        data[key].forEach((el) => {
          if (el.raw) {
            formData.append(`${key}[]`, el.raw)
          }
        })
      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        Object.keys(data[key]).forEach(function (subKey) {
          formData.append(`${key}[${subKey}]`, data[key][subKey])
        })
      } else {
        console.log(22222, key)
        formData.append(`${key}`, data[key])
      }
    })

    const {} = await request.post(
      '/api/seller/used-parts',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

  },
  async DELETE_IMG ({ commit }, id) {
    const {} = await request({
      url: `/api/seller/used-parts/image/${id}`,
      method: 'delete'
    })
  },
  async CHANGE_STATUS ({ commit }, { id, status }) {
    const {} = await request({
      url: `/api/seller/used-parts/${id}/status?publishable=${status}`,
      method: 'put'
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
