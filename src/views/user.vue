<template>
    <div class="user-container">
        <Row type="flex">
            <Col span="4" class="layout-menu-left">
                <Menu v-if="user" active-name="1-2" width="auto" :active-name="active" :open-names="['/user/home']" @on-select="routeTo">
                    <router-link to="/user/avatar">
                        <div class="avatar">
                            <Poptip placement="right" trigger="hover">
                                <a  
                                class="aw-avatar aw-avatar-large">
                                <img v-if="user.avatar != 'undefined'" :src="avatarUrl">
                                <Icon class="aw-avatar-default" type="person" v-else></Icon>
                                </a>
                                <h4 class="tip" slot="content">设置头像</h4>
                            </Poptip>
                        </div>
                    </router-link>
                    <Submenu name="home">
                        <template slot="title">
                            <Icon type="person"></Icon>
                            {{user.userName}}
                        </template>
                        <MenuItem name="/user/home">选项 1</MenuItem>
                        <MenuItem name="/user/address">选项 2</MenuItem>
                        <MenuItem name="/user/menu">选项 3</MenuItem>
                        <MenuItem name="/user/activate">选项 4</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col span="20">
                <div class="layout-content">
                    <transition mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { hasProperty } from '@/assets/js/utils'
export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters(['user', 'avatar']),
        avatarUrl() {
            return this.avatar || `/images/users/${this.user._id}/avatar/${this.user.avatar}` || false;
        },
        active() {
            let active = this.$route.path;
            if ('/user' === active) active += '/home';

            return active;
        }
    },
    methods: {
        ...mapActions(['changeNavBread']),
        routeTo(e) {
            this.$router.push(e);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (!vm.user) vm.$router.push({path: '*'});
            // print(res);
        });
    },
    mounted() {
        if (this.user) 
            this.changeNavBread(['用户详情', '>', this.user.userName]);
        // this.activation(this);
    },

}
</script>

<style lang="stylus" scoped>
    .user-container
        position relative
    .layout-breadcrumb
        padding 10px 15px 0
    
    .user-container .layout-content
        min-height 200px
        margin 15px
        background #fff
        border-radius 4px
    
    .layout-content-main
        padding 10px
    
    .layout-copy
        text-align center
        padding 10px 0 20px
        color #9ea7b4

    .ivu-menu-light
        background rgba(0,0,0,0)

    .ivu-menu-vertical.ivu-menu-light:after
        background rgba(0,0,0,0)

    .layout-header
        height 60px
        box-shadow 0 1px 1px rgba(0,0,0,.1)
    
    .layout-logo-left
        width 90%
        height 30px
        background #fff
        border-radius 3px
        margin 15px auto
    
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
        color #eebc00
        border-right 2px solid #eebc00
    .ivu-menu-vertical .ivu-menu-submenu-title:hover
        background #f0f0f0
    
    .avatar
        padding 15px 15px 5px 15px 
    .aw-avatar
        text-align: center;
        background: #ccc;
        color: #fff;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        border-radius: 6px;
        line-height: 130px;
        font-size 90px
        // 等宽高
        display block
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        img
            width 100%
    .tip
        font-weight 700
        text-align center
    
    .aw-avatar-default
        display block
        width 120px
</style>
