<template>
    <div class="loading-container">
        <img class="loading-anmt" src="/static/loading-svg/loading-cylon-red.svg">
    </div>
</template>

<script>
    export default {}
</script>

<style lang="stylus" scoped>
    .loading-container
        background #f5f7fc
        position fixed
        top 0
        right 0
        bottom 0
        left 0
        display flex
        .loading-anmt
         width 30%
         
         margin 0 auto
         display inline-block
</style>
