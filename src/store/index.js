import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import cart from './modules/cart';
import goods from './modules/goods';
import user from './modules/user';
import common from './modules/common';
import admin from './modules/admin';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    cart,
    user,
    goods,
    admin,
    common,
  },
  strict: debug
});
