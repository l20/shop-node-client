<template>
    <div class="activate">
        <center>
            <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style=" margin-top:30px;max-width:510px;border-top:5px solid #eebc00;" class="emailContent">
                <tbody>
                    <tr>
                        <td  style="font-family:'Open Sans', sans-serif;font-weight:400;line-height:26px;font-size:22px;padding:30px 30px 15px;text-align:left;vertical-align: middle;" class="emailBody">
                            <span v-if="status === 0" class="reg-icon reg-icon-success"><Icon type="checkmark-circled"></Icon></span>
                            <span v-else-if="status === 1" class="reg-icon reg-icon-warrning"><Icon type="information-circled"></Icon></span>
                            <span v-else class="reg-icon reg-icon-error"><Icon type="close-circled"></Icon></span>
                            <span>{{activated || '激活错误'}}</span>
                        </td>
                    </tr>
                    <tr v-if="status === 0">
                        <td bgcolor="#ffffff" style="font-family:'Open Sans', sans-serif;font-size:12px;padding:10px 30px;text-align:left;" align="center" class="emailBody">
                            再次感谢您对本平台的支持，现在您可用使用激活的帐号进行登录使用了，您有建议或者意见可以用反馈到以下邮箱。
                        </td>
                    </tr>
                    <tr v-if="status === 0">
                        <td bgcolor="#ffffff" style="font-family:'Open Sans', sans-serif;font-size:12px;padding:10px 30px;text-align:left;" align="center" class="emailBody">
                            <span class="reg-icon-email"><Icon type="email"></Icon></span>：<a href="alanwongs@foxmail.com">alanwongs@foxmail.com</a>
                        </td>
                    </tr>
                    <tr v-else>
                        <td bgcolor="#ffffff" style="font-family:'Open Sans', sans-serif;font-size:12px;padding:10px 30px;text-align:left;" align="center" class="emailBody">
                            <p>将在<span class="sec">{{second}}</span>秒后返回主页.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </center>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { hasProperty } from '@/assets/js/utils'

export default {
    data() {
        return {
            activated: '',
            status: -1,
            second: 5,
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => vm.activation(vm));
    },
    methods: {
        ...mapActions(['changeNavBread', 'checkLogin']),
        async activation(vm) {
            const query = vm.$route.query || {};
            // 监测相关字段是否存在
            // if (!hasProperty(["code", "account"], query)) vm.$router.push({ path: '*' });

            // 激活
            const url = '/v1/user/activation';
            const res = await vm.$http.get(url, { params: query });
            const data = res.data.data || res.data;

            if (200 === data.status && data.success && data.activation) {
                vm.activated = data.message;
                this.status = 0;
                this.checkLogin();
            } else if (data.error) {
                vm.activated = data.error;
                this.status = 1;
                if (data.tokenError) { //激活码错误
                    this.status = -1;
                    vm.$Message.error({
                        content: data.error,
                        duration: 3,
                        onClose: () => {
                            vm.$router.push({ path: '/' });
                        }
                    });
                } else {
                    
                }
            }
        },
        returnHome() {
            const SEC = 1000;
            const timer = setInterval(() => {
            if (0 === -- this.second) {
                clearInterval(timer)
                this.$router.push({path: '/'});
            }
        }, SEC);
        }
    },
    mounted() {
        this.changeNavBread(['帐号激活'])
        // this.activation(this);
        if (1 == this.status || -1 == this.status) {
            this.returnHome();
        }
    }
}
</script>

<style lang="stylus" scoped>
    .reg-icon
        font-size 40px
        padding-right 20px
    .reg-icon-email
        font-size 20px
        color #fbf19b
    td 
        span
            vertical-align middle
    .reg-icon-success
        color #19be6b
    .reg-icon-warrning
        color #ff9900
    .reg-icon-error
        color #ed3f14
        
    .sec
        font-size 1.3em
        font-weight 200
        padding 0 6px
</style>
