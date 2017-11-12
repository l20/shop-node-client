import http from 'axios';
import store from '../';
import * as types from '../mutation-types';

const state = {
    tips: [], // message: 0 未激活，1聊天消息，2订单消息，3付款消息。。。
    user: null,
    avatar: '',
    regSuccess: false,
    addressList: [],
};

const getters = {
    user: state => state.user,
    tips: state => state.tips,
    avatar: state => state.avatar,
    regSuccess: state => state.regSuccess,
};

const actions = {
    // 登录，注册
    async handleSubmit({ commit }, { vm, user }) {

        let url = '/v1/user/';
        if (!!user && user.type === 'signin') {
            url += 'signin';
            var content = '正在登录...';
        } else {
            url += 'signup';
            var content = '提交中...';
        }
        commit(types.SET_REG_FLAG, true);

        const msg = vm.$Message.loading({
            content: content,
            duration: 0
        });

        let res = await http.post(url, { user })
            , _user = res.data.data || res.data
            , status = _user.status
            , $user = _user.user;

        if (user.type === 'signin') {
            if (200 === status && !!$user && _user.success) {
                vm.$Message.success('登录成功！');
                vm.$store.dispatch('hideModal');
                vm.$store.dispatch('setUser', $user);
                vm.$store.dispatch('setNickName', $user.userName);
                vm.$store.dispatch('checkLogin');
                vm.$store.dispatch('setTips', { path: '/user/activate' });
                msg();
                return true;
            } else if ((204 === status && /\bUser\b.*\bnot\b.*exist/g.test(_user.message)) || (417 === status)) {
                msg();
                const str = '用户名或密码错误,请重新输入!';
                vm.$store.dispatch('setModalTip', '用户名或密码错误');
                vm.$Message.error(str);
                return str;
            } else {
                msg();
                vm.$Message.error(_user.message);
                return _user.message;
            }
        } else {
            if (200 === status && _user.signup) {
                vm.$Message.success(_user.message);
                vm.$store.dispatch('hideModal');
                commit(types.SET_REG_FLAG, false);
                msg();
                return true;
            } else {
                vm.$store.dispatch('setModalTip', _user.error);
                commit(types.SET_REG_FLAG, false);
                msg();
                return false;
            }
        }
    },
    async logOut({ commit }) {

        let res = await http.get("/v1/user/logout")
            , user = res.data.data || res.data
            , status = user.status
            , message = user.message;

        if (200 === status && /\bLogout\b.*\bsuccess/g.test(message)) {
            commit(types.SET_NICK_NAME, { text: '' });
            commit(types.SET_USER, null);
            store.dispatch('clearCartList');
            return true;
        }
        return false;
    },
    setUser({ commit }, user) {
        commit(types.SET_USER, user);
    },
    setTips({ commit }, { path }) {
        const user = store.getters.user;
        let msg = {};
        let _tips = []
        if (user && !user.activated) {
            msg = { path: path, message: '未激活' };
            _tips.push(msg);
        }
        commit(types.SET_TIPS, _tips);
    },
    setavatar({ commit }, avatar) {
        commit(types.SET_AVATAR, avatar);
    },
    setAddress({ commit }, addressList) {
        commit(types.SET_ADDRESS, addressList);
    },
};

const mutations = {
    [types.SET_USER](state, user) {
        state.user = user;
    },
    [types.SET_REG_FLAG](state, flag) {
        state.flag = flag;
    },
    [types.SET_TIPS](state, tips) {
        state.tips = tips;
    },
    [types.DEL_TIPS](state, tip) {
        tip = {
            message: 0
        };
        state.tips.push(tip);
    },
    [types.SET_AVATAR](state, avatar) {

        state.avatar = avatar;
    },
    [types.SET_ADDRESS](state, addressList) {
        // 按默认地址排序置顶
        addressList.sort((a, b) => {
            let aVal = a.isDefault == true ? 1 : 0
                , bVal = b.isDefault == true ? 1 : 0;
            return bVal - aVal;
        });
        state.addressList = addressList;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
