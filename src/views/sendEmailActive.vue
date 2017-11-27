<template>
    <div class="user-sendemai-active">
        <Card :bordered="false" >
            <p slot="title" class="title"><Icon type="email"></Icon>发送邮件激活</p>
            <div class="user-sendemai" v-if="user.activateExpire < Date.now()">
                <i-form ref="formInline" :model="formInline" :rules="ruleInline">
                    <Form-item label="激活邮件" prop="email">
                        <AutoComplete
                            icon="email"
                            class="ivu-input-wrapper ivu-input-type aw-modal-password aw-reg-email"
                            v-model="formInline.email"
                            @on-search="emailDropDown"
                            @on-select="selectEmail"
                            placeholder="请输入邮箱"
                            :data="emailList"
                            >
                        </AutoComplete>
                    </Form-item>
                    <Form-item class="default-check" label="">
                        <Button :loading="loading" :disabled="!validateFlag" @click.native="handleSubmit('formInline')" type="ghost" icon="paper-airplane">发送邮件激活</Button>
                    </Form-item>
                </i-form>
            </div>
            <div class="user-sendemai" v-else>
                <h3>
                    <span class="succ-icon"><Icon type="checkmark-circled"></Icon></span>
                    <span>{{resMsg || `激活码已经发送，您请前往${user.email}进行激活。`}} </span> 
                </h3>
            </div>
          </Card>
    </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

const _ = require("lodash/function");

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      const is_email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      this.delayValidate(() => {
        if (!value) return;
        if (!is_email.test(value)) {
          callback("邮箱格式不正确,请重新输入。");
          this.validateFlag = false;
          return;
        }
        this.$http
          .post("/v1/user/email/active", { email: value, type: "check" })
          .then(res => {
            const data = res.data.data || res.data;
            if ("Ok" === data.message && data.success) {
              callback();
              this.validateFlag = true;
            } else if (!data.success && data.registered) {
              callback(new Error("该邮箱已被注册!"));
              this.validateFlag = false;
            } else {
              callback();
              // this.validateFlag = true;
            }
          });
      });
    };
    return {
      emailList: [],
      validateFlag: false,
      loading: false,
      success: false,
      resMsg: "",
      formInline: {
        // 表单数据
        email: ""
      },
      ruleInline: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" },
          { validator: validateEmail, trigger: "" }
        ]
      }
    };
  },
  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["changeNavBread", "checkLogin"]),
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.loading = true;
          const res = await this.$http.post("/v1/user/email/active", {
            email: this.formInline.email
          });
          const data = res.data.data || res.data;
          if (data.success && 200 === data.status && data.message) {
            this.success = true;
            this.resMsg = data.message;
            this.loading = false;
            this.checkLogin();
          }
        }
      });
    },
    emailDropDown(value) {
      if (!value) {
        this.emailList = [];
      } else {
        if (value.indexOf("@") >= 0) {
          let values = value.split("@");
          let mail = values[1] && values[1].toLowerCase();
          let mails = [
            "@qq.com",
            "@163.com",
            "@126.com",
            "@139.com",
            "@sina.com",
            "@sohu.com",
            "@aliyun.com",
            "@yahoo.com",
            "@gmail.com",
            "@foxmail.com",
            "@hotmail.com"
          ];
          let arr = mails.filter(
            item =>
              String(item)
                .toLowerCase()
                .indexOf(mail) > -1
          );
          this.emailList = arr.map(item => values[0] + item);
          // 输入完成不弹出下拉提示
          if (
            this.emailList.length == 1 &&
            this.formInline.email == this.emailList[0]
          ) {
            this.emailList = [];
            screen;
            return;
          }
          this.$refs.formInline.validateField("email");
        } else {
          this.emailList = [];
        }
      }
    },
    selectEmail() {
      this.emailList = [];
      // this.$refs.formInline.validateField('email');
    },
    delayValidate: _.debounce(function(cb) {
      cb();
    }, 500)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.user || vm.user.activated) vm.$router.push({ path: "/user/*" });
      vm.changeNavBread(["用户详情", ">", vm.user.userName, ">", "发送邮件激活"]);
    });
  },
  mounted() {
      if (this.user)
      this.changeNavBread(["用户详情", ">", this.user.userName, ">", "发送邮件激活"]);
    // this.activation(this);
      this.formInline.email = this.user.email;
  },
  
};
</script>
<style lang="stylus" scoped>
.user-sendemai-active {
    .user-sendemai {
        > h3 {
            padding: 60px 10px;
            text-align: center;
            display: table;
            margin: 0 auto;

            > span {
                display: table-cell;
                vertical-align: middle;
            }
        }

        button {
            float: right;
        }

        padding: 30px 80px;
    }

    .title i {
        font-size: 19px;
        margin-right: 10px;
    }

    .succ-icon {
        font-size: 30px;
        padding-right: 20px;

        i {
            color: #19be6b;
        }
    }
}
</style>
