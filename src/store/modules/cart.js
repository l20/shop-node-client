import * as types from '../mutation-types';
import store from '../';
import http from 'axios';
import Vue from 'vue';

const state = {
    cartList: [],
    delItem: {},
    cartCount: 0,
    mdShowCart: false,
};

const getters = {
    mdShowCart: state => state.mdShowCart,
};

const actions = {

    delCartConfirm({ commit }, item) {
        commit(types.DEL_CART_CONFIRM, { item });
    },
    clearCartList({ commit }) {
        let arr = [];
        commit(types.REND_CART_LIST, arr);
    },
    checked({ commit }, goods) {
        commit(types.GOODS_CHECKED, { goods });
    },
    setCheckedByIndex({ commit }, { check, index }) {
        commit(types.SET_CHECKED, { check, index });
    },
    setCartList({ commit }, list) {
        commit(types.REND_CART_LIST, list);
    },
    showCartMd({ commit }) {
        let flag = true;
        commit(types.CART_MD_FLAG, { flag });
    },
    hideCartMd({ commit }) {
        let flag = false;
        commit(types.CART_MD_FLAG, { flag });
    }
};

const mutations = {
    [types.ADD_TO_CART](state, { product }) {
        state.cartList.push(product);
    },
    [types.REND_CART_LIST](state, cartList) {
        state.cartList = cartList;
    },
    [types.DEL_CART_CONFIRM](state, { item }) {
        state.delItem = item;
        state.modalConfirm = true;
    },
    [types.DEL_CART](state) {
        state.modalConfirm = false;
        let delCount = state.delItem.productNum;
        state.cartCount += (-delCount);
    },
    [types.DEL_CART_BY_ID](state, { id }) {
        state.cartList.forEach((item, index) => {
            if (item._id === id) {
                state.cartList.splice(index, 1);
            }
        });
    },
    [types.SET_QUANTITY](state, { id, quantity }) {
        const record = state.cartList.find(p => p._id === id);
        if (record) {
            record.quantity = quantity;
        }
    },
    [types.INC_QUANTITY](state, { id }) {
        const record = state.cartList.find(p => p._id === id);
        if (record) {
            record.quantity ++;
            record.productNum --;
        }
    },
    [types.RED_QUANTITY](state, { id }) {
        const record = state.cartList.find(p => p._id === id);
        if (record) {
            record.quantity --;
            record.productNum ++;
        }
    },
    [types.GOODS_CHECKED](state, { goods }) {
        const record = state.cartList.find(p => p._id === goods._id);
        record.checked = record.checked == "1" ? '0' : '1';
    },
    [types.CART_MD_FLAG](state, { flag }) {
        state.mdShowCart = flag;
    },
    [types.UPDATE_CART](state, products) {
        var _carList = [];
        products.forEach((item) => {
            Vue.set(item.goods, 'quantity', item.quantity);
            _carList.push(item.goods);
        });
        state.cartList = _carList;
    },
    [types.SET_CHECKED](state, { check, index }) {
        state.cartList[index].checked = check;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
