<template>
    <div class="user-list-wrapper">
        <Form class="aw-search-form" ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <FormItem prop="keywords">
                <Input type="text" v-model="formInline.keywords" placeholder="输入关键词检索">
                <Icon type="ios-search-strong" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" icon="funnel" @click="searchUserByName('formInline')">检索</Button>
            </FormItem>
            <FormItem v-if="isSearch">
                <Button icon="arrow-return-left" @click="returnList">返回</Button>
            </FormItem>
            <FormItem v-if="user.role >= 50">
              <Button type="primary" size="large" @click="exportData" icon="ios-download-outline">导出CSV数据</Button>
            </FormItem>
            <FormItem class="aw-add-product" v-if="user">
                <Button v-if="user.role >= 50" type="success" icon="android-add" @click="routeTo">添加用户</Button>
            </FormItem>
        </Form> 
        <Table ref="user" class="user-list" :data="userList" :columns="tableColumns" stripe></Table>
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
import { mapGetters, mapActions } from "vuex";
import { substring, currency } from "@/assets/js/utils";

const moment = require("moment");

const URL = API + "/images/";
const PAGE_SIZE = "";
const defaultAvatar = 'data:image/jpg;base64,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aPH7kncAMg123gHVm0zXEtZ2CpP+5fnjPVD+fH40AfQtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//T9xooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDmPGOqf2R4du7pTiQoUj/3n4H5ZzXzbpGjX+pCSSJfkj+8x6Atwo47seB9a9X+KVzPNLZaPH91j5pHUk52j8ua7Tw94di07T44ZwCQu11xgHuQQeuDyD70AeYwaE95bK9kBI9zbo6KOgmtzh4znocHoaJPB13qytcWtu8YMnmIrrtxnh0wcYKnlexHSvelRE4QAZOePU06gDxyP4ZyHasxTAf5yrH94nTpj5T3HUdj61FrHgG9XTS8bIWtItoC8CZFyRkfwuB9Qa9opKAPm7SdAkk0yaa4I8qS3keMnr+7cAn2K9e+RWVbabePdSWigeZExjcD1wTx/vY49a+k7rRtPu7VbKSICFcgIvyjDAgjjsc8157qnhB/7QgkD4kuroszR5AjjjU7FX3wOT60Acfc3raloouWJF3a4SQ9DhfuN/wCyn8K59J4Lq5S5ZMSE4Kn7rIQf5H9KsXGnXx12XSS2HaQxmRuAz/eGfrWJKTaSqBwynDA88g80APKGMMjcFCRz+tL8quJYWGenHYjpW9pen2+orctKWURxnJAyC3YH0JOMe9YERWDehUEEYyeo5BBFAH034d1T+2NGt788M64cf7S8H9a264H4cMW8OYJyBM4HqOnWu+oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9T3GiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPHviQt3batYajbYDKhVG9HVs9/rW+LL4jfeF9acjIBj6H06VN8RrP7T4akmUAvA6uD7E4P6GvP73xn4p0m0sZ4ZYp4ZwVVTEeNmBhmzknNAHXWXi/WdK1CPSPFluqGRtq3CcLz3PYj6dO4r00EEZHINcjYpP4n0p7TxLZooOOY3DK3upB3KQeorcW7ig1BNKA2hod8ePRCFI/UUAaDyJEpeRgqjqScCuWufGmiRSmC1aS9kBwVtUMnPpkcfrW/fafZanbm1v4lmiJB2sMjIrBvL2XRImsNB0tpfKTfhAI4x7A/xH2AzQBlS/EPTrV8ah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Q+v6pHOkZe0hJ+zQt/y0YfxuvXGeg7jj1rp/Dnge81S6OueKyzM5DLE33m/3vRfRRiul8Kr4dgjlvNLtnitwMm8ucLv/AN0tzt98AV3FtcwXkK3FsweNvusOhHqPUe9AEqqqKEQAADAA6AU6imsyopdyAoGSTwABQA2WWOCNppmCIgJZjwAB3NcZtufGIzIGg0kNkDo9yB6/3Y/bqadEr+LboXTkjSYWwkZGBcsP4z/sA9B3xmu0ACgADAHQUAMjjjhjWKJQqIAFUcAAdAKkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1vcaKKKACiiigAooooAKKKKACiiigAooooAKoahplhqkPkahCky843DJGRgkHsfpV+igDgD4Njt5beFt+oWUCkRwXEmFjYHg4Awwxxg9KZPda1YNJquoRTyC3yIrO1GIQo/jZ/4uO3b0r0KkoA4nQ/FFreqbrUNQtlMnCwIdoT/eZ8Et+QouLlvFl2dMs8/2ZEf9InGQJiP+WaHuv94j6Vv3Ph/Q7yQS3NnC7DuUH6+taqIkaCONQqqMAAYAHsKACONIo1iiUKqgAAcAAdAKfRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//X9xooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=';

export default {
  data() {
    return {
      count: 0,
      pName: "",
      imgName: "",
      userDataBuffer: [],
      userDataList: [],
      userDateFields: {},
      visible: false,
      isSearch: false,
      visibleRegDate: false,
      dateFilerFlag: false,
      createAtDateList: [],
      noticeMdGen: null,
      formInline: {
        keywords: ""
      },
      ruleInline: {
        keywords: [{ message: " " }]
      },
      tableColumns: [],
      userColumns: [
        {
          title: "用户名",
          key: "userName",
          fixed: "left",
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'person'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('strong', params.row.userName)
            ]);
          }
        },
        {
          title: "密码",
          key: "password",
          width: 100,
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: "用户密码",
                  width: 300,
                  content: params.row.password,
                  placement: "bottom-start"
                }
              },
              [h("p",
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
              },
               params.row.password)]
            );
          }
        },
        {
          title: "邮箱",
          key: "email",
          sortable: true,
          fixed: "left",
          width: 100,
          render: (h, params) => {
            let rowLen = this.userList.length;
            let index = params.row._index;
            let placement = rowLen != index+1 ? "bottom" : "top";
            return h("Poptip", {
                props: {
                  trigger: "hover",
                  title: "用户邮箱",
                  width: 200,
                  transfer: true,
                  content: params.row.email,
                  placement: placement
                }
              },
              [h("p",
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
              },
               params.row.email)]
            );
          }
        },
        {
          title: "订单",
          key: "orderList",
          width: 200,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block"
                }
              },
              params.row.orderList
            );
          }
        },
        {
          title: "头像",
          key: "avatar",
          fixed: "left",
          width: 70,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "demo-upload-list avatar-style"
                }
              },
              [
                h("img", {
                  attrs: {
                    src: params.row.avatar == "undefined" ? defaultAvatar : "/images/" + params.row.avatar
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
                        let avatar = params.row.avatar == "undefined" ? defaultAvatar : "/images/" + params.row.avatar;
                        this.handleView(
                          avatar,
                          params.row.userName
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
          title: "权限",
          key: "role",
          sortable: true,
          width: 150,
          render: (h, params) => {
            let color = 'blue'; 
            let text = '普通用户';
            if (!this.user) return;
            if (params.row.role < 10) { color = 'blue'; }
            if (params.row.role >= 10) { color = 'green'; text = '管理员';}
            if (params.row.role >= 20) { color = 'green'; text = '初级管理员';}
            if (params.row.role >= 30) { color = 'yellow'; text = '中级管理员'; }
            if (params.row.role >= 40) { color = 'yellow'; text = '高级管理员';}
            if (params.row.role >= 50) { color = 'red'; text = '超级管理员';}

            // const visual = this.user.role >= 50;
            let component = null;
            if ( params.row.role < this.user.role && params.row._id != this.user._id) {
              component = (
                <dropdown placement="right-start">
                    <dropdown-item>
                        修改用户权限
                        <icon type="ios-arrow-right"></icon>
                    </dropdown-item>
                    <dropdown-menu slot="list">
                        <radio-group 
                          vertical 
                          value={params.row.role} 
                          onInput={val => (params.row.role = val)} 
                          class="user-role-radio">
                          <radio class="roleLv6" label="50"><span>超级管理员</span></radio>
                          <radio class="roleLv5" label="40"><span>高级管理员</span></radio>
                          <radio class="roleLv4" label="30"><span>中级管理员</span></radio>
                          <radio class="roleLv3" label="20"><span>初级管理员</span></radio>
                          <radio class="roleLv2" label="10"><span>管理员</span></radio>
                          <radio class="roleLv1" label="0"><span>用户</span></radio>
                        </radio-group>
                        <div class="user-role-footer"><i-button type="text">设置</i-button></div>
                    </dropdown-menu>
                </dropdown>
              );
            }
            return (
                <dropdown>
                  <tag  color={color} type="dot">
                      { params.row.role }
                  </tag>
                  <dropdown-menu slot="list">
                      <h3 class="user-role-header"><tag  color={color} type="dot">
                      { text }
                      </tag></h3>
                      {component}
                  </dropdown-menu>
              </dropdown>
            );
          }
        },
        {
          title: "已激活",
          key: "activated",
          width: 100,
          render: (h, params) => {
            if (!this.user) return;

            const TRUE = "true" ,FALSE = "false";
            let isTrue = String(params.row.activated) == TRUE ? true : false;
            const component = (<radio-group 
              value={String(isTrue)} 
              onInput={val => (params.row.activated = val)} 
              class="user-role-radio">
              <radio label="false"><span>取消激活</span></radio>
              <radio label="true"><span>激活</span></radio>
            </radio-group>);

            if ( params.row.role < this.user.role && params.row._id != this.user._id) {
              return h("Poptip", {
                props: {
                  trigger: "hover",
                  title: "修改激活状态",
                  // content: 'params.row.addressList',
                  placement: "bottom"
                },
              }, [
                h("Tag", { props: {color: isTrue ? "green" : "red"}}, isTrue ? '是' : '否'),
                h("div", { slot: "content"}, [component]),
              ]);
            } else {
                return h("Tag", { props: {color: isTrue ? "green" : "red"}}, isTrue ? '是' : '否');
            }
          }
        },
        {
          title: "购物车",
          key: "cartList",
          width: 200,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  fontWeight: "bold"
                }
              },
              params.row.cartList
            );
          }
        },
        {
          title: "地址",
          key: "addressList",
          width: 150,
          render: (h, params) => {
            let address = '';
            if (params.row.addressList.length > 0) {
              const defaultAdress = params.row.addressList.find(item => item.isDefault == true);
              address = defaultAdress.userName;
            } 

            return address ? h("Poptip", {
                props: {
                  trigger: "hover",
                  title: address + "的收货地址",
                  // content: 'params.row.addressList',
                  placement: "bottom"
                },
                class: 'address-list',
              },
              [
                h("span", address),
                h("DropdownMenu", { slot: "content"}, 
                  params.row.addressList.map(item => {
                    let dot = null
                      ,title = null
                      ,isDefault = '';
                    if (item.isDefault) {
                      dot = <span style="background: #ed3f14;left: -6px;margin:0;" class="ivu-tag-dot-inner"></span>;
                      title = <h3 style="padding: 5px 0; border-bottom:1px solid #eee;">
                      <p><strong>默认收货地址</strong></p></h3>;
                      isDefault = 'is-default'
                    }
                    return (
                      <dropdown-item class={isDefault}>
                       { dot }
                        <dropdown placement="right-start">
                           <li>
                              <strong>收货人名：</strong> {item.userName}
                                <icon style="margin-left: 10px;" type="ios-arrow-right"></icon>
                            </li>
                            <dropdown-menu slot="list" style="padding: 10px 20px;">
                              {title}
                              <p style="padding: 5px 0;"><icon style="margin-right: 10px;" type="ios-location-outline"></icon><strong>收货地址：</strong>{item.streetName}</p>
                              <p style="padding: 5px 0;"><icon style="margin-right: 10px;" type="ios-email-outline"></icon><strong>邮政编码：</strong>{item.postCode}</p>
                              <p style="padding: 5px 0;"><icon style="margin-right: 10px;" type="ios-telephone-outline"></icon><strong>联系电话：</strong>{item.tel}</p>
                            </dropdown-menu>
                        </dropdown>
                      </dropdown-item>
                    );
                  })
                ),
              ]
            ) : h("span", address || '地址为空');
          }
        },
        {
          title: "发布的商品",
          key: "activated",
          width: 200,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  fontWeight: "bold"
                }
              },
              params.row.activated
            );
          }
        },
        {
          // title: "注册日期",
          width: 170,
          sortable: true,
          key: "createAt",
          render: (h, params) => {
            moment.locale("zh-cn"); 
            // <DatePicker type="date" :options="options1" placeholder="选择日期" style="width: 200px"></DatePicker>
            return h(
              "span",
              {
                style: {
                  //   fontWeight: "bold"
                }
              },
              moment(params.row.createAt).format("YYYY-MM-DD")
            );
          },
          // filterRemote: (value, row) =>{print('===>')},
          renderHeader: (h, params) => {
            const today = moment(Date.now()).format('YYYY-MM-DD');
            return [
              h("span", "注册日期"),
              h("Poptip", {
                  props: {
                    trigger: "click",
                    title: "选择日期",
                    // content: 'params.row.addressList',
                    // value: this.visibleRegDate,
                    placement: "bottom"
                  },
                  class: ["create-date-poptip"],
                  on: {
                      input: (value) => {
                        delayExec(() => this.visibleRegDate = value);
                      }
                  },
                },
                [
                  h("a", { class: ["create-date-filter"]}, [
                    h("Icon", { props: {type: "funnel"} }, null),
                  ]),
                  h("div", { slot: "content", class: ["create-date-wrapper"]}, [
                    h("Row", [
                      h("Col", {props:{span: 24}, class: ["clearfix"]}, [
                        h("DatePicker", {
                          props: {/* value: this.value, */ open: true, type: "daterange", placeholder: String(today), confirm: true}, 
                          style: { width: "100%" },
                          on: {
                            'on-change': (value) => {
                              this.createAtDateList = value;
                              // this.$emit('on-change', value)
                            },
                            'on-ok': (val) => {
                              if (!this.createAtDateList[0] || !this.createAtDateList[1]) return;
                              this.createAtFilter('filter');
                              this.visibleRegDate = false;
                            },
                            'on-clear': () => {
                              this.createAtFilter('clear');
                              this.visibleRegDate = false;
                            }
                          }
                        }, null),
                      ]),
                    ])
                  ]),
              ])

            ];
          },
        },
        {
          title: "操作",
          // align: 'center',
          key: "options",
          fixed: "right",
          width: 165,
          render: (h, params) => {
            let rowLen = this.userList.length;
            let index = params.row._index;
            let placement = rowLen != index+1 ? "bottom" : "top";
            return h("div", { class: ["clearfix", "btn-wrap"] }, [
              h("Poptip", {
                  props: {
                    trigger: "hover",
                    content: "编辑此条数据",
                    transfer: true,
                    placement: placement + '-start'
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
                          if (this.user.role < params.row.role || this.user._id == params.row._id) {
                            this.$Message.error("操作错误，您无权限对该用户进行操作！");
                            return;
                          }
                          this.$router.push({
                            name: "editUser",
                            params: { uId: params.row._id }
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
                    transfer: true,
                    placement: placement + '-end'
                  }
                },
                [
                  // 删除
                  h(
                    "i-button",
                    {
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
                          if (this.user.role < params.row.role || this.user._id == params.row._id) {
                            this.$Message.error("操作错误，您无权限对该用户进行操作！");
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
  computed: {
    ...mapGetters(["user", "adm_mdVisual", "adm_confirm"]),
     userList() {
      if (!this.user){
        this.tableColumns = [];
        return [];
      } 

      // 根据请求的数据过滤渲染表格
      this.tableColumns = [];
       for (let key in this.userDateFields) {
        if (key == '_id') continue;
        this.userColumns.forEach(item => {
          if (this.user.role < 50 && item.key == 'options') return;
          if (item.key == key) this.tableColumns.push(item);
        });
      } 
      
      // 当数据字段小于7个的时候取消横向滚动条
      if (this.tableColumns.length < 7 && this.tableColumns.length > 0) {
        this.userColumns.forEach(item => {
          if (item.hasOwnProperty('fixed')) delete item.fixed;
          if (item.hasOwnProperty('width')) delete item.width;
        });
      }

      // 超级管理员显示操作按钮
      if (this.user.role >= 50) {
        const record = this.tableColumns.find(item => item.key === 'options');
        if(!record) {
          this.tableColumns.push(this.userColumns[this.userColumns.length-1]);
        }
      }
      // 用户名称排序到最前
      this.tableColumns.sort((a, b) => {
        let aVal = a.key == 'meta' ? -1 : 0
            , bVal = b.key == 'userName' ? 1 : 0
        return bVal - aVal;
      });
      
      return this.userDataList
    }, 
  },
  async mounted() {
    let data = await this.fetchUsers();
    if (data) {
      this.userDataList = this.userDataBuffer = data.userList;
      this.count = data.count;
      this.userDateFields = data.userList[0];
    }
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
            this.adm_showModal("您确定要删除该用户吗？（当前为模拟，不是珊瑚真是数据。）");
            if (yield) {
                this.removeUser_test(params.row);
            }
            this.adm_HideModal();
        } else {
            this.removeUser_test(params.row);
        }
    },
    async fetchUsers(start, count) {
      start = start || 0;
      count = count || 10;
      // let goods = [];
      let res = await this.$http.get("/v1/admin/user/list", {
        params: {
          start: start,
          count: count
        }
      });
      let data = res.data.data || res.data;

      if (200 === data.status && data.userList) {
        data.userList.forEach((item) => {
          let createAt = item.meta.createAt;
          delete item.meta;
          item.createAt = createAt;
        });
        return data;
      }
      return false;
    },
    async changePage(page) {
      let pageSize = PAGE_SIZE || 10;
      let start = page * pageSize - pageSize;

      let data = await this.fetchUsers(start);
        
        this.userDataList = this.userDataBuffer = data.userList;
        this.count = data.count;
    },
    handleView(name, pName) {
      this.imgName = name;
      this.pName = pName;
      this.visible = true;
    },
    searchUserByName(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.searchUser(this.formInline.keywords);
          this.$Message.success("提交成功!");
        }
      });
    },
    routeTo(e) {
      if (!this.user || this.user.role < 10) {
        this.$Message.error("权限不足！");
        return;
      };
      this.$router.push("/admin/addGoods");
    },
    async returnList() {
      let data = await this.fetchUsers();
      this.userDataList = this.userDataBuffer = data.userList;
      this.count = data.count;
      this.isSearch = false;
    },
    async removeUser(user) {
      const url = "/v1/admin/user?uId=" + user._id;

      let res = await this.$http.delete(url);
      let data = res.data.data || res.data;

      if (200 === data.status && data.success) {
        let ids = this.userData.map(user => user._id);
        this.userData.splice(ids.indexOf(user._id), 1);
      }
    },
    // 模拟测试用
    removeUser_test(user) {
      setTimeout(() => {
        this.userDataList.forEach((_user, index) => {
          if (_user._id == user._id) {
            this.userDataList.splice(index, 1);
          }
        });
        this.$Message.success("删除成功！");
      }, 1000);
    },  
    async searchUser(keywords) {
      const url = "/v1/admin/user/search";
      let res = await this.$http.get(url, {
        params: { keywords: keywords }
      });

      let data = res.data.data || res.data;
      if (200 === data.status && data.userList) {
        this.userDataList = data.userList;
        this.isSearch = true;
      }
    },
    exportData (type) {
      let fiedsLen = this.userColumns.length;
      this.$refs.user.exportCsv({
          filename: '用户信息',
          columns: this.userColumns.filter((col, index) => col.key != 'options' ),
          data: this.userData
      });
    },
    createAtFilter(type) {
      if ('filter' == type) {
        this.userDataList = this.userDataBuffer.filter(item => { 
          let createAt = dateFm(moment(item.createAt).format('YYYY-MM-DD'));
          return ((dateFm(this.createAtDateList[0]) <= createAt) &&   
                  (dateFm(this.createAtDateList[1]) >= createAt))
        });
      } else {
        this.userDataList = this.userDataBuffer;
      }
    },
  },

};
function dateFm(date) {
  return Date.parse(date);
}
const delayExec = require('lodash/function').debounce(function(cb) {cb()}, 600);

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

.user-list .ivu-table-fixed-body {
  // overflow: initial;
}

.user-list table th {
  font-weight: bold;
}
.user-list .avatar-style {
  width: 40px;
  height: 40px;
  line-height: 40px;
}
.user-list .user-role-radio {
  padding: 10px;
}
.user-role-header .ivu-tag-dot {
    width: 100%;
    border: none!important;
  }
.user-role-footer {
  border-top: 1px solid #eee;
  text-align: right;
}

.roleLv1 { color: #2d8cf0;}
.roleLv2 { color: #19be6b;}
.roleLv3 { color: #19be6b;}
.roleLv4 { color: #ff9900;}
.roleLv5 { color: #ff9900;}
.roleLv6 { color: #ed3f14;}

.address-list .ivu-poptip-body {
  // padding 8px 10px;
}
.address-list .ivu-select-dropdown {
  margin-left: 23px;
  margin-top: -6px;
}
.address-list .ivu-dropdown-item {
  padding-left: 18px;
  padding-right: 6px;
}
.address-list .is-default {
  padding-left: 6px;
  padding-right: 6px;
}
.create-date-filter {
  color: #bbbec4;
  margin-left: 6px;
  &:hover {
    color: #2d8cf0;
  }
}
.create-date-poptip {
  .ivu-input-icon-normal+.ivu-input {
    padding-left: 30px;
  }
  .ivu-poptip-body-content {
    overflow: initial;
  }
  .ivu-select-dropdown{
    box-shadow: none;
  }
}
.create-date-wrapper{
  width: 450px;
  height: 330px;
  padding: 0 10px;
  .ivu-select-dropdown {
    position: relative!important;
    top: 0!important;
  }
  .create-date-footer {
    width: 93%;
    position: absolute;
    bottom: 15px;
    .create-date-footer-inner {
      text-align: right;
    }
  }
}
</style>
