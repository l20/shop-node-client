import * as types from '../mutation-types';
import store from '../';


const state = {
    adm_confirm: true,
    adm_mdVisual: true,
    adm_showNotice: false,
    adm_modal_loading: false,
    adm_modalContent: '',
};

const getters = {
    adm_confirm: state => state.adm_confirm,
    adm_mdVisual: state => state.adm_mdVisual,
    adm_showNotice: state => state.adm_showNotice,
    adm_modalContent: state => state.adm_modalContent,
    adm_modal_loading: state => state.adm_modal_loading,
};
const actions = {
    adm_showModal({ commit }, text) {
       commit(types.ADM_SHOW_HIDE_MODAL, true);
       commit(types.ADM_CONFIRM_CONTENT, text);
    },
    adm_HideModal({ commit }) {
        commit(types.ADM_SHOW_HIDE_MODAL, false);
     },
    adm_Cancel({ commit }) {
        commit(types.ADM_CONFIRM, false);
    },
    adm_Ok({ commit }) {
        commit(types.ADM_CONFIRM, true);
    },
    adm_resetConfirm({ commit }) {
        commit(types.ADM_CONFIRM, '');
    },
    adm_setModalContent({ commit }, text) {
        commit(types.ADM_CONFIRM_CONTENT, text);
    },
};

const mutations = {
    [types.ADM_SHOW_HIDE_MODAL](state, flag) {
        state.adm_showNotice = flag;
    },
    [types.ADM_CONFIRM](state, flag) {
        state.adm_confirm = flag;
    },
    [types.ADM_CONFIRM_CONTENT](state, text) {
        state.adm_modalContent = text;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
