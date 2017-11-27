<template>
    <div>
        <div class="container">
            <div class="checkout-order">
                <!-- process step -->
                <step-bar step="2"></step-bar>
                <!-- order list -->
                <div class="page-title-normal checkout-title">
                    <h2>
                        <span>订单清单</span>
                    </h2>
                </div>
                <div class="item-list-wrap confirm-item-list-wrap">
                    <div class="cart-item order-item">
                        <div class="cart-item-head">
                            <ul>
                                <li>Order contents</li>
                                <li>Price</li>
                                <li>Quantity</li>
                                <li>Subtotal</li>
                            </ul>
                        </div>
                        <ul class="cart-item-list">
                            <li v-for="item in cartList" v-if="item.checked=='1'" :key="item._id">
                                <div class="cart-tab-1">
                                    <div class="cart-item-pic">
                                        <img v-lazy="'/images/'+item.prodcutImgs" :alt="item.productName">
                                    </div>
                                    <div class="cart-item-title">
                                        <div class="item-name">{{item.productName}}</div>
                                    </div>
                                </div>
                                <div class="cart-tab-2">
                                    <div class="item-price">{{item.salePrice|currency('￥')}}</div>
                                </div>
                                <div class="cart-tab-3">
                                    <div class="item-quantity">
                                        <div class="select-self">
                                            <div class="select-self-area">
                                                <span class="select-ipt">×{{item.quantity}}</span>
                                            </div>
                                        </div>
                                        <div class="item-stock item-stock-no">有现货</div>
                                    </div>
                                </div>
                                <div class="cart-tab-4">
                                    <div class="item-price-total">{{(item.salePrice*item.quantity)|currency('￥')}}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Price count -->
                <div class="price-count-wrap">
                    <div class="price-count">
                        <ul>
                            <li>
                                <span>物品小计:</span>
                                <span>{{subTotal|currency('￥')}}</span>
                            </li>
                            <li>
                                <span>快递:</span>
                                <span>{{shipping|currency('￥')}}</span>
                            </li>
                            <li v-if="discount">
                                <span>优惠:</span>
                                <span>{{discount|currency('￥')}}</span>
                            </li>
                            <li v-if="tax">
                                <span>扣税:</span>
                                <span>{{tax|currency('￥')}}</span>
                            </li>
                            <li class="order-total-price">
                                <span>订单总额:</span>
                                <span>{{orderTotal|currency('￥')}}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="order-foot-wrap">
                    <div class="prev-btn-wrap">
                        <router-link class="btn btn--m" to="/address">上一步</router-link>
                    </div>
                    <div class="next-btn-wrap">
                        <button class="btn btn--m btn--red" @click="payMent">进行支付</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StepBar from './StepBar';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['addressId'],
    data() {
        return {
            shipping: 12,
            discount: 0,
            tax: 0,
            subTotal: 0,
            orderTotal: 0,
        };
    },
    computed: mapGetters(['cartList']),
    created() {
        if (!this.addressId) {
            this.$router.go(-1);   
            this.$Message.error("未选择地址!");
            return;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.cartList.forEach((item) => {
                if (item.checked == '1') {
                    this.subTotal += item.salePrice * item.quantity;
                }
            });

            this.orderTotal = this.subTotal + this.shipping - this.discount + this.tax;
        },
        async payMent() {
            const addressId = this.$route.query.addressId;
            const res = await this.$http.post("/v1/user/pay_ment", {
                addressId: addressId,
                orderTotal: this.orderTotal
            });

            let data = res.data.data || res.data;
            if (201 === data.status && data.order) {
                this.$router.push({
                    path: '/orderSuccess?order=' + encodeURI(JSON.stringify(data.order))
                })
            }
        }
    },
    components: { StepBar }
}
</script>
