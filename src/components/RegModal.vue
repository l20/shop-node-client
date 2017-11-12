<template>
  <Modal class="aw-regist-modal" title="注册账户" v-model="mdIsShow" @on-cancel="handleReset('formInline')">
    <slot name="error-tip"></slot>
    <i-form ref="formInline" :model="formInline" :rules="ruleInline" >
      <FormItem label="邮箱" prop="email">
        <!-- <Input class="aw-modal-password" icon="email" v-model="formInline.email" placeholder="请输入邮箱"></Input> -->
        <AutoComplete
            icon="email"
            class="ivu-input-wrapper ivu-input-type aw-modal-password aw-reg-email"
            v-model="formInline.email"
            @on-search="emailDropDown"
            @on-select="selectEmail"
            placeholder="请输入邮箱"
            :data="emailList"
            >
            <!-- <Option v-for="item in emailList" :value="item" :key="item">{{ item }}</Option> -->
        </AutoComplete>
      </FormItem>
      <Form-item label="用户名" prop="userName">
        <Input class="aw-modal-username" v-model="formInline.userName" icon="person" placeholder="在此输入账号"></Input>
      </Form-item>
      <Form-item label="密码(至少包含数字字母组合或数字字母符号组合8-16位)" prop="userPwd">
        <Input class="aw-modal-password" v-model="formInline.userPwd" type="password" icon="locked" placeholder="在此输入密码"></Input>
      </Form-item>
      <FormItem label="确认密码" prop="passwdCheck">
        <Input class="aw-modal-password" type="password" v-model="formInline.passwdCheck" icon="locked" placeholder="再次输入密码确认"></Input>
      </FormItem>
      <FormItem class="aw-reg-btn">
        <i-button class="aw-login-btn" :loading="regSuccess" :disabled="!formValues" @click.native="handleSubmit('formInline')" long>提交</i-button>
      </FormItem>
    </i-form>
    <div slot="footer"></div>
  </Modal>
</template> 

<script type="text/ecmascript-6">

import { mapGetters } from 'vuex';
import Vue from 'vue';
const  _ = require('lodash/function');
// const object = require('lodash/fp/object');

export default {
  props: [
    "mdShow",
    "title",
  ],
  data() {
    const validatePass = (rule, value, callback) => {
        // 密码级别
        const pawLv1 = /^[0-9a-zA-Z]{8,16}$/;
        const pawLv2 = /^[0-9a-zA-Z`~!@#$%^&*()-_+=\{\}\[\]\;\:\"\'\?\/\\]{8,16}$/;
        if (value === '') {
            callback(new Error('请输入密码'));
            this.validateFlag = false;
        // 密码级别满足任意一种即可
        } else if (!pawLv1.test(value) || !pawLv2.test(value)) {
            callback(new Error('密码至少包含数字和大小写字母或数字和大小字母和符号且8到16位。'));
            this.validateFlag = false;
        } else {
            if (this.formInline.passwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.formInline.validateField('passwdCheck');
            }
            callback();
            this.validateFlag = true;
        }
        
    };
    const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
            this.validateFlag = false;
        } else if (value !== this.formInline.userPwd) {
            callback(new Error('两次输入密码不一致!'));
            this.validateFlag = false;
        } else {
            callback();
            this.validateFlag = true;
        }
    };
    const validateEmail = (rule, value, callback) => {
        this.delayValidate(() => {
            this.$http.post('/v1/user/signup',{ email: value, type: 'check' })
            .then(res => {
                const data = res.data.data || res.data;
                if ('Ok' === data.message && data.success) {
                    callback();
                    this.validateFlag = true;
                } else if (!data.success && data.registered) {
                    callback(new Error('该邮箱已被注册!'));
                    this.validateFlag = false;
                } else {
                    callback();
                    this.validateFlag = true;
                }
            })
        });
    };
    const validateUernam = (rule, value, callback) => {
        // const vm = this;
        this.delayValidate(() => {
            this.$http.post('/v1/user/signup',{ username: value, type: 'check' })
            .then(res => {
                const data = res.data.data || res.data;
                if (200 === data.status && data.success && data.username) {
                    callback();
                    this.validateFlag = true;
                } else if (!data.success && data.registered) {
                    callback(new Error('该帐号已被注册!'));
                    this.validateFlag = false;
                } else {
                    callback();
                    this.validateFlag = true;
                }
            })
        });
    };
    return {
      mdIsShow: false,      // 隐藏显示注册框
      emailAuto: '',        // 邮件自动识别补全
      emailList: [],        // 自动补全邮件列表
      validateFlag: false,  // 表单验证标识
      formValues: false,    // 表单是否都有值
      formInline: {         // 表单数据
        email: '',
        userName: '',
        userPwd: '',
        passwdCheck: ''
      },
      ruleInline: {         // 表单验证规则
          email: [
              { required: true, message: '邮箱不能为空', trigger: 'blur'},
              { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
              { validator: validateEmail, trigger: ''},
          ],
          userName: [
              { required: true, message: '请填写用户名', trigger: 'blur'},
              { validator: validateUernam, trigger: ''},
          ],
        userPwd: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
        }],
         passwdCheck: [{
            required: true,
            validator: validatePassCheck,
            trigger: 'blur'
        }],
      }
    }
  },
  computed: mapGetters(['regSuccess']),
  watch: {
    mdShow(val) {
      this.mdIsShow = val;
      if (!val) this.handleReset('formInline');
    },
    formInline: {
        handler(val) { 
            this.formValues = this.formInline.email &&
            this.formInline.userName &&
            this.formInline.userPwd &&
            this.formInline.passwdCheck &&
            this.formInline.userPwd === this.formInline.passwdCheck &&
            this.validateFlag;
        },
        deep: true
    },
    validateFlag(val) {
        this.formValues = this.formInline.email &&
        this.formInline.userName &&
        this.formInline.userPwd &&
        this.formInline.passwdCheck &&
        this.formInline.userPwd === this.formInline.passwdCheck && val;
    }
  },
  methods: {
    handleSubmit(name) {
        if (this.formValues) {
            let user = {
                userName: this.formInline.userName,
                password: this.formInline.userPwd,
                email: this.formInline.email,
                type: 'registe'
            };
            this.$emit('md-submit', {vm: this, user: user});
        }
    },
    handleReset(name) {
      this.$emit("md-close");
      this.$refs[name].resetFields();
    },
    // 输入@弹出下拉提示
    emailDropDown (value) {
        if (!value) {
            this.emailList = [];
        } else {
            if (value.indexOf('@') >= 0) {
                let values = value.split('@');
                let mail = values[1] && values[1].toLowerCase();
                let mails = [
                    '@qq.com',
                    '@163.com',
                    '@126.com',
                    '@139.com',
                    '@sina.com',
                    '@sohu.com',
                    '@aliyun.com',
                    '@yahoo.com',
                    '@gmail.com',
                    '@foxmail.com',
                    '@hotmail.com',
                ];
                let arr = mails.filter(item => String(item).toLowerCase().indexOf(mail) > -1);
                this.emailList = arr.map(item => values[0] + item);
                // 输入完成不弹出下拉提示
                if (this.emailList.length == 1 && this.formInline.email == this.emailList[0]) {
                    this.emailList = [];
                    return ;                
                };
                this.$refs.formInline.validateField('email');
            } else {
                this.emailList = [];
            }
        }
    },
    selectEmail() {
        // 单独验证email表单
        this.emailList = [];
        // this.$refs.formInline.validateField('email');
    },
    // 防止过于频繁执行
    delayValidate: _.debounce(function(cb) {cb()}, 500),
  },
  mounted() {
    // this.$el.addEventListener('keydown', e => {
    //     if (13 === e.keyCode) {
    //       e.preventDefault()
    //       this.handleSubmit('formInline');
    //     }
    // });
  }

}
</script>