<template>
    <div class="container">
        <div class="page-title-normal">
            <h2 class="page-title-h2">
                <span>结帐</span>
            </h2>
        </div>
        <!-- 进度条 -->
        <step-bar step="4"></step-bar>
        <div class="order-create">
            <div class="order-create-pic"><Icon type="checkmark-circled"></Icon></div>
            <div class="order-create-main">
                <h3>支付成功! <br>您的订单在处理中!</h3>
                <p v-if="_order">
                    <span>订单号：{{_order._id}}</span>
                    <span>订单总额：{{_order.orderTotal|currency('￥')}}</span>
                </p>
                <div class="order-create-btn-wrap">
                    <div class="btn-l-wrap">
                        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
                    </div>
                    <div class="btn-r-wrap">
                        <router-link class="btn btn--m" to="/">返回主页</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StepBar from './StepBar';
export default {
    props: ['order'],
    data() {
        return {
            orderId: '',
            orderTotal: 0
        }
    },
    computed: {
        _order() {
            return JSON.parse(decodeURI(this.order));
        }
    },
    components: { StepBar },
    mounted() {
        this.$Message.success('支付成功！');
        // var orderId = this.$route.query.orderId;
        // console.log("orderId:" + orderId);
        // if (!orderId) {
        //     return;
        // }
        // this.$http.get("/v1/user/order_detail", {
        //     params: {
        //         orderId: orderId
        //     }
        // }).then((response) => {
        //     let res = response.data;
        //     if (res.status == '0') {
        //         this.orderId = orderId;
        //         this.orderTotal = res.result.orderTotal;
        //     }
        // });
    }
}
</script>
