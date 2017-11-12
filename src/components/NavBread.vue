<template>
    <Menu class="aw-bread-nav" mode="horizontal" active-name="1">
        <div class="bread-wrap">
            <nav class="">
                <router-link to="/">主页</router-link>
                <span v-for="(item, index) in navBread" :class="{current: index === navBread.length-1}" v-text="item" :key="index"></span>
                <!-- <slot></slot> -->
            </nav>
        </div>
    </Menu>
</template>

<style lang="stylus" scoped>
    color-dark = #ee7a23

    .aw-bread-nav
        height 45px
        line-height 45px
        // background-color #f5f7fc
        background-color #f0f0f0
    .bread-wrap
        padding 0 50px
        font-size 14px
        color color-dark
        &:after
            display none
        span
            color #000
            padding 0 5px 
            &.current 
                color #ee7a23

    .bread-wrap a
        position relative
        margin-right 15px

    .bread-wrap a:after
        position absolute
        top 0px
        content '>'
        height 20px
        line-height 20px

</style>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        computed: mapGetters([
            'navBread',
        ]),
        methods: {
            ...mapActions([
                'showModal',
            ]),
        }
    }
</script>
