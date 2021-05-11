import request from '@/utils/request'
import { Message } from 'element-ui'

const state = {
  excel_parts: [],
  uploaded_data_files: [],
  products: [],
  products_pagination: {},
  part_manufacturers: []
}

const getters = {
  excel_parts: state => state.excel_parts,
  uploaded_data_files: state => state.uploaded_data_files,
  products: state => state.products,
  products_pagination: state => state.products_pagination,
  part_manufacturers: state => state.part_manufacturers
}

const mutations = {
  SET_EXCEL_DATA(state, payload) {
    state.excel_parts = payload.map(item => {
      item.editable = false
      return item
    })
  },
  SET_MANUAL_PARTS(state, payload) {
    state.excel_parts=[payload,...state.excel_parts]
  },
  CLEAR_EXCEL_DATA(state) {
    state.excel_parts = []
  },
  SET_UPLOADED_DATA_FILES(state, payload) {
    state.uploaded_data_files = payload
  },
  SET_PRODUCTS_BY_DATA_FILE(state, { data, meta }) {
    state.products = data
    state.products_pagination = meta
  },
  SET_PART_MANUFACTURERS(state, payload) {
    state.part_manufacturers = payload.map(item => {
      return {
        value: item.mfrName,
        label: item.mfrName
      }
    })
  }
}

const actions = {
  async UPLOAD_EXCEL_FILE({ commit }, { formData }) {
    try {
      const { data } = await request({
        url: `/api/importExcel`,
        method: 'post',
        data: formData
      })
      commit('SET_EXCEL_DATA', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async CHECK_PARTS({ commit }, { parts }) {
    try {
      const { data } = await request({
        url: process.env.VUE_APP_CATALOG_API_URL + `/api/articlecheck`,
        method: 'post',
        data: parts
      })
      commit('SET_EXCEL_DATA', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async ADD_PARTS(state, { data }) {
    try {
      return await request({
        url: '/api/product/create',
        method: 'post',
        data: {
          data
        }
      })
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async ADD_MANUAL({ commit } ){
    commit('SET_MANUAL_PARTS', {
      code: "",
      description: "",
      manufacturer: "",
      oem: "",
      price: '',
      product_type: '',
      editable : 1
    })
  },

  async GET_UPLOADED_DATA_FILES({ commit }) {
    try {
      const { data } = await request({
        url: '/api/product/imports',
        method: 'get'
      })
      commit('SET_UPLOADED_DATA_FILES', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },

  async GET_PRODUCTS_BY_DATA_FILE({ commit }, { page, datafile }) {
    try {
      const { data } = await request({
        url: `/api/parts?page=${page}`,
        method: 'post',
        data: {
          data_file: datafile
        }
      })
      commit('SET_PRODUCTS_BY_DATA_FILE', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_PART_MANUFACTURERS({ commit }) {
    try {
      const { data } = await request({
        url: process.env.VUE_APP_CATALOG_API_URL + `/api/list/mfr`,
        method: 'get'
      })
      commit('SET_PART_MANUFACTURERS', data)
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async GET_EXCEL_FILE() {
    try {
      const { data } = await request({
        url: `/api/seller/excel`,
        method: 'post'
      })
      return data?.excel_file || ''
    } catch (e) {
      Message({
        message: e?.response?.data?.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  async UPDATE_PRODUCT(state, { id, product }) {
    try {
      const { data } = await request({
        url: `/api/product/edit/${id}`,
        method: 'put',
        data: product
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
  async REMOVE_DATA_FILE(state, { datafile }) {
    try {
      const { data } = await request({
        url: `api/product/delete/${datafile}`,
        method: 'put'
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
  async DELETE_PRODUCT(state, { ids }) {
    try {
      const { data } = await request({
        url: `api/product/delete`,
        method: 'post',
        data: {
          data: ids
        }
      })
      return data
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
