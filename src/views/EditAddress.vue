<template>
    <div class="address-wrap">
        <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <Form-item label="收货人名" prop="userName">
                <Input v-model="formValidate.userName" placeholder="请输入收货人名">
                <span slot="prepend">
                    <Icon type="person-add"></Icon>
                </span>
                </Input>
            </Form-item>
            <Form-item label="街道地址" prop="streetName">
                <Input v-model="formValidate.streetName" placeholder="请输入街道地址">
                <span slot="prepend">
                    <Icon type="location"></Icon>
                </span>
                </Input>
            </Form-item>
            <Form-item label="邮政编码" prop="postCode">
                <Input v-model="formValidate.postCode" placeholder="请输入邮政编码">
                <span slot="prepend">
                    <Icon type="android-mail"></Icon>
                </span>
                </Input>
            </Form-item>
            <Form-item label="收件电话" prop="tel">
                <Input v-model="formValidate.tel" placeholder="请输入收件电话">
                <span slot="prepend">
                    <Icon type="ios-telephone"></Icon>
                </span>
                </Input>
            </Form-item>
            <Form-item class="default-check" label="设为默认地址">
                <div class="cart-item-check">
                    <a href="javascipt:;" 
                    class="checkbox-btn item-check-btn" 
                    :class="checkClass" 
                    @click.stop.prevent="formValidate.isDefault = !formValidate.isDefault">
                        <svg class="icon icon-ok">
                            <use xlink:href="#icon-ok"></use>
                        </svg>
                    </a>
                </div>
            </Form-item>
        </i-form>
        <div slot="footer" class="address-footer">
            <Row type="flex">
                <Col span="11">
                <Button type="ghost" icon="ios-undo" long @click="cancel('formValidate')">取消</Button>
                </Col>
                <Col span="1"></Col>
                <Col span="12">
                <Button type="success" :disabled="!formValues" class="btn-base" @click="ok('formValidate')" icon="ios-paperplane-outline" long>提交</Button>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    props: ['closeThis', 'address'],
    data() {
        const validatepCall = (rule, value, callback) => {
            const mobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            const phone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

            if (!value) {
                return callback(new Error('收件电话不能为空'));
            }
            if (mobile.test(value) || phone.test(value)) {
                // this.$refs.formValidate.fields[2].resetField();
                return callback();
            }
            return callback(new Error('请输入正确的电话号码'));
        };

        return {
            formValidate: {
                userName:  '',
                streetName: '',
                postCode: '' ,
                isDefault: false,
                tel: '',
                type: 'add'
            },
            formValues:  false,
            ruleValidate: {
                userName: [{
                    required: true,
                    message: '收件人名不能为空',
                    trigger: 'blur'
                }],
                streetName: [{
                    required: true,
                    message: '收件地址不能为空',
                    trigger: 'blur'
                }],
                postCode: [{
                    required: false,
                    trigger: 'blur'
                }],
                tel: [{
                    required: true,
                    validator: validatepCall,
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        ...mapActions([
            'changeNavBread',
        ]),
        ok(name) {
            this.$refs[name].validate(async valid => {
                if (valid && this.formValues) {
                    let url = '/v1/user/address';
                    if ('add' === this.formValidate.type) {
                        const res = await this.$http.post(url, this.formValidate);
                        const data = res.data.data || res.data;

                        if (201 === data.status && data.addressList) {
                            this.$store.dispatch('setAddress', data.addressList);
                            this.$Message.success('地址添加成功！');
                            this.$refs[name].resetFields();
                            this.$emit('hide-modal');
                        }
                    } else if ('edit' === this.formValidate.type) {
                        const res = await this.$http.put(url, this.formValidate);
                        const data = res.data.data || res.data;
                    }
                }
            });
        },
        cancel(name) {
            this.$refs[name].resetFields();
            this.formValidate.isDefault = false;
            this.$emit('hide-modal');
        }
    },
    computed: {
        checkClass() {
            return this.formValidate.isDefault ? 'check' : '';
        }
    },
    watch: {
        formValidate: {
            handler(val) {
                this.formValues =
                    !!this.formValidate.userName &&
                    !!this.formValidate.streetName &&
                    !!this.formValidate.tel;
            },
            deep: true
        },
        closeThis(val) {
            if (val) {
                this.$refs.formValidate.resetFields();
                this.formValidate.isDefault = false;
            }
        },
        address(val) {
            Object.assign(this.formValidate, val);
            setTimeout(() => {this.formValues = false}, 100);
        }
    },
    mounted() {
    },

}

</script>
<style lang="stylus" >
    ad_red_light = hsla(26, 86%, 62%, 1)
    ad_red = #ee7a23

   .btn-item
        .ivu-form-item-content
            margin-left 0!important
    .address-editor
        .ivu-modal-header-inner
            font-size 18px
            font-weight 200
    .address-wrap
        .ivu-form-item
            margin-bottom 10px

        .ivu-form-item-label
            padding 6px 
            
        .item-padding
            margin-top 28px

        .ivu-form-item-error-tip
            left unset
            right 0
            top 32px
            z-index 10
        
        .address-footer
            margin-top 35px
        button 
            font-size 16px
            border 1px solid ad_red
            &.ivu-btn-ghost
                color ad_red
                &:hover
                    border 1px solid ad_red_light
                    color ad_red_light
                    
            &.ivu-btn-success
                background ad_red
                &:hover
                    background ad_red_light
                    border 1px solid ad_red_light

        .default-check
            .ivu-form-item-label
                padding-top 10px 

    .address-editor
        .ivu-modal-body
            padding 16px 25px

</style>