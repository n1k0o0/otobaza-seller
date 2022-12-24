import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import dismantles from './modules/dismantles'
import statistics from './modules/statistics'
import catalog from './modules/catalog'
import orders from './modules/orders'
import parts from './modules/parts'
import packages from './modules/packages'
import used from './modules/used'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    dismantles,
    statistics,
    catalog,
    orders,
    parts,
    used,
    packages
  },
  getters
})

export default store
