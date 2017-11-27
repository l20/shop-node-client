<template>
  <div>
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <symbol id="icon-del" viewBox="0 0 32 32">
          <title>delete</title>
          <path class="path1" d="M11.355 4.129v-2.065h9.29v2.065h-9.29zM6.194 29.935v-23.742h19.613v23.742h-19.613zM30.968 4.129h-8.258v-3.097c0-0.569-0.463-1.032-1.032-1.032h-11.355c-0.569 0-1.032 0.463-1.032 1.032v3.097h-8.258c-0.569 0-1.032 0.463-1.032 1.032s0.463 1.032 1.032 1.032h3.097v24.774c0 0.569 0.463 1.032 1.032 1.032h21.677c0.569 0 1.032-0.463 1.032-1.032v-24.774h3.097c0.569 0 1.032-0.463 1.032-1.032s-0.463-1.032-1.032-1.032v0z"></path>
          <path class="path2" d="M10.323 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
          <path class="path3" d="M16 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
          <path class="path4" d="M21.677 9.806c-0.569 0-1.032 0.463-1.032 1.032v14.452c0 0.569 0.463 1.032 1.032 1.032s1.032-0.463 1.032-1.032v-14.452c0-0.569-0.463-1.032-1.032-1.032z"></path>
        </symbol>
        <symbol id="icon-ok" viewBox="0 0 32 32">
          <title>ok</title>
          <path class="path1" d="M31.020 0.438c-0.512-0.363-1.135-0.507-1.757-0.406s-1.166 0.435-1.529 0.937l-17.965 24.679-5.753-5.67c-0.445-0.438-1.035-0.679-1.664-0.679s-1.219 0.241-1.664 0.679c-0.917 0.904-0.917 2.375 0 3.279l7.712 7.6c0.438 0.432 1.045 0.681 1.665 0.681l0.195-0.008c0.688-0.057 1.314-0.406 1.717-0.959l19.582-26.9c0.754-1.038 0.512-2.488-0.538-3.233z"></path>
        </symbol>
      </defs>
    </svg>
    <div class="container">
      <div class="cart" :class="{'has-goods': cartList.length > 0}">
        <div class="page-title-normal">
          <h2 class="page-title-h2">
            <span>购物车</span>
          </h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>东西</li>
                <li>估值</li>
                <li>数量</li>
                <li>总价</li>
                <li>操作</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" :key="item._id">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check':item.checked=='1'}" @click.stop.prevent="editCart('checked',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="'/images/'+item.prodcutImgs" :alt="item.productName">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">
                      <router-link :to="`/goods/${item._id}`">{{item.productName}}</router-link>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice|currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu',item)">-</a>
                        <span class="select-ipt">{{item.quantity}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.quantity*item.salePrice)|currency('￥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <Tooltip content="删除此物品" placement="top-end">
                      <a href="javascript:;" class="item-edit-btn aw-cart-del" @click="delCartConfirm(item)">
                        <svg class="icon icon-del">
                          <use xlink:href="#icon-del"></use>
                        </svg>
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascript:;" @click.prevent="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn" :class="{'check':checkAllFlag}">
                    <svg class="icon icon-ok">
                      <use xlink:href="#icon-ok" />
                    </svg>
                  </span>
                  <span>选择全部</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <strong class="item-total">
                总 值:
                <span class="total-price">{{totalPrice|currency('￥')}}</span>
              </strong>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis':checkedCount==0}" @click="checkOut">付账</a>
              </div>
            </div>
          </div>
        </div>
        <div class="goto-home clearfix" v-if="cartList.length == 0">
          <button class="btn btn-base" @click="goToHome">购物车是空的，去发现好东西</button>
        </div>
      </div>
    </div>
    <Modal v-model="showNotice" width="300" class-name="vertical-center-modal confirm del-confirm" :closable="false">
      <p style="font-weight: 600;padding: 10px">
        <span class="cart-icon cart-icon-warning">
          <Icon type="help-circled"></Icon>
        </span>您确定要删掉以下东西吗？</p>
      <p style="text-align: center;">{{ productName }}</p>
      <div slot="footer">
        <Button type="ghost" @click="noticeMdGen.next(false)">取消</Button>
        <Button type="error" :loading="modal_loading" @click="noticeMdGen.next(true)">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<style lang="stylus" scoped>
.input-sub, .input-add {
  min-width: 40px;
  height: 100%;
  border: 0;
  color: #605F5F;
  text-align: center;
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  background: #f0f0f0;
}

.item-quantity .select-self-area {
  background: none;
  border: 1px solid #f0f0f0;
}

.item-quantity .select-self-area .select-ipt {
  display: inline-block;
  padding: 0 3px;
  width: 30px;
  min-width: 30px;
  text-align: center;
}

.aw-btn-mid {
  display: block;
  margin-bottom: 10px;
}

.item-check-btn.check {
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.cart-item-list {
  .aw-cart-del:hover {
    .icon {
      // color #ed3f14
      fill: #ed3f14;
    }
  }
}

.goto-home {
  width: 100%;
  margin-top: 20px;

  button {
    background-color: #ee7a23;
    color: #fff;
    float: right;
    height: 40px;
    line-height: 40px;

    &:hover {
      background: #f39e5e;
      border-color: #f39e5e;
    }
  }
}

// color #fff
@media only screen and (max-width: 767px) {
  .goto-home {
    border: none;
    position: fixed;
    bottom: 0;
    margin-top: 0;
    left: 0;
    z-index: 101;

    button {
      width: 100%;
    }
  }

  .cart-foot-wrap {
    bottom: 40px;

    .item-total {
      margin-top: 0;
      line-height: 50px;

      .total-price {
        display: inline;
      }
    }
  }

  .has-goods {
    .cart-foot-wrap {
      bottom: 0;
    }
  }
}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

import { currency } from "@/assets/js/utils";
import axios from "axios";
export default {
  data() {
    return {
      productName: "",
      showNotice: false,
      modal_loading: false,
      noticeMdGen: null,
      delCartIsShowMd: true,
      formItem: {
        checkbox: []
      }
    };
  },
  filters: {
    currency: currency
  },
  computed: {
    ...mapGetters(["user", "delItem", "cartList"]),
    checkAllFlag() {
      return this.checkedCount == this.cartList.length && this.cartList.length != 0;
    },
    checkedCount() {
      var i = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") i++;
      });
      return i;
    },
    totalPrice() {
      let money = 0;
      this.cartList.forEach(item => {
        if (item.checked == "1") {
          money += parseFloat(item.salePrice) * parseInt(item.quantity);
        }
      });
      return money;
    }
  },
  methods: {
    ...mapActions([
      "checked",
      "delCart",
      "addToCart",
      "reduceQuantity",
      "changeNavBread",
      "increaseQuantity",
      "setCheckedByIndex"
    ]),
    closeModal() {
      this.showNotice = false;
    },
    delCartConfirm(goods) {
      this.noticeMdGen = this.showNoticMd(goods);
      this.noticeMdGen.next();
    },
    goToHome() {
      this.$router.push("/");
    },
    showNoticMd: function*(opt) {
      if (this.delCartIsShowMd) {
        this.productName = opt.productName;
        this.showNotice = true;
        if (yield) {
          this.modal_loading = true;
          this.delCart({ id: opt._id, quantity: opt.quantity }).then(res => {
            if (res) {
              this.$Message.success("删除成功!");
            } else {
              this.$Message.error("删除失败!");
            }
            this.modal_loading = false;
            this.showNotice = false;
          });
        } else {
          this.showNotice = false;
        }
      } else {
        this.delCart({ id: opt._id, quantity: opt.quantity }).then(res => {
          if (res) {
            this.$Message.success("删除成功!");
          } else {
            this.$Message.error("删除失败!");
          }
        });
      }
    },
    async editCart(type, item) {
      if (!item) {
          this.$Message.error("当前购物车没有物品！");
          return;
        }
      if (type == "add") {
        if (item.productNum <= 0) {
          this.$Message.error("该物品已无库存");
          return;
        }
        this.increaseQuantity(item._id).then(res => {
          if (res) {
            this.$Message.success("增加数量成功!");
          } else {
            this.$Message.error("操作失败!");
          }
        });
      } else if (type == "minu") {
        if (item.quantity <= 1) {
          this.$Message.error("至少有一个物品");
          return;
        }
        this.reduceQuantity(item._id).then(res => {
          if (res) {
            this.$Message.success("减少数量成功!");
          } else {
            this.$Message.error("操作失败!");
          }
        });
      } else {
        let flag = false;
        if (item.checked == "1") {
          flag = false;
        } else {
          flag = true;
        }
        this.checked(item);
        let res = await this.$http.post("/v1/user/check_all", {
          checkAll: flag,
          cartId: item.cartId
        });
        let data = res.data.data || res.data;
        if (201 === data.status && data.success) {
          if (flag) this.$Message.success(`您选择了${item.productName}`);
        } else {
          if (flag) this.$Message.error("选择失败！");
        }
      }
    },
    async toggleCheckAll() {
      if (!this.cartList || this.cartList.length === 0) {
        this.$Message.error("当前购物车没有物品！");
        return;
      }
      var flag = !this.checkAllFlag;
      this.cartList.forEach((item, index) => {
        let check = flag ? "1" : "0";
        this.setCheckedByIndex({ check, index });
      });
      let res = await this.$http.post("/v1/user/check_all", {
        checkAll: flag
      });
      let data = res.data.data || res.data;
      if (201 === data.status && data.success) {
        if (flag) this.$Message.success("您选择了所有物品。");
      } else {
        if (flag) this.$Message.error("选择失败！");
      }
    },
    checkOut() {
      if (this.checkedCount > 0) {
        this.$router.push({ path: "/address" });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.user) vm.$router.push("*");
      vm.changeNavBread(["购物车"]);
    });
  },
};
</script>
