
<template>
<div class="aw-admin">
<div class="header"></div>
<h1>登录后台管理系统</h1>
    <div class="login">
        <i-form ref="formInline" :class="{'admin-disabled': formDisabled}"  :model="formInline" :rules="ruleInline">
            <Form-item prop="user">
                <Input v-model="formInline.user" :disabled="formDisabled" placeholder="管理员帐号">
                <span slot="prepend">
                    <Icon type="ios-person-outline"></Icon>
                </span></Input>
            </Form-item>
            <Form-item prop="password">
                <Input v-model="formInline.password" :disabled="formDisabled" type="password" placeholder="管理员密码">
                <span slot="prepend">
                    <Icon type="ios-locked-outline"></Icon>
                </span></Input>
            </Form-item>
            <Form-item class="admin-btn">
                <i-button :disabled="formDisabled"  @click.native="signin('formInline')" long>登录</i-button>
            </Form-item>
        </i-form>
        <div class="error-notic" v-text="errorNotic"></div>
    </div>
</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

const COUNT = 3;
export default {
  data() {
    return {
      errorNotic: "",
      formDisabled: false,
      formInline: {
        user: "root",
        password: "admin123"
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请填写密码",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: mapGetters(["user"]),
  methods: {
    ...mapActions(["logOut"]),
    async signin(name) {
      this.$refs[name].validate(async valid => {
        if (valid && !this.formDisabled) {
          let result = false;
          // 普通用户已经登录，普通用户先退出
          if (this.user && this.user.role < 10) {
            result = await this.logOut();
          }

          let user = {
            userName: this.formInline.user,
            password: this.formInline.password
          };

          let url = "/v1/admin/signin";
          const msg = this.$Message.loading({
            content: "正在登录...",
            duration: 0
          });

          let res = await this.$http.post(url, { user }),
            _user = res.data.data || res.data,
            status = _user.status,
            $user = _user.user;

          if (200 === status && !!$user && _user.success) {
            this.$Message.success("登录成功！");
            this.$store.dispatch("setUser", $user);
            this.$store.dispatch("checkLogin");
            this.$router.push("/admin");
          } else if (
            (204 === status &&
              /\bUser\b.*\bnot\b.*exist/g.test(_user.message)) ||
            417 === status
          ) {
            let count = COUNT - Number(_user.errorCount);
            this.errorNotic = "用户名或密码错误,请重新输入，还可以尝试" + count + "次。";
          } else if ("00001" === status && _user.error) {
            this.formDisabled = true;
            this.errorNotic = _user.message;
          } else {
            this.errorNotic = _user.message;
          }
          msg();
        } else {
          this.errorNotic = "请填写帐号和密码再登录。";
        }
      });
    },
    handleReset(val) {
      console.log(val);
    }
  },
  mounted() {
    this.$el.addEventListener('keydown', e => {
        if (13 === e.keyCode) {
          e.preventDefault()
          this.signin('formInline');
        }
    });
  },

};
</script>
<style>
@import url("../../assets/css/admin.css");
</style>
