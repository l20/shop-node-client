<template>
  <header class="header">
    <Menu class="aw-header-nav" mode="horizontal">
      <div class="layout-logo">
        <a href="/">
          <logo></logo>
        </a>
      </div>
      <div class="layout-nav" @click="menuIsShow = false" :class="{show: menuIsShow}">
        <Menu-item name="1" class="aw-nav-cart navbar-right-container">
          <div class="navbar-menu-container">
            <span v-if="user">
              <em>您好~,</em>
              <Poptip trigger="hover" placement="bottom" v-if="user.role >= 10">
                <em  v-if="user.role < 50">管理员用户</em>
                <em  v-else-if="user.role >= 50">超级管理员用户</em>
                <div class="user-tips-content" slot="content">
                  <router-link class="navbar-link" to="/admin">
                    <em style="margin-right: 10px;">进入后台管理</em><Icon type="ios-home-outline"></Icon>
                  </router-link>
                </div>
              </Poptip>
              <em v-else>用户</em>
              <Poptip trigger="hover" placement="bottom">
                <router-link class="navbar-link" to="/user">
                  {{user.userName}}
                  <sup class="ivu-badge-count" v-if="tips.length > 0">{{ tips.length }}</sup>
                </router-link>
                <div class="user-tips-content" slot="content">
                  <ul v-if="tips.length > 0">
                    <li v-for="(tip, index) in tips" :key="index">
                      <router-link :to="{path: tip.path}">{{ tip.message }}</router-link>
                    </li>
                  </ul>
                  <p v-else style="color: #000;">没有任何消息</p>
                </div>
              </Poptip>
              <Tooltip content="退出登录" placement="bottom">
                <a href="javascript:void(0)" class="navbar-link" @click="signOut">&nbsp;&nbsp;&nbsp;
                  <Icon type="log-out"></Icon>
                </a>
              </Tooltip>
            </span>
            <div v-else>
              <Tooltip content="登录管理我的东西" placement="bottom">
                <a href="javascript:void(0)" class="navbar-link" @click="showModal('登录')">登 录</a>
              </Tooltip>
              <span>&nbsp;&nbsp;</span>
              <Tooltip content="注册发布我的东西" placement="bottom-end">
                <a href="javascript:void(0)" class="navbar-link" @click="showModal('reg')">注 册</a>
              </Tooltip>
            </div>
            <div class="navbar-cart-container" v-if="cartList">
              <span class="navbar-cart-count"></span>
              <a herf="javascript:;" class="navbar-link navbar-cart-link" @click.stop="cartAction" >
                <Poptip trigger="hover" placement="bottom-end" >
                    <a class="navbar-cart-logo">
                      <Icon type="ios-cart"></Icon>
                      <sup class="ivu-badge-count" v-if="cartList.length > 0">{{ cartList.length }}</sup>
                    </a>
                    <div class="user-tips-content" slot="content">
                    <ul class="tips-cart" v-if="cartList.length > 0">
                      <li v-for="(p, index) in cartList" @click.stop.prevent="gotoTheDetail(`/goods/${p._id}`)" :key="index">
                        <a href="javascript:;" >
                        <span class="tips-goods-img"><img :src="'/images/'+p.prodcutImgs" :alt="p.productName"></span>
                        <strong>{{ p.productName }}</strong>
                        </a>
                      </li>
                    </ul>
                    <p v-else-if="user" style="color: #000;">购物车空空如也</p>
                    <p slot="content" v-else style="color: #000;">请登录！</p>
                  </div>
                </Poptip>
              </a>
            </div>
          </div>
        </Menu-item>
      </div>
      <div class="show-menu">
        <a href="####" @click="menuIsShow = true">
          <Icon type="navicon"></Icon>
        </a>
      </div>
    </Menu>
    <login-modal :title="title" :md-show="showModalFlag" :usr-rule-text="showModalFlag" @keypress="logOut" @md-submit="handleSubmit" @md-close="closeModal">
      <div class="ivu-form-item-error-tip aw-error-tip" v-show="modalTip" slot="error-tip">
        <i class="ivu-icon ivu-icon-close-circled"></i>
        <i class="aw-error-tip-text">{{ modalTip }}</i>
      </div>
    </login-modal>
    <regist-modal :md-show="showRegMd" @md-submit="handleSubmit" @md-close="closeModal">
      <div class="ivu-form-item-error-tip aw-error-tip" v-show="modalTip" slot="error-tip">
        <i class="ivu-icon ivu-icon-close-circled"></i>
        <i class="aw-error-tip-text">{{ modalTip }}</i>
      </div>
    </regist-modal>
    <Modal
      v-model="showNotice"
      class-name="confirm modal-body-p"
      :closable="false">
          <p style="padding: 25px;">
            <span class="cart-icon cart-icon-warning">
              <Icon type="information-circled"></Icon>
              </span>先登录再管理自己的购物车。</p>
          <div slot="footer">
              <Row>
                <Col class="confirm-login">
                  <Button long type="error" @click="noticeMdGen.next(false)">关闭</Button>
                </Col>
              </Row>
          </div>
      </Modal>
  </header>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from "vuex";
import loginModal from "@/components/SiginModal";
import registModal from "@/components/RegModal";
import * as utils from "@/assets/js/utils";
import Logo from './Logo.js';
const DEMO_KEY = "DEMO_KEY";

export default {
  data() {
    return {
      num: 0,
      menuIsShow: false,
      noticeMdGen: null,
      showNotice: false,
    };
  },
  computed: {
    ...mapGetters([
      "showModalFlag",
      "showRegMd",
      "nickName",
      "cartList",
      "modalTip",
      "title",
      "tips",
      "user"
    ])
  },
  methods: {
    ...mapActions([
      "logOut",
      "setUser",
      "showModal",
      "hideModal",
      "setNickName",
      "setModalTip",
      "checkLogin",
      "handleSubmit",
      "clearCartList"
    ]),
    closeModal() {
      this.hideModal();
      this.setModalTip("");
    },
    async signOut() {
      const msg = this.$Message.loading({
        content: "正在退出...",
        duration: 0
      });
      let res = await this.logOut();
      if (res) {
        this.$Message.success("退出成功!");
        this.$router.push("/");
      }
      msg();
    },
    cartAction(opt) {
      this.noticeMdGen = this.showNoticMd(opt);
      this.noticeMdGen.next();
    },
    showNoticMd: function*(opt) {
      // 未登录
      if (!this.user) {
        this.showNotice = true;
        if (yield) {
          this.$router.push("/cart");
        }
        this.showNotice = false;
        // 已经登录
      } else {
        this.$router.push("/cart");
      }
    },
    gotoTheDetail(param) {
      this.$router.push(param);
    }
  },
  created() {
    const html = `<p>本站为demo演示,不作为真正电商平台运营,您可以登陆体验本应用.</p>
        <p>账号密码已提供,可点击"登陆"进行体验,提供的默认账号为最高权限账号,可进入<a href="/admin">后台管理</a>平台.仅限浏览,不提供增删改操作.</p>
        <p>默认账号: <strong style="color: red;">root</strong> </p>
        <p>默认密码: <strong style="color: red;">admin123</strong> </p>
        <p>更多的账号可以进入后台"简介"获得,您可以更换不同的账号登陆(权限不同).</p>`;

    let data = utils.queryData(DEMO_KEY);
    if (data && data.remember) {
      this.$Modal.remove();
    } else {
      this.$Modal.info({
        title: "欢迎访问本demo!",
        content: html,
        okText: "不再提示",
        onOk: () => {
          let remember = { remember: true };
          if (utils.addData(DEMO_KEY, remember)) {
            this.demo_md = false;
          }
        }
      });
    }
  },
  components: {
    loginModal,
    registModal,
    Logo,
  }
};
</script>
<style lang="stylus" scoped>
@import '../assets/stylus/navheader';

.tips-goods-img {
  img {
    width: 30px;
  }
}

.tips-cart {
  li {
    a {
      display: table;

      span, strong {
        display: table-cell;
        vertical-align: middle;
      }

      strong {
        padding-left: 15px;
      }
    }
  }
}
</style>