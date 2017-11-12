<template>
  <Modal class="aw-login-modal" :title="title" v-model="mdIsShow" @on-cancel="handleReset('formInline')">
    <slot name="error-tip"></slot>
    <i-form ref="formInline" :model="formInline" :rules="ruleInline">
      <Form-item prop="userName">
        <Input class="aw-modal-username" v-model="formInline.userName" icon="person" autocomplete="on" placeholder="在此输入账号"></Input>
      </Form-item>
      <Form-item prop="userPwd">
        <Input class="aw-modal-password" v-model="formInline.userPwd" type="password" icon="locked" autocomplete="on" placeholder="在此输入密码"></Input>
      </Form-item>
      <Form-item>
        <i-button class="aw-login-btn" type="success" @click.native="handleSubmit('formInline')" long>{{title}}</i-button>
      </Form-item>
    </i-form>
    <div slot="footer"></div>
  </Modal>
</template> 

<script type="text/ecmascript-6">

import { mapGetters } from 'vuex';
import Vue from 'vue';

export default {
  props: [
    "mdShow",
    "title",
    "usrRuleText",
    "pwdRuleText",
    "pwdRuleTextSub",
  ],
  data() {
    return {
      mdIsShow: false,
      formInline: {
        userName: 'root',
        userPwd: 'admin123',
      },
      ruleInline: {
        userName: [{
          required: true,
          message: '请填写用户名' || this.usrRuleText,
          trigger: 'blur'
        }],
        userPwd: [{
          required: true,
          message: '请填写密码' || this.pwdRuleText,
          trigger: 'blur'
        }, {
          type: 'string',
          min: 6,
          message: '密码长度不能小于6位' || this.pwdRuleTextSub,
          trigger: 'blur'
        }, {
          type: 'string',
          message: this.pwdRuleTextSub,
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    mdShow(val) {
      this.mdIsShow = val;
      if (!val) this.handleReset('formInline');
    },
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let user = {
            userName: this.formInline.userName,
            password: this.formInline.userPwd,
            type: this.title === '登录' ? 'signin' : 'signup'
          };
          this.$emit('md-submit', {vm: this, user: user});
        }
      })
    },
    handleReset(name) {
      this.$emit("md-close");
      this.$refs[name].resetFields();
    },
  },
  mounted() {
    this.$el.addEventListener('keydown', e => {
        if (13 === e.keyCode) {
          e.preventDefault()
          this.handleSubmit('formInline');
        }
    });
  }

}
</script>