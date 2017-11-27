<template>
  <div class="aw-cropper" >
    <div class="cropper-contaier" v-if="usable">
        <Card :bordered="false">
            <p slot="title"><Icon type="android-camera"></Icon>上传图片并剪辑设置头像</p>
            <div class="content">
                <p>1.点击“选择”读取图片并剪辑</p>
                <p>2.点击“确定”上传并设置头像(图片格式支持gif、jpg、jpeg、png、bmp、GIF（静态）、JPG、PNG)</p>
                <cropper 
                ref="cropper"
                @realTime="realTime"
                :img="config.img"
                :outputSize="config.size"
                :outputType="config.outputType"
                :info="config.info"
                :canScale="config.canScale"
                :autoCrop="config.autoCrop"
                :autoCropWidth="config.width"
                :autoCropHeight="config.height"
                :fixed="config.fixed"
                :fixedNumber="config.fixedNumber">
                </cropper>
                <div class="ctrl-panel">
                    <label class="ivu-btn ivu-btn-primary" for="uploads"><Icon type="image"></Icon>选择</label>
                    <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                    accept="image/png, image/jpeg, image/gif, image/jpg" @change="openImag">
                    <Button type="primary" :loading="isLoading" icon="ios-crop-strong" :disabled="!!!config.img" @click="uploadImg">确定</Button>
                    <Button type="ghost"  icon="arrow-return-left" @click="cancel">取消</Button>
                </div>
            </div>
          </Card>
    </div>
    <div class="aw-notice" v-else><p>您的浏览器不支持,请使用chrome、firefox或升级高版本浏览器.</p></div>
  </div>
</template>
<script type="text/ecmascript-6">

import cropper from '@/components/zoom';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
        usable: false,
        isLoading: false,
        previews: {},
        config: {
            img: '',
            info: true,
            size: 1,
            outputType: 'jpeg',
            canScale: false,
            autoCrop: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 200,
            autoCropHeight: 200,
            // 开启宽度和高度比例
            fixed: true,
            fixedNumber: [1, 1]
        },
        
    }
  },
  methods: {
    ...mapActions(['setavatar']),
    openImag(e) {
        //上传图片
        // this.option.img
        var file = e.target.files[0]
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            this.$Message.warrning('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
            return false
        }

        var reader = new FileReader()
        reader.onload = (e) => this.config.img = e.target.result;
        reader.readAsDataURL(file)
      
    },
    async uploadImg() {
        if (!this.config.img) return;

        this.isLoading = true;
        const url = '/v1/user/avatar';
        const body = { avatar: this.avatar };
        const res = await this.$http.post(url, body);
        const data = res.data.data || res.data;

        if (201 === data.status && data.avatar) {
            this.$Message.success(data.message);
            this.config.img = '';
        } else if(data.error) {
            this.$Message.error('出错了，请稍候再试吧！');
            this.setavatar('');
        }
        this.isLoading = false;
    },
    realTime (data) {
        this.finish('base64');
    },
    finish (type) {
        // 输出
        if (type === 'blob') {
            this.$refs.cropper.getCropBlob((data) => {
                let test = window.open('')
                let url = window.URL.createObjectURL(data)
                this.setavatar(url);
            })
        } else {
            this.$refs.cropper.getCropData((data) => {
                let url = data
                this.setavatar(url);
            })
        }
    },
    cancel() {
        this.$router.push({path: '/user'});
    }
  },
  created() {
        if(window.FileReader) this.usable = true;
  },
  computed: mapGetters(['showLoading', 'user', 'avatar']),
  components: { 
      cropper,
  }
}
</script>

<style lang="stylus" scoped>
  .content
    height 400px
    width 400px
    margin 5px auto
    margin-bottom 100px
    position relative
    .ctrl-panel
        text-align center
        padding 8px 0
    .aw-notice
        background #ccc
        text-align center
        display table
        font-size 16px
        padding 0 20px
        height 100%
        width  100%
        p 
            display table-cell
            vertical-align middle    
</style>
