import store from './';
import http from 'axios';
import * as types from './mutation-types';
import Vue from 'vue';

// 添加到购物车
export const addToCart = async ({ commit }, product) => {
    const cartList = store.getters.cartList;
    let record = cartList.find(p => p._id === product._id);
    const hasRecord = !!record;
    let quantity = 0, type = 'inc';

    // 已经添加至购物车，增加物品数量
    if (hasRecord) {
        quantity = record.quantity;
        quantity++;
        // 未添加至购物车，添加物品
    } else if (!hasRecord) {
        record = Object.assign({}, product);
        Vue.set(record, 'quantity', 1);
        Vue.set(record, 'checked', '');
        quantity = record.quantity;
    }

    const res = await http.post("/v1/user/cart", {
        goods: record._id,
        quantity: quantity,
        type: type
    });
    let data = res.data.data || res.data;
    if (201 === data.status && data.cartList) {
        commit(types.CART_MD_FLAG, { flag: true });
        hasRecord ?
            commit(types.INC_QUANTITY, { id: record._id }) :
            commit(types.ADD_TO_CART, { product: record });
        // commit(types.UPDATE_CART,  data.cartList); // or updated cartlist
        return true;
    } else {
        return false;
        // commit(types.DEL_CART_BY_ID, product._id);
    }
};

// 增加物品数量
export const increaseQuantity = async ({ commit }, id) => {
    const cartList = store.getters.cartList;
    let record = cartList.find(p => p._id === id);
    let quantity = record.quantity || 0, type = 'inc';
    quantity++;

    const res = await http.post("/v1/user/cart", {
        goods: record._id,
        quantity: quantity,
        type: type
    });
    let data = res.data.data || res.data;
    if (201 === data.status && data.cartList) {
        commit(types.INC_QUANTITY, { id: record._id });
        return true;
    } else {
        return false;
    }
};

// 减少物品数量
export const reduceQuantity = async ({ commit }, id) => {
    const cartList = store.getters.cartList;
    let record = cartList.find(p => p._id === id);
    let quantity = record.quantity || 0, type = 'red';

    if (quantity <= 1) return false;
    quantity--;

    const res = await http.post("/v1/user/cart", {
        goods: record._id,
        quantity: quantity,
        type: type
    });
    let data = res.data.data || res.data;
    if (201 === data.status && data.cartList) {
        commit(types.RED_QUANTITY, { id: record._id });
        return true;
    } else {
        return false;
    }
};

export const delCart = async ({ commit }, { id, quantity }) => {
    const res = await http.delete("/v1/user/cart", {
        params: { cartId: id, quantity }
    });
    const user = res.data.data || res.data;

    if (201 === user.status && user.cartList) {
        commit(types.DEL_CART_BY_ID, { id, quantity });
        return true;
    } else {
        return false;
    }
};

// 检查登录
export const checkLogin = async ({ commit }) => {
    let res = await http.get("/v1/user/check_login")
        , user = res.data.data || res.data;

    if (200 === user.status && !!user.user && user.success) {
        const _user = user.user;
        store.dispatch('setNickName', _user.userName);
        store.dispatch('setTips', { path: '/user/activate' });    
        
        commit(types.SET_USER, _user);

        let cartList = [];
        _user.cartList.forEach(function (element) {

            let obj = Object.assign({}, element.goods);
            let goods = Object.assign(obj, 
                {quantity: element.quantity, cartId: element._id, checked: element.checked});
            cartList.push(goods);
        });

        commit(types.REND_CART_LIST, cartList);
        commit(types.SET_ADDRESS, _user.addressList);
    } else {
        store.dispatch('setNickName', '');
        commit(types.SET_USER, null);
        commit(types.REND_CART_LIST, []);
        commit(types.SET_ADDRESS, []);
    }
};

export const hideModal = ({ commit }) => commit(types.HIDE_MODAL);
export const showModal = ({ commit }, text) => commit(types.SHOW_MODAL, { text });
export const setNickName = ({ commit }, text) => commit(types.SET_NICK_NAME, { text });
export const setModalTip = ({ commit }, text) => commit(types.SET_MODAL_TIP, { text });
export const setLoadingFlag = ({ commit }, flag) => commit(types.SET_LOADING_FLAG, { flag });
export const changeNavBread = ({ commit }, data) => commit(types.CHANGE_NAV_BREAD, data);
