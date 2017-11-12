import * as types from '../mutation-types';
import http from 'axios';
import store from '../';

const state = {
    all: [],
    sortType: 1,
    param: {},
    goodsList: [],
    goodsTotal: 0,
    filterBy: false,
    priceChecked: 'all',
    priceFilter: [{
        startPrice: 0,
        endPrice: 100
    },
    {
        startPrice: 100,
        endPrice: 500
    },
    {
        startPrice: 500,
        endPrice: 1000
    },
    {
        startPrice: 1000,
        endPrice: 5000
    }],
};

const getters = {
    param: state => state.param,
    filterBy: state => state.filterBy,
    sortType: state => state.sortType,
    goodsList: state => state.goodsList,
    goodsTotal: state => state.goodsTotal,
    priceFilter: state => state.priceFilter,
    priceChecked: state => state.priceChecked,
};

const actions = {
    // 请求物品
    async getGoodsList({ commit }, flag) {
        const param = store.getters.param;
        param.sort = store.getters.sortType;
        let res = await http.get('/v1/goods/list', { params: param });
        let data = res.data.data || res.data;
        if (200 === data.status && data.status) {
            let result = data.goods;
            commit(types.SET_GOODS_LIST, { result });
            commit(types.SET_GOODS_TOTAL, data.count);
            return true;
        } else {
            return false;
        }
    },
    showFilterPop({ commit }) {
        commit(types.SHOW_FILTER_POP);
    },
    // 设置表单提交参数
    setReqParam({ commit }, param) {
        commit(types.SET_REQ_PARAM, param);
    },
    // 重置表单提交参数
    resetParam({ commit }) {
        commit(types.RESET_PARAM);
    },
    // 设置排序方式
    setSortType({ commit }, type) {
        commit(types.SET_SORT_TYPE, type);
    },
    // 设置排序方式视图
    selectCrntPriceFilter({ commit }, index) {
        commit(types.SET_PRICE_FILTER, index);
    },
    // 重置物品列表
    resetGoodsList({ commit }) {
        commit(types.RESET_GOODS_LIST);
    },
};

const mutations = {
    [types.SET_GOODS_LIST](state, { result }) {
        state.goodsList = state.goodsList.concat(result);
    },
    [types.SET_PRICE_FILTER](state, index) {
        state.priceChecked = index;
    },
    [types.SHOW_FILTER_POP](state) {
        state.filterBy = !state.filterBy;
    },
    [types.HIDE_MODAL](state) {
        state.showModalFlag = false;
    },
    [types.SET_REQ_PARAM](state, param) {
        state.param = Object.assign(state.param, param);
    },
    [types.RESET_PARAM](state) {
        state.param = {};
    },
    [types.SET_SORT_TYPE](state, sortType) {
        state.sortType = sortType;
    },
    [types.RESET_GOODS_LIST](state) {
        state.goodsList = [];
    },
    [types.SET_GOODS_TOTAL](state, num) {
        state.goodsTotal = num;
    },
    [types.SET_QUANTITY](state, { id, quantity }) {
        const record = state.goodsList.find(p => p._id === id);
        if (record && record.productNum > 0) {
            record.productNum--;
        }
    },
    [types.RED_QUANTITY](state, { id }) {
        const record = state.goodsList.find(p => p._id === id);
        if (record) {
            record.quantity --;
            record.productNum ++;
        }
    },
    [types.INC_QUANTITY](state, { id }) {
        const record = state.goodsList.find(p => p._id === id);
        if (record) {
            record.quantity ++;
            record.productNum --;
        }
    },
    [types.ADD_TO_CART](state, { product }) {
        const record = state.goodsList.find(p => p._id === product._id);
        if (record && record.productNum > 0) {
            record.productNum--;
        }
    },
    [types.DEL_CART_BY_ID](state, { id, quantity }) {
        const record = state.goodsList.find(p => p._id === id);
        if (record) {
            record.productNum += quantity;
        }
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
