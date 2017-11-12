
<template>
    <div class="layout aw-layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu ref="admin-menu" :active-name="setActive" theme="dark" width="auto" @on-select="routeTo">
                    <div class="layout-name">
                        <a href="/admin"><span v-if="spanLeft === 5">后台管理平台</span>
                        <span v-else><Icon type="iphone"></Icon></span></a>
                    </div>
                    <div class="layout-logo-left">
                        <i-button class="aw-menu-btn" type="text" @click.native="toggleClick">
                            <Icon ref="menuIcon" :class="{'menu-open': spanLeft === 5}" type="navicon-round" size="20"></Icon>
                        </i-button>
                    </div>
                    <Menu-item name="/admin/about">
                        <Tooltip content="平台简介" placement="right">
                            <Icon type="ios-home" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.about || '说明'}}</span>
                        </Tooltip>
                    </Menu-item>
                    <Menu-item name="/admin/charts">
                        <Tooltip content="图表统计" placement="right">
                            <Icon type="pie-graph" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.charts }}</span>
                        </Tooltip>
                        <sup class="ivu-badge-count admin-menu-tips red">new</sup>
                    </Menu-item>
                    <template v-if="user">
                    <Submenu class="aw-menu" name="1">
                        <template slot="title">
                        <Tooltip content="物品管理" placement="right">
                            <Icon type="tshirt-outline" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.goods}}</span>
                        </Tooltip>
                        </template>
                        <Menu-item class="aw-menu-item" name="/admin/goods/list">
                        <Tooltip content="展示物品" placement="right">
                            <span class="layout-text">物品列表</span>
                        </Tooltip>
                        </Menu-item>
                        <Menu-item v-if="user.role >= 50" class="aw-menu-item" name="/admin/goods/add">
                        <Tooltip content="添加物品操作" placement="right">
                            <span class="layout-text">添加物品</span>
                        </Tooltip>
                        </Menu-item>
                    </Submenu>
                    <Submenu class="aw-menu" name="2">
                        <template slot="title">
                        <Tooltip content="用户管理" placement="right">
                            <Icon type="person" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.user}}</span>
                        </Tooltip>
                        </template>
                        <Menu-item class="aw-menu-item" name="/admin/user/list">
                        <Tooltip content="展示、操作用户" placement="right">
                            <span class="layout-text">用户列表</span>
                        </Tooltip>
                        </Menu-item>
                        <Menu-item  v-if="user.role >= 50" class="aw-menu-item" name="/admin/user/add">
                        <Tooltip content="添加用户操作" placement="right">
                            <span class="layout-text">添加用户</span>
                        </Tooltip>
                        </Menu-item>
                    </Submenu>
                    <Submenu class="aw-menu" name="3">
                        <template slot="title">
                        <Tooltip content="订单管理" placement="right">
                            <Icon type="document" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.order}}</span>
                        </Tooltip>
                        <sup class="ivu-badge-count green admin-menu-tips">new</sup>
                        </template>
                        <Menu-item class="aw-menu-item" name="/admin/order/list">
                        <Tooltip content="展示、操作订单" placement="right">
                            <span class="layout-text">订单列表</span>
                        </Tooltip>
                        </Menu-item>
                    </Submenu>
                    <Submenu class="aw-menu" name="4">
                        <template slot="title">
                        <Tooltip content="评论管理" placement="right">
                            <Icon type="chatbubble-working" :size="iconSize"></Icon>
                            <span class="layout-text">{{leftTextItems.comment}}</span>
                        </Tooltip>
                        </template>
                        <Menu-item class="aw-menu-item" name="/admin/comment/list">
                        <Tooltip content="用户评论管理" placement="right">
                            <span class="layout-text">评论列表</span>
                        </Tooltip>
                        </Menu-item>
                    </Submenu>
                    </template>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-header clearfix">
                    <h1 class="layout-header-text">{{setTitle}}</h1>
                    <div class="navbar-custom-menu" v-if="user">
                        <ul class="nav navbar-nav"  v-if="user.role >= 10">
                            <li class="dropdown messages-menu">
                                <Dropdown trigger="click"  placement="bottom-end">
                                <a href="#" class="dropdown-toggle">
                                    <Icon type="ios-email-outline"></Icon>
                                    <sup class="ivu-badge-count green">6</sup>
                                </a>
                                <DropdownMenu class="dropdown-menu" style="width: 300px;" slot="list">
                                    <div class="header">你有 6 条订单信息</div>
                                           <div class="dropdown-wrapp">
                                            <DropdownItem>
                                                    <div class="pull-left"><img src="data:image/jpeg;base64,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" alt="User Image" class="img-circle"></div>
                                                    <h4>
                                                        张三
                                                        <small>
                                                           <Icon class="fa fa-clock-o" type="ios-clock-outline"></Icon> 5 分钟前</small>
                                                    </h4>
                                                    <p>拍下了一部小米收件</p>
                                            </DropdownItem>
                                            <DropdownItem>
                                                    <div class="pull-left"><img src="data:image/jpeg;base64,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" alt="User Image" class="img-circle"></div>
                                                    <h4>
                                                       <span>李四</span>
                                                        <small>
                                                            <Icon class="fa fa-clock-o" type="ios-clock-outline"></Icon> 2 小时前</small>
                                                    </h4>
                                                    <p>拍下了一个移动充电宝</p>
                                            </DropdownItem>
                                            <DropdownItem>
                                                    <div class="pull-left"><img src="data:image/jpeg;base64,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" alt="User Image" class="img-circle"></div>
                                                    <h4>
                                                        王五
                                                        <small>
                                                            <Icon class="fa fa-clock-o" type="ios-clock-outline"></Icon> 1天前</small>
                                                    </h4>
                                                    <p>拍下了一台平衡车</p>
                                            </DropdownItem>
                                            <DropdownItem>
                                                    <div class="pull-left"><img src="data:image/jpeg;base64,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" alt="User Image" class="img-circle"></div>
                                                    <h4>
                                                        <span>王乙</span> 
                                                        <small>
                                                            <Icon class="fa fa-clock-o" type="ios-clock-outline"></Icon> 昨天</small>
                                                    </h4>
                                                    <p>拍下了一个自拍杆</p>
                                            </DropdownItem>
                                            <DropdownItem>
                                                    <div class="pull-left"><img src="data:image/jpeg;base64,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" alt="User Image" class="img-circle"></div>
                                                    <h4> 
                                                        <span>李甲</span>
                                                        <small>
                                                            <Icon class="fa fa-clock-o" type="ios-clock-outline"></Icon> 2 天前</small>
                                                    </h4>
                                                    <p>拍下了高保真耳机</p>
                                            </DropdownItem>
                                            </div>
                                    <DropdownItem class="footer"><a href="#">查看所有</a></DropdownItem>
                                </DropdownMenu>
                                </Dropdown>
                            </li>
                            <li class="dropdown notifications-menu">
                                <Dropdown trigger="click"  placement="bottom-end">
                                    <a href="#" class="dropdown-toggle" >
                                        <Icon type="ios-bell-outline"></Icon>
                                        <sup class="ivu-badge-count orange">4</sup>
                                    </a>
                                    <DropdownMenu class="dropdown-menu" style="width: 300px;" slot="list">
                                        <div class="header">你有 4 通知</div>
                                        <div class="dropdown-wrapp">
                                        <DropdownItem>
                                                <i class="fa fa-users text-aqua"></i> 请使用最快的快递公司发货，谢谢！
                                        </DropdownItem>
                                        <DropdownItem>
                                                <i class="fa fa-warning text-yellow"></i> 请开具发票
                                        </DropdownItem>
                                        <DropdownItem>
                                                <i class="fa fa-users text-red"></i> 双十一购物节还有3天
                                        </DropdownItem>
                                        <DropdownItem>
                                                <i class="fa fa-shopping-cart text-green"></i> 登录通知...
                                        </DropdownItem>
                                        </div>
                                        <p class="footer"><a href="#">查看所有</a></p>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>
                            <li class="dropdown tasks-menu">
                                <Dropdown trigger="click"  placement="bottom-end">
                                    <a href="#" class="dropdown-toggle">
                                        <Icon type="ios-flag-outline"></Icon>
                                        <sup class="ivu-badge-count red">4</sup>
                                    </a>
                                    <DropdownMenu class="dropdown-menu" style="width: 300px;" slot="list">
                                        <div class="header">当前还有 4 个任务待处理</div>
                                        <div class="dropdown-wrapp">
                                                <DropdownItem>
                                                        <h3>
                                                            支付组件2.0版本设计
                                                        </h3>
                                                        <Progress :percent="20" :stroke-width="5"></Progress>
                                                </DropdownItem>
                                                <DropdownItem>
                                                        <h3>
                                                            商品详情页组件SEO优化
                                                        </h3>
                                                        <Progress :percent="40" :stroke-width="5"></Progress>
                                                </DropdownItem>
                                                <DropdownItem>
                                                        <h3>
                                                            评论组件回复功能bug修复
                                                        </h3>
                                                        <Progress :percent="60" :stroke-width="5"></Progress>
                                                </DropdownItem>
                                                <DropdownItem>
                                                        <h3>
                                                            登录注册验证码功能实现
                                                        </h3>
                                                        <Progress :percent="80" :stroke-width="5"></Progress>
                                                </DropdownItem>
                                        </div>
                                        <DropdownItem class="footer">
                                            <a href="#">查看所有任务</a>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </li>
                            <li class="dropdown user user-menu">
                            <Dropdown trigger="click"  placement="bottom-end">
                                <a href="#" class="dropdown-toggle">
                                    <img :src="avatar" alt="User Image" class="user-image">
                                    <span class="hidden-xs">{{user.userName}}</span>
                                </a>
                                <DropdownMenu class="dropdown-menu" style="width: 300px;" slot="list">
                                    <DropdownItem class="user-header">
                                        <img v-if="user.avatar != 'undefined'" v-lazy="`/images/users/${this.user._id}/avatar/${this.user.avatar}`">
                                        <img v-else :src="avatar" alt="User Image" class="img-circle">
                                        <p>
                                            你好！{{adminLv}}
                                            {{user.userName}}
                                            <p>
                                                {{require("moment")(user.meta.createAt).format("YYYY-MM-DD")}}
                                            </p>
                                        </p>
                                    </DropdownItem>
                                    <DropdownItem class="user-footer clearfix">
                                        <div class="pull-left">
                                            <Button type="ghost" icon="ios-home-outline">详情</Button>
                                        </div>
                                        <div class="pull-right">
                                            <Button type="primary" @click="signOut" icon="log-out">退出</Button>
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            </li>
                            <li>
                                <a href="#" class="dropdown-toggle">
                                    <Icon type="ios-cog-outline"></Icon>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <Breadcrumb-item>首页</Breadcrumb-item>
                        <!-- <Breadcrumb-item>页面</Breadcrumb-item> -->
                        <Breadcrumb-item v-for="breadText in breadTexts" :key="breadText">{{ breadText }}</Breadcrumb-item>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                        <transition mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                </div>
                <div class="layout-copy">
                    <p>Copyright &copy; 2017 Digital Sale Reserved </p> 
                    <p> 数码特卖后台管理 <a style="color:#999;" href="http://www.miitbeian.gov.cn/" target="_blank">京ICP备17052365号-1</a> </p>
                    <p> <a style="color:#999;" href="http://resume.alphagoo.cn" target="_blank">关于我</a> </p>
                </div>
            </i-col>
        </Row>
        <Modal :value="adm_showNotice" width="300" class-name="vertical-center-modal confirm del-confirm" :closable="false">
            <p style="font-weight: 600;padding: 10px">
                <span class="cart-icon cart-icon-warning">
                <Icon type="help-circled"></Icon>
                </span>
                <span v-if="adm_modalContent" v-text="adm_modalContent"></span> 
                <span v-else>您确定要进行此操作吗？该操作不可恢复！！！</span> 
            </p>
            <div slot="footer">
                <Button type="ghost" @click="adm_Cancel">取消</Button>
                <Button type="error" :loading="modal_loading" @click="adm_Ok">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");
const AVATAR = 'data:image/jpg;base64,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aPH7kncAMg123gHVm0zXEtZ2CpP+5fnjPVD+fH40AfQtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//T9xooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDmPGOqf2R4du7pTiQoUj/3n4H5ZzXzbpGjX+pCSSJfkj+8x6Atwo47seB9a9X+KVzPNLZaPH91j5pHUk52j8ua7Tw94di07T44ZwCQu11xgHuQQeuDyD70AeYwaE95bK9kBI9zbo6KOgmtzh4znocHoaJPB13qytcWtu8YMnmIrrtxnh0wcYKnlexHSvelRE4QAZOePU06gDxyP4ZyHasxTAf5yrH94nTpj5T3HUdj61FrHgG9XTS8bIWtItoC8CZFyRkfwuB9Qa9opKAPm7SdAkk0yaa4I8qS3keMnr+7cAn2K9e+RWVbabePdSWigeZExjcD1wTx/vY49a+k7rRtPu7VbKSICFcgIvyjDAgjjsc8157qnhB/7QgkD4kuroszR5AjjjU7FX3wOT60Acfc3raloouWJF3a4SQ9DhfuN/wCyn8K59J4Lq5S5ZMSE4Kn7rIQf5H9KsXGnXx12XSS2HaQxmRuAz/eGfrWJKTaSqBwynDA88g80APKGMMjcFCRz+tL8quJYWGenHYjpW9pen2+orctKWURxnJAyC3YH0JOMe9YERWDehUEEYyeo5BBFAH034d1T+2NGt788M64cf7S8H9a264H4cMW8OYJyBM4HqOnWu+oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9T3GiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPHviQt3batYajbYDKhVG9HVs9/rW+LL4jfeF9acjIBj6H06VN8RrP7T4akmUAvA6uD7E4P6GvP73xn4p0m0sZ4ZYp4ZwVVTEeNmBhmzknNAHXWXi/WdK1CPSPFluqGRtq3CcLz3PYj6dO4r00EEZHINcjYpP4n0p7TxLZooOOY3DK3upB3KQeorcW7ig1BNKA2hod8ePRCFI/UUAaDyJEpeRgqjqScCuWufGmiRSmC1aS9kBwVtUMnPpkcfrW/fafZanbm1v4lmiJB2sMjIrBvL2XRImsNB0tpfKTfhAI4x7A/xH2AzQBlS/EPTrV8ah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Q+v6pHOkZe0hJ+zQt/y0YfxuvXGeg7jj1rp/Dnge81S6OueKyzM5DLE33m/3vRfRRiul8Kr4dgjlvNLtnitwMm8ucLv/AN0tzt98AV3FtcwXkK3FsweNvusOhHqPUe9AEqqqKEQAADAA6AU6imsyopdyAoGSTwABQA2WWOCNppmCIgJZjwAB3NcZtufGIzIGg0kNkDo9yB6/3Y/bqadEr+LboXTkjSYWwkZGBcsP4z/sA9B3xmu0ACgADAHQUAMjjjhjWKJQqIAFUcAAdAKkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1vcaKKKACiiigAooooAKKKKACiiigAooooAKoahplhqkPkahCky843DJGRgkHsfpV+igDgD4Njt5beFt+oWUCkRwXEmFjYHg4Awwxxg9KZPda1YNJquoRTyC3yIrO1GIQo/jZ/4uO3b0r0KkoA4nQ/FFreqbrUNQtlMnCwIdoT/eZ8Et+QouLlvFl2dMs8/2ZEf9InGQJiP+WaHuv94j6Vv3Ph/Q7yQS3NnC7DuUH6+taqIkaCONQqqMAAYAHsKACONIo1iiUKqgAAcAAdAKfRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//X9xooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=';
export default {
  data() {
    return {
      spanLeft: 5,
      spanRight: 19,
      noticeMdGen: null,
      setTitle: "",
      loading: false,
      avatar: AVATAR,
      modal_loading: false,
      leftTextItems: {
        about: "简介",
        goods: "物品管理",
        user: "用户管理",
        order: "订单管理",
        comment: "评论管理",
        charts: "图表"
      },
      page: [
        "about",
        "list",
        "markdown-viewer",
        "markdown-editor-1",
        "markdown-editor-2",
        "rtf",
        "upload",
        "echarts"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "adm_showNotice", "adm_modalContent"]),
    adminLv() {
      let texts = ["管理员", "初级管理员", "中级管理员", "高级管理员", "超级管理员"];
      let text = "",
        user = this.user;
      if (user) {
        if (user.role >= 10) text = "管理员";
        if (user.role >= 20) text = "初级管理员";
        if (user.role >= 30) text = "中级管理员";
        if (user.role >= 40) text = "高级管理员";
        if (user.role >= 50) text = "超级管理员";
      }
      return text;
    },
    iconSize() {
      return this.spanLeft === 5 ? 14 : 24;
    },
    breadTexts() {
      let text = this.$route.path.replace("/admin/", "");
      return text.split("/");
    },
    setActive() {
      let active = this.$route.path;
      if ("/admin" === active) active += "/about";

      const key = active
        .replace("/admin/", "")
        .replace(/(-([a-z]))/g, (_, __, ___) => ___.toUpperCase())
        .replace(/-/g, "");

      const result =
        key.match(/about/g) ||
        key.match(/goods/g) ||
        key.match(/user/g) ||
        key.match(/order/g) ||
        key.match(/comment/g) ||
        [];

      this.setTitle = this.leftTextItems[result[0]];

      return active;
    }
  },
  methods: {
    ...mapActions([
      "logOut",
      "adm_Ok",
      "adm_Cancel",
      "adm_HideModal",
      "adm_showNoticMd",
      "adm_showModal"
    ]),
    async signOut() {
      const msg = this.$Message.loading({
        content: "正在退出...",
        duration: 0
      });

      let res = await this.logOut();
      if (res) {
        this.$Message.success("退出成功!");
        this.$router.push("/adminLogin");
      }
      msg();
    },
    toggleClick() {
      if (this.spanLeft === 5) {
        this.spanLeft = 1;
        this.spanRight = 23;
      } else {
        this.spanLeft = 5;
        this.spanRight = 19;
      }
    },
    routeTo(e) {
      this.$router.push(e);
    },
    fetchData() {
      this.loading = true;
      // ... the code you wanna run to fetch data
      this.loading = false;
    }
  }
};
</script>

<style>
@import url("../../assets/css/admin.css");
.dropdown-wrapp {
  height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

