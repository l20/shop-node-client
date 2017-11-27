<template>
    <div>
        <Form class="aw-search-form" ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <FormItem prop="keywords">
                <Input type="text" v-model="formInline.keywords" placeholder="输入关键词检索">
                <Icon type="ios-search-strong" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" icon="funnel" @click="searchGoodsByName('formInline')">检索</Button>
            </FormItem>
            <FormItem v-if="isSearch">
                <Button icon="arrow-return-left" @click="returnList">返回</Button>
            </FormItem>
            <FormItem class="aw-add-product" v-if="user">
                <Button v-if="user.role >= 50" type="success" icon="android-add" @click="routeTo">添加商品</Button>
            </FormItem>
        </Form>
        <Table :data="tableData" :columns="tableColumns" stripe></Table>
        <div v-if="!isSearch" style="margin: 10px;overflow: hidden">
            <div style="text-align: center;">
                <Page :total="count" :current="1" @on-change="changePage" :show-elevator="count >= 50"></Page>
            </div>
        </div>
        <Modal :title="pName" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
import { substring, currency } from "@/assets/js/utils";
import { mapGetters, mapActions } from "vuex";
// import Icon from "iview/src/components/icon/icon";
// import Form from "iview/src/components/form/form";
// import Input from "iview/src/components/input/input";
// import Table from "iview/src/components/table/table";
// import Modal from "iview/src/components/modal/modal";
// import Button from "iview/src/components/button/button";
// import FormItem from "iview/src/components/form/form-item";
const URL = API + "/images/";
const PAGE_SIZE = "";

export default {
  data() {
    return {
      count: 0,
      pName: "",
      imgName: "",
      tableData: [],
      visible: false,
      isSearch: false,
      noticeMdGen: null,
      formInline: {
        keywords: ""
      },
      ruleInline: {
        keywords: [{ required: true, message: " " }]
      },
      tableColumns: [
        {
          title: "索引",
          type: "index",
          width: 66,
          align: "center"
        },
        {
          title: "名称",
          key: "productName",
          render: (h, params) => {
              return h( "span", {
                style: {
                  fontWeight: "bold"
                }
              }, params.row.productName);
          }
        },
        {
          title: "价格",
          key: "salePrice",
          sortable: true,
          filters: [
            { label: "￥50以内", value: 1 },
            { label: "￥50 ~ ￥100",  value: 2 },
            { label: "￥100 ~ ￥200",  value: 3 },
            { label: "￥200 ~ ￥400",  value: 4 },
            { label: "￥400以上",  value: 5 }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.salePrice > 1 && row.salePrice <= 50;
            } else if (value === 2) {
              return row.salePrice >= 50 && row.salePrice <= 100;
            } else if (value === 3) {
              return row.salePrice >= 100 && row.salePrice <= 200;
            } else if (value === 4) {
              return row.salePrice >= 200 && row.salePrice <= 400;
            } else if (value === 5) {
              return row.salePrice > 400 ;
            }
          },
          render: (h, params) => {
            let price = currency(params.row.salePrice, "¥");
            return h(
              "span",
              {
                style: {
                  color: "#ed3f14"
                }
              },
              price
            );
          }
        },
        {
          title: "库存",
          key: "productNum",
          width: 120,
          sortable: true,
          filters: [
            { label: "多于10", value: 1 },
            { label: "多于30",  value: 2 },
            { label: "多于50",  value: 3 },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.salePrice > 10;
            } else if (value === 2) {
              return row.salePrice >= 30 && row.salePrice <= 50;
            } else if (value === 3) {
              return row.salePrice > 50 ;
            } 
          },
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                }
              },
              params.row.productNum
            );
          }
        },
        {
          title: "图片",
          key: "prodcutImgs",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "demo-upload-list"
                }
              },
              [
                h("img", {
                  attrs: {
                    src: "/images/" + params.row.prodcutImgs[0]
                  }
                }),
                h(
                  "div",
                  {
                    attrs: {
                      class: "demo-upload-list-cover"
                    },
                    on: {
                      click: () => {
                        this.handleView(
                          params.row.prodcutImgs[0],
                          params.row.productName
                        );
                      }
                    }
                  },
                  [
                    h("Icon", {
                      attrs: {
                        type: "ios-eye-outline"
                      }
                    })
                  ]
                )
              ]
            );
          }
        },
        {
          title: "简介",
          key: "productDesc",
          render: (h, params) => {
            let str = substring(params.row.productDesc.markdown, 10);
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: "物品简介",
                  content: params.row.productDesc.markdown,
                  placement: "bottom"
                }
              },
              [h("span", str)]
            );
          }
        },
        {
          title: "操作",
          // align: 'center',
          render: (h, params) => {
            if (!this.user || this.user.role < 50) return false;
            return h("div", { class: ["clearfix", "btn-wrap"] }, [
              h("Poptip", {
                  props: {
                    trigger: "hover",
                    content: "编辑此条数据",
                    placement: "bottom"
                  }
                },
                [
                  // 编辑
                  h("i-button", {
                      attrs: {
                        type: "primary",
                        icon: "ios-compose"
                      },
                      style: {
                        // marginRight: '20px'
                      },
                      props: {
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.$router.push({
                            name: "editGoods",
                            params: { productId: params.row._id }
                          });
                        }
                      }
                    }, "编辑")
                ]
              ),
              h("Poptip", {
                  props: {
                    trigger: "hover",
                    content: "删除此条数据",
                    placement: "bottom"
                  }
                },
                [
                  // 删除
                  h("i-button", {
                      attrs: {
                        type: "error",
                        icon: "ios-trash-outline"
                      },
                      class: "admin-goods-del",
                      props: {
                        size: "small"
                      },
                      on: {
                        click: () => {
                          if (this.user.role < 10) {
                            this.$Message.error("错误，您无权限进行操作！");
                            return;
                          }
                          this.adminConfirm(params);
                        }
                      }
                    }, "删除")
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  computed: mapGetters(["user", "adm_mdVisual", "adm_confirm"]),
  async mounted() {
    let data = await this.fetchGoods();
    this.tableData = data.goods;
    this.count = data.count;
  },
  watch: {
    adm_confirm(val) {
      if (val) {
        this.noticeMdGen.next(true);
      }else {
        this.noticeMdGen.next(false);
      }
      this.adm_resetConfirm();
    },
  },
  methods: {
    ...mapActions(["adm_showModal", "adm_HideModal", "adm_resetConfirm"]),
    adminConfirm(params) {
      this.noticeMdGen = this.showNoticMd(params);
      this.noticeMdGen.next();
    },
    showNoticMd: function* (params) {
        // 是否弹出模态框提示  
        if (this.adm_mdVisual) {
            this.adm_showModal("您确定要删除吗？此操作不可恢复哦！！（该操作为模拟操作。）");
            if (yield) {
                this.removeGoods_test(params.row);
            }
            this.adm_HideModal();
        } else {
            this.removeGoods_test(params.row);
        }
    },
    async fetchGoods(start, count) {
      start = start || 0;
      count = count || 10;
      let goods = [];
      let res = await this.$http.get("/v1/goods/list", {
        params: {
          start: start,
          count: count
        }
      });
      let data = res.data.data || res.data;

      if (200 === data.status && data.goods.length > 0) {
        return data;
      }
      return false;
    },
    async changePage(page) {
      let pageSize = PAGE_SIZE || 10;
      let start = page * pageSize - pageSize;

      let data = await this.fetchGoods(start);
      this.tableData = data.goods;
      this.count = data.count;
    },
    handleView(name, pName) {
      this.imgName = URL + name;
      this.pName = pName;
      this.visible = true;
    },
    searchGoodsByName(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.searchGoods(this.formInline.keywords);
          this.$Message.success("提交成功!");
        }
      });
    },
    routeTo(e) {
      this.$router.push("/admin/goods/add");
    },
    async returnList() {
      let data = await this.fetchGoods();
      this.tableData = data.goods;
      this.count = data.count;
      this.isSearch = false;
    },
    async removeGoods(goods) {
      const url = "/v1/admin/goods?pId=" + goods._id;

      let res = await this.$http.delete(url);
      let data = res.data.data || res.data;

      if (200 === data.status && data.success) {
        let ids = this.tableData.map(item => item._id);
        this.tableData.splice(ids.indexOf(goods._id), 1);
      }
    },
    removeGoods_test(goods) {
      setTimeout(() => {
        let ids = this.tableData.map(item => item._id);
        this.tableData.splice(ids.indexOf(goods._id), 1);
        this.$Message.success("删除成功！");
      }, 1000);

    },
    async searchGoods(keywords) {
      const url = "/v1/goods/search";
      let res = await this.$http.get(url, {
        params: { keywords: keywords }
      });

      let data = res.data.data || res.data;
      if (200 === data.status && data.success) {
        this.tableData = data.goods;
        this.isSearch = true;
      }
    }
  },
};
</script>

<style lang="stylus">
.aw-search-form {
    .ivu-form-item-error {
        .ivu-input {
            border-left: 0;
        }

        .ivu-input:focus {
            box-shadow: 2px 0px 0 2px rgba(237, 63, 20, 0.2);
        }
    }

    .ivu-input-group-append, .ivu-input-group-prepend {
        border-radius: 0;
    }

    .aw-add-product {
        float: right;
        margin-right: 0;
    }
}

.demo-upload-list {
    width: 60px;
    height: 60px;
    overflow: hidden;
    background: #fff;
    line-height: 60px;
    margin-right: 4px;
    position: relative;
    border-radius: 4px;
    text-align: center;
    display: inline-block;
    border: 1px solid transparent;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.demo-upload-list img {
    width: 100%;
    height: 100%;
}

.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}

.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.ivu-page-options-elevator input {
    width: 60px !important;
}

.ivu-table-header .ivu-table-cell {
    font-weight: bold;
}

.btn-wrap {
    // width 100%;
    display: flex;

    // > div
    > div:last-child {
        // float right
        margin-left: 5px;
    }

    .admin-goods-del {
        i {
            font-size: 20px;
        }
    }
}

.aw-search-form {
    .ivu-form-item-error {
        .ivu-input:focus {
            box-shadow: none;
        }
    }
}
</style>