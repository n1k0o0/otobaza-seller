import request from '@/utils/request'
import { Message } from 'element-ui'

const state = {
  products: [],
  product: {
    brand: '',
    model: '',
    name: '',
    price: 0,
    currency: 1,
    about: '',
    images: [],
    deleted_files: [],
  },
  pagination: {},
  status: 0,
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
  async GET_PRODUCTS ({ commit, state }, { status = 0, page = 1 }) {
    try {
      commit('TOGGLE_LOADING')
      if (status) {
        commit('SET_STATUS', status)
      }

      const { data } = await request({
        url: `https://62d45369cd960e45d456a36d.mockapi.io/api/v2/products?page=${page}&status=${state.status}&keyword=${state.search}`,
        method: 'get'
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
        url: `https://62d45369cd960e45d456a36d.mockapi.io/api/v2/product/${id}`,
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
    console.log(state.product)
    let data = state.product

    const formData = new FormData()
    formData.append('_method', 'PUT')
    Object.keys(state.product).forEach(function (key) {
      if (data[key] === 'null' || data[key] === null) {
        data[key] = ''
      }
      if (key === 'url') {
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
      `https://62d45369cd960e45d456a36d.mockapi.io/api/v2/product/${state.product.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
