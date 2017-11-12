<template>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <Tooltip content="选择条件让物品按照指定条件排序" placement="top">
          <span class="sortby">排序:</span>
        </Tooltip>
        <Tooltip content="此项是默认的" placement="top">
          <a href="javascript:void(0)" class="default cur">常规</a>
        </Tooltip>
        <Tooltip content="点击设置排序方式" placement="top-end">
          <a href="javascript:void(0)" class="price" @click="setSort">根据价格
            <span class="aw-icon" style="color:#000">
              <Icon :type="sortType === 1 ? 'android-arrow-down' : 'android-arrow-up'"></Icon>
            </span>
          </a>
        </Tooltip>
        <a href="javascript:void(0)" @click="showFilterPop" class="filterby stopPop">排序物品</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" @click="showFilterPop" :class="{'filterby-show': filterBy}">
          <dl class="filter-price">
            <dt>选择价格:</dt>
            <dd>
              <a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked==='all'}">所有的</a>
            </dd>
            <dd v-for="(item, index) in priceFilter" :key="index">
              <a href="javascript:void(0)" @click="setPriceFilter({index: index, startPrice: item.startPrice, endPrice: item.endPrice})" :class="{'cur':priceChecked===index}">{{item.startPrice | currency('')}} - {{item.endPrice | currency('')}}</a>
            </dd>
          </dl>
        </div>
        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="goods in goodsList" v-if="goods.productNum > 0" @click="showDetail(goods._id)" :key="goods._id">
                <div class="pic">
                  <a href="#">
                    <img v-lazy="`/images/${goods.prodcutImgs[0]}`" :alt="goods.productName">
                  </a>
                </div>
                <div class="main">
                  <div class="name">{{ goods.productName }}</div>
                  <div class="price">{{ goods.salePrice | currency('￥')}}</div>
                  <div class="btn-area">
                    <button href="javascript:;" class="btn btn--m" @click.stop.prevent="cartAction(goods)">加入购物车</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div 
          class="view-more-normal" 
          v-infinite-scroll="loadMore" 
          infinite-scroll-disabled="busy" 
          infinite-scroll-distance="20">
            <img src="../assets/images/loading-spin.svg" width="50" v-show="loading">
          </div>
          <Modal
            v-model="showNotice"
            class-name="confirm modal-body-p"
            :closable="false">
                <p style="padding: 25px;">
                  <span class="cart-icon cart-icon-warning">
                    <Icon type="information-circled"></Icon>
                    </span>请先登录再加入购物车。</p>
                <div slot="footer">
                    <Row>
                      <Col class="confirm-login">
                        <Button long type="error" @click="noticeMdGen.next(false)">关闭</Button>
                      </Col>
                    </Row>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      page: 0,
      count: 8,
      busy: false,
      loading: false,
      sortFlag: true,
      noticeMdGen: null,
      showNotice: false,
    }
  },
  computed: mapGetters([
    'user',
    'filterBy',
    'sortType',
    'goodsList',
    'goodsTotal',
    'mdShowCart',
    'priceFilter',
    'priceChecked',
  ]),
  methods: {
    ...mapActions([
      'addToCart',    
      'resetParam',
      'hideCartMd',
      'showCartMd',
      'setReqParam',
      'setSortType',
      'getGoodsList',
      'showFilterPop',
      'changeNavBread',
      'resetGoodsList',
      'selectCrntPriceFilter',
    ]),
    // 切换排序方式
    setSort() {
      if (this.sortFlag) {
        this.setSortType(-1);
        this.sortFlag = false;
      } else {
        this.setSortType(1);
        this.sortFlag = true;
      }
      this.page = 1;
      this.resetGoodsList();
      this.fetchGoodsByPage(this.page);
    },
    showDetail(pid) {
      this.$router.push(`/goods/${pid}`);
    },
    setPriceFilter(opt) {
      let param = {}
        , index = opt;
      if ('object' === typeof opt) {
        index = opt.index;
        param = {
          count: this.count,
          type: 'price',
          startPrice: opt.startPrice,
          endPrice: opt.endPrice
        };
      } else {
        this.resetParam();
      }
      this.page = 1;
      // 设置请求参数
      this.setReqParam(param);
      this.resetGoodsList();
      this.selectCrntPriceFilter(index);
      // 请求数据
      this.fetchGoodsByPage();
    },
    loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page ++;
          this.fetchGoodsByPage();
        }, 500);
    },
    async fetchGoodsByPage() {
      let param = {};
      let start = this.page * this.count - this.count;  
      param.count = this.count;
      param.start = start;
      this.setReqParam(param);

      this.loading = true;
      await this.getGoodsList();

      let pageSize = Math.ceil(this.goodsTotal / this.count);
      if (pageSize <= this.page) {
        this.busy = true;
      } else {
        this.busy = false;
      }
      this.loading = false;
    },
    cartAction(goods) {
        this.noticeMdGen = this.showNoticMd(goods);
        this.noticeMdGen.next();
    },
    showNoticMd: function* (goods) {
        // 未登录
        if (!this.user) {
            this.showNotice = true
            if (yield) {    
                // this.addToCart(goods);
            }
            this.showNotice = false;
        // 已经登录
        } else {
            if (goods.productNum > 0) {
              this.addToCart(goods);
            }
        }
    },
    addToCartSuccTip(type) {
      if ('route' === type) {
        this.$router.push('/cart')
      }
      this.hideCartMd();
    }
    // showFilterPop() {
    //   this.filterBy = !this.filterBy;
    // },
  },
  mounted() {
    this.changeNavBread({
      type: 'goods',
      list: true
    });
    this.resetGoodsList();
    
    // this.fetchGoodsByPage();
  },
}
</script>

<style lang="stylus">
  
    .confirm-login
      padding: 5px 20px
  
  .top-reset
    .ivu-modal
      top 0
  .cart-succ
    
    button
      font-size 16px
      &:hover
        color #ee7a23
        border-color #ee7a23
    .btn-base
      background #ee7a23
      border-color #ee7a23
      &:hover
        background #f39e5e
        border-color #f39e5e
        color #fff
  .cart-icon
    font-size 30px
    margin-right 15px
  .cart-icon-warning
    color #ff9900
  .cart-icon-succ
    color #19be6b
  .modal-body-p
    p
      padding: 25px 10px
      font-size: 18px

</style>
