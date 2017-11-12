import * as types from '../mutation-types';
import store from '../';

const DATA_IS_GOODS = 'goods';
const DATA_IS_USER = 'user';


const state = {
    title: '',
    nickName: '',
    modalTip: '',
    showRegMd: false,
    showLoading: false,
    showModalFlag: false,
    navBread: [],
    
};

const getters = {};
const actions = {};

const mutations = {
    [types.SHOW_MODAL](state, { text }) {
        state.title = text;
        if ('reg' === text) {
            state.showRegMd = true;
        } else {
            state.showModalFlag = true;
        }
    },
    [types.CHANGE_NAV_BREAD](state, data) {
        if (DATA_IS_GOODS === data.type) {
            let arr =[];
            if (data.list) {
                arr = ['东西']
            } else {
                arr = ['东西', '>', data.productName];
            }
            state.navBread = arr;
        } else {
            state.navBread = data;
        }
    },
    [types.HIDE_MODAL](state) {
        state.showRegMd = false;
        state.showModalFlag = false;
    },
    [types.SET_NICK_NAME](state, { text }) {
        state.nickName = text;
    },
    [types.SET_MODAL_TIP](state, { text }) {
        state.modalTip = text;
    },
    [types.SET_LOADING_FLAG](state, { flag }) {
        state.showLoading = flag;
    },
  
};

export default {
    state,
    getters,
    actions,
    mutations
};
