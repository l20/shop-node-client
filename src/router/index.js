import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import vm from '../main';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    components: {
      default: resolve => require(['../views/Home.vue'], resolve),
    },
    children: [{
      path: '',
      name: 'Goods',
      component: resolve => require(['../views/Goods.vue'], resolve)
    }, {
      path: '/cart',
      name: 'cart',
      component: resolve => require(['../views/cart.vue'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.user) next();
        else router.push({ path: '*' });
      },
    }, {
      path: 'goods/:productId',
      name: 'detail',
      component: resolve => require(['../views/detail.vue'], resolve),
      props: (route) => ({ productId: route.params.productId }) // 函数式向组件传递pros
    }, {
      path: '/user',
      name: 'user',
      component: resolve => require(['../views/user.vue'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.user) next();
        else router.push({ path: '*' });
      },
      children: [{
        path: '',
        component: resolve => require(['../views/UserDetail.vue'], resolve)
      }, {
        path: 'home',
        name: 'home',
        component: resolve => require(['../views/UserDetail.vue'], resolve),
      }, {
        path: 'activate',
        name: 'activate',
        component: resolve => require(['../views/sendEmailActive.vue'], resolve),
      },{
        path: 'avatar',
        name: 'avatar',
        component: resolve => require(['../views/avatar.vue'], resolve),
      },{
        path: '*',
        component: resolve => require(['../managers/page/notfound.vue'], resolve)
      }]
    }, {
      path: '/address',
      name: 'address',
      component: resolve => require(['../views/Address.vue'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.user) next();
        else router.push({ path: '*' });
      },
    }, {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: resolve => require(['../views/OrderConfirm.vue'], resolve),
      beforeEnter: (to, from, next) => {
        if (store.getters.user) next();
        else router.push({ path: '*' });
      },
    }, {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: resolve => require(['../views/OrderSucc.vue'], resolve),
      props: (route) => ({ order: route.query.order }) // 函数式向组件传递pros
    }, {
      path: '/activate',
      component: resolve => require(['../views/activation.vue'], resolve)
    }]
  }, {
    path: '/admin',
    name: "admin",
    component: resolve => require(['../managers/common/index.vue'], resolve),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('checkLogin');
      let user = store.getters.user;
      if (user && user.role >= 10) next();
      else router.push({ path: '/adminLogin' });
    },
    children: [{
      path: '',
      // redirect: { name: 'about' },
      component: resolve => require(['../managers/common/about.vue'], resolve)
    }, {
      path: 'about',
      name: 'about',
      component: resolve => require(['../managers/common/about.vue'], resolve)
    },
    {
      path: 'charts',
      name: 'charts', 
      component: resolve => require(['../managers/page/echarts.vue'], resolve)
    },
    {
      path: 'goods/list',
      component: resolve => require(['../managers/page/goodsList.vue'], resolve),
    },
    {
      path: 'goods/add',
      name: 'addGoods',
      component: resolve => require(['../managers/page/goodsForm.vue'], resolve),
    },
    {
      path: 'goods/editGoods/:productId',
      name: 'editGoods',
      component: resolve => require(['../managers/page/goodsForm.vue'], resolve),
      props: (route) => ({ productId: route.params.productId }) // 函数式向组件传递pros
    },
    {
      path: 'user/list',
      component: resolve => require(['../managers/page/userList.vue'], resolve),
    },
    {
      path: 'user/add',
      component: resolve => require(['../managers/page/addUser.vue'], resolve),
    },
    {
      path: 'user/editUser/:uId',
      name: 'editUser',
      component: resolve => require(['../managers/page/editUser.vue'], resolve),
      props: (route) => ({ uId: route.params.uId }) // 函数式向组件传递pros
    },
    {
      path: 'order/list',
      component: resolve => require(['../managers/page/orderList.vue'], resolve),
    },
    {
      path: 'comment/list',
      component: resolve => require(['../managers/page/comments.vue'], resolve),
    },
    {
      path: '*',
      component: resolve => require(['../managers/page/notfound.vue'], resolve)
    },
    {
      path: 'markdown-editor-1',
      component: resolve => require(['../managers/page/markdown-editor-1.vue'], resolve)
    },
    {
      path: 'markdown-editor-2',
      component: resolve => require(['../managers/page/markdown-editor-2.vue'], resolve)
    },
    {
      path: 'rtf',
      component: resolve => require(['../managers/page/rtf.vue'], resolve)
    }]
  }, {
    path: '/adminLogin',
    component: resolve => require(['../managers/common/login.vue'], resolve),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('checkLogin');
      let user = store.getters.user;
      if (user && user.role >= 10) router.push({ path: '/admin' });
      else next();
    },
  }, {
    path: '*',
    component: resolve => require(['../components/NotFound.vue'], resolve)
  }
  ]
});

// 此周期vue还未实例化，所以拿不到vue实例
router.beforeEach((to, from, next) => {
  store.dispatch("checkLogin");
  store.dispatch("setLoadingFlag", true);
  next();
});

router.afterEach((to, from) => {
  const user = store.getters.user;
  if (user && !user.activated) {
    // router.push({ path: '/user/activate' });
  }
  store.dispatch("setLoadingFlag", false);
  store.dispatch("setTips", { path: '/user/activate'});
}); 