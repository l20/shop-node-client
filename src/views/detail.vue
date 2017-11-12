<template>
    <div class="accessory-result-page accessory-page">
        <div class="container accessory-result">
            <div class="goods-title">
                <h3 class="des_content_tit" v-text="goods.productName"></h3>
            </div> 
            <div class="aw-row clearfix">
                <div class="description_imgs">
                    <ul>
                        <li class="goods-imgs" 
                        v-for="img in goods.prodcutImgs" 
                        @click="showImgZoom(img)" :key="img">
                            <a href="#####" title="点击放大"><img :src="'/images/'+img" ></a>
                        </li>
                    </ul>
                </div>
                <div class="goods-desc" v-if="goods.productDesc">
                    <markdown>{{ goods.productDesc.markdown }}</markdown>
                </div>
            </div>
            <div class="detail-desc">
                <h3 class="des_content_tit goods-name" v-text="goods.productName"></h3>
                <div class="goods-price">{{goods.salePrice | currency('￥')}}</div>
                <Button type="info" icon="chatbubble-working" @click="cartAction('chat')">聊聊</Button>
                <Button type="warning" icon="ios-cart" @click="cartAction('cart')">添加购物车</Button>
            </div>
        </div>
        <comment :pid="this.$route.params.productId"></comment>
        <Modal
            class="img-zoom"    
            v-model="showImg"
            width="100%"
            :styles="{height:'100%',top: 0}">
            <div class="img-zoom-wrap">
                <zoom
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                ></zoom>
            </div>
        </Modal>
        <Modal :value="mdShowCart" @on-cancel="addToCartSuccTip" class-name="confirm cart-succ modal-body-p">
              <p>
                <span class="cart-icon cart-icon-succ"><Icon type="ios-checkmark"></Icon></span><span>加入购物车成功!</span>
              </p>
              <div slot="footer">
                <Row type="flex">
                  <Col span="11">
                    <Button type="ghost" icon="ios-cart-outline" long @click="addToCartSuccTip('close')">继续查看</Button>
                  </Col>
                  <Col span="1"></Col>
                  <Col span="12">
                    <Button type="success" class="btn-base" @click="addToCartSuccTip('route')" icon="card" long>去购物车结算</Button>
                  </Col>
                </Row>
              </div>  
            </Modal>
        <Modal
            v-model="showNotice"
            class-name="confirm modal-body-p"
            :closable="false">
                <p style="padding: 25px;">
                  <span class="cart-icon cart-icon-warning">
                    <Icon type="information-circled"></Icon>
                    </span>请先登录再操作。</p>
                <div slot="footer">
                    <Row>
                      <Col class="confirm-login">
                        <Button long type="error" @click="noticeMdGen.next(false)">关闭</Button>
                      </Col>
                    </Row>
                </div>
            </Modal>
        <chat v-show="chatIsShow" @chat-close="chatIsShow = false"></chat>        
    </div>
</template>

<script>
import zoom from '@/components/zoom';
import chat from '@/components/Chat';
import markdown from 'vue-markdown';
import comment from '@/components/comment';
import { mapGetters, mapActions } from 'vuex';

export default {
    // 路由props传参
    props: ['productId'],
    data() {
        return {
            crap: false,
            showImg: false,
            chatIsShow: false,
            noticeMdGen: null,
            showNotice: false,
            goods: {},
            previews: {},
            option: {},
            downImg: '#'
        }
    },
    computed: mapGetters([
        'user',
        'mdShowCart',
    ]),
    methods: {
        ...mapActions([
            'addToCart',
            'hideCartMd',
            'showCartMd',      
            'changeNavBread',
        ]),
        cartAction(type) {
            this.noticeMdGen = this.showNoticMd(this.goods, type);
            this.noticeMdGen.next();
        },
        addToCartSuccTip(type) {
            if ('route' === type) {
                this.$router.push('/cart')
            }
            this.hideCartMd();
        },
        showNoticMd: function* (goods,type) {
            // 未登录
            if (!this.user) {
                this.showNotice = true
                if (yield) {    
                    // this.addToCart(goods);
                }
                this.showNotice = false;
            // 已经登录
            } else {
                if ('cart' == type) {
                    if (goods.productNum > 0) {
                        this.addToCart(goods);
                    }
                } else if('chat' == type) {
                    this.chatIsShow = true;
                }
            }
        },
        showImgZoom(img) {
            let option = {
                img: '/images/'+ img,
                size: 1,
                outputType: 'jpeg'
            };
            this.option = option;
            this.showImg = true;
        },
        async getGoodsById(id) {
            let res = await this.$http.get('/v1/goods/' + id);
            return res.data.data || res.data;
        },
        async init() {
            const id = this.productId;
            let data = await this.getGoodsById(id);
            if (200 === data.status && data.success) {
                let goods = data.goods;
                goods.type = 'goods';
                this.goods = goods;
                this.changeNavBread(goods);
            }
        }
    },
    watch: {
        'productId' () {
            this.init();
        }
    },
    mounted() {
        this.init();
    },
    components: { 
        zoom,
        chat,
        comment,
        markdown, 
    },
}

</script>
<style lang="stylus">
    .img-zoom
        .img-zoom-wrap
            margin 0 auto
        .ivu-modal-body
            height 100%
        .ivu-modal-header-inner
            color #fff
        .ivu-modal-content
            height 100%
            background-color #555
        .ivu-icon-ios-close-empty
            color #fff
</style>
<style lang="stylus" scoped>
    .goods-title 
        display none
    .comWidth 
        width 1200px;
        margin-left auto;
        margin-right auto;

    .leftArea 
        float left;

    .rightArea 
        float right;

    .hide 
        display none;

    .show 
        display block;

    .aw-row
        width 1200px
        margin 0 auto
        border-top none
        .description_imgs
            ul
                li
                    margin-top 40px
        .goods-imgs
            width 70%
            margin 0 auto
            img
                width 100%
        
    .detail-desc 
        margin 0
        width 400px
        padding-top 40px
        transition right .5s ease-out
        .goods-name
            padding 0
        .goods-price
            padding-top 30px
            padding-bottom 30px
            font-size 16px
            font-weight 600
            color #ed3f14
        button
            width 100%
            margin 10px 0
    .goods-desc
        padding 20px 80px
        p
            font-size 11px
            color #000
            line-height: 1.5;
            font-weight bold
    .img-zoom
        width 100%
        .img-zoom-wrap
            width 90%
            height 100%
            position relative
        
        

    @media only screen and (max-width: 1280px){
        .aw-row {
            width 100%
        }
    }

    @media only screen and (max-width: 767px){
        .container {
            flex-wrap wrap
            .goods-title{
                display block
            }
            .detail-desc{
                .des_content_tit{
                    display none
                }
            }
        }
        .detail-desc {
            width 100%;
            padding-left 10px
            padding-right 10px
        } 
        
        .aw-row {
            .detail-item{
                 width 100%
            }
        }
    }
</style>