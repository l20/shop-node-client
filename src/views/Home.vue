<template>
  <div class="aw-page">
    <div class="aw-page-wrapper clearfix">
      <div class="aw-page-main">
        <nav-header></nav-header>
        <nav-bread></nav-bread>
        <router-view></router-view>
      </div>
    </div>
    <div class="aw-page-footer">
      <nav-footer></nav-footer>
    </div>
    <div class="aw-global-mask" @click="showFilterPop" v-show="filterBy"></div>
    <loading v-if="showLoading"></loading>
  </div>
</template>
<script type="text/ecmascript-6">

import NavHeader from '@/components/NavHeader';
import NavBread from '@/components/NavBread';
import NavFooter from '@/components/NavFooter';
import loading from '@/components/loading';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      filterBy: false,
    }
  },
  methods: {
    showFilterPop() { }
  },
  computed: mapGetters(['showLoading']),
  components: {
    NavHeader,
    NavBread,
    NavFooter,
    loading
  }
}
</script>

<style lang="stylus" scoped>
  .aw-page
    top 0
    left 0
    width 100%
    height 100%
    overflow auto
    background #f5f7fc
    position absolute
    .aw-page-wrapper
      width 100%
      min-height 100%
      .aw-page-main
        padding-bottom 100px
    .aw-page-footer
      clear both
      position relative
      margin -101px auto 0 auto

</style>
