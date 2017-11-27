<template>
    <div class="aw-page">
        <div class="aw-page-wrapper clearfix">
            <div class="aw-page-main">
                <header class="header">
                    <Menu class="aw-header-nav" mode="horizontal">
                        <div class="layout-logo">
                            <a href="/">
                                <logo></logo>
                            </a>
                        </div>
                    </Menu>
                </header>
                <section class="body">
                    <h2 class="status">{{msg}}
                        <span>404</span>
                    </h2>
                    <p>糟糕了，您要找的页面不存在。。</p>
                    <p>将在<span class="sec">{{second}}</span>秒后返回主页。</p>
                    <p><a href="/">不等了我要立即返回</a></p>
                </section>
            </div>
        </div>
        <div class="aw-page-footer">
            <nav-footer></nav-footer>
        </div>
    </div>
</template>

<script>
import Logo from './Logo.js';
import NavFooter from './NavFooter';

export default {
    data() {
        return {
            msg: 'NotFound',
            status: 404,
            second: 5,
        };
    },
    mounted() {
        const SEC = 1000;
        const timer = setInterval(() => {
            if (0 === -- this.second) {
                clearInterval(timer)
                this.$router.push({path: '/'});
            }
        }, SEC);
    },
    components: { NavFooter, Logo }
}

</script>

<style lang="stylus" scoped>
  @import '../assets/stylus/navheader'

  
  .aw-page
    top 0
    left 0
    width 100%
    height 100%
    overflow auto
    // background #f5f7fc
    position absolute
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    
    .aw-page-wrapper
      width 100%
      min-height 100%
      .aw-page-main
        padding-bottom 130px
    .aw-page-footer
      clear both
      position relative
      margin -101px auto 0 auto

    .header
        border-bottom 1px solid #eee
        box-shadow 0px 3px 6px #eee
    .body
        padding 20px 100px
        h2
            font-size 60px
            font-weight 100
            padding-top 100px
            color #f5fbfc
            text-shadow 2px 1px 6px #ccc
            // text-align center
            span 
                font-size 1.7em
        p
            font-size 16px
            font-weight 800
            .sec
                font-size 1.3em
                font-weight 200
                padding 0 6px
</style>
