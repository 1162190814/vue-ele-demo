import Vue from 'vue'
import Vuex from 'vuex'
import { menus } from '../router/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    // menus:menus
  }
})

export default store

