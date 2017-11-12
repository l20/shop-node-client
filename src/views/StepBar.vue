<template>
    <div class="check-step">
        <ul>
            <li :class="{cur: step > index}" v-for="(item, index) in steps" :key="index"><span>{{ item }}</span></li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['texts', 'step', 'lang'],
    data() {
        return {
            defaultSetpsEN: ['Confirm address', 'View your order', 'Make payment', 'Order confirmation'],
            defaultSetpsCN: ['收货地址', '查看订单', '确认付款', '确认订单'],
        }
    },
    computed: {
        steps() {
            return this.lang == 'EN' ? (this.texts || this.defaultSetpsEN ) : (this.texts || this.defaultSetpsCN )
        }
    }
}
</script>
