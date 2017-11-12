<style lang="stylus">   
 .form 
    width 100%
 .editor-content
    min-height 200px
    margin-top 30px
    .ivu-form-item-content
        .ql-editor
            min-height 200px

 .words-exceed
    box-shadow 0px 1px 10px #ed3f14
    .ql-toolbar.ql-snow,
    .ql-container.ql-snow,
    .v-note-wrapper .v-note-op,
    .v-note-wrapper .v-note-panel
        border 1px solid #ed3f14!important


 .aw-admin-form
    .aw-desc-tip
        position: absolute;
        bottom 50px
        left: 0;
        line-height: 1;
        padding-top: 6px;
        color: #ed3f14;

    .aw-upload-img-tip
        .ivu-icon
            margin-right 6px
    
    .aw-word-tag
        display inline-block
        position absolute
        right 10px
        bottom 20px
        span 
            font-weight bold
    .aw-words-exceed
        span 
            font-size 18px
            color #ed3f14        
 .demo-upload-list
    width 60px
    height 60px
    overflow hidden
    background #fff
    line-height 60px
    margin-right 4px
    position relative
    border-radius 4px
    text-align center
    display inline-block
    border 1px solid transparent
    box-shadow 0 1px 1px rgba(0,0,0,.2)

.demo-upload-list img
    width 100%
    height 100%

.demo-upload-list-cover
    display none
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    background rgba(0,0,0,.6)

.demo-upload-list:hover .demo-upload-list-cover
    display block

.demo-upload-list-cover i
    color #fff
    font-size 20px
    cursor pointer
    margin 0 2px

.ivu-alert-with-desc
    border-radius 0
.ivu-form-item-validating .ivu-input-icon-validate
    display none

.aw-require-field .ivu-form-item-label:before
    content '*'
    display inline-block
    margin-right 4px
    line-height 1
    font-family SimSun
    font-size 12px
    color #ed3f14

</style>

<template>
    <div class="form aw-admin-form">
        <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
            <Form-item label="物品名称" prop="productName">
                <Input v-model="formValidate.productName" placeholder="请输入物品名称"></Input>
            </Form-item>
            <Form-item label="销售价格" prop="salePrice">
                <Input v-model="formValidate.salePrice" placeholder="请输入销售价格"></Input>
            </Form-item> 
            <Form-item label="物品库存" prop="productNum">
                <Input v-model="formValidate.productNum" placeholder="请输入库存数量"></Input>
            </Form-item>
            <Form-item label="物品图片" class="aw-require-field"  prop="productImg">
                <Alert v-if="showImgAlertFlag" show-icon  closable @on-close="notShowImgAlert" style="width:450px">
                    图片要求
                    <span slot="close">不再提示</span>
                    <template slot="desc">图片最佳尺寸为800 x 800或者其他等宽高方形图片，格式jpg、jpeg、png、gif，最多5张图片。</template>
                </Alert>
                <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Tooltip content="上传物品图片" placement="right">
                    <Upload 
                    multiple 
                    ref="upload" 
                    :max-size="2048" 
                    :show-upload-list="false"
                    :default-file-list="defaultList" 
                    :on-success="handleSuccess"
                    :on-exceeded-size="handleMaxSize" 
                    :before-upload="handleBeforeUpload" 
                    :on-format-error="handleFormatError" 
                    :format="['jpg','jpeg','png', 'gif']" 
                    name="goodsImg" type="drag" 
                    action="/v1/admin/goods_images" 
                    style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                </Tooltip>
                <span v-if="imgFieldIsNull" class="ivu-form-item-error-tip aw-upload-img-tip"><Icon type="ios-information"></Icon>至少上传一张图片</span>
                <Modal title="查看图片" v-model="visible">
                    <img :src="imgName" v-if="visible" style="width: 100%">
                </Modal>
            </Form-item>
            <Form-item label="物品介绍" class="aw-require-field"  prop="productDesc">
                <Menu mode="horizontal" :active-name="setActive" @on-select="selectComponet">
                    <div class="layout-assistant">
                        <MenuItem name="MarkdownEditor">Markdown模式</MenuItem>
                        <MenuItem name="Rtf">富文本编辑模式</MenuItem>
                    </div>
                </Menu>
                <div class="editor-content" :class="{'words-exceed': canNumOfWords < 0}">
                    <component 
                    :is="currentView" 
                    :desc-html="descHTML" 
                    :desc-mkd="descMkd"
                    :editable="editable"
                    @aw-update="updateDesc" 
                    @aw-save="saveForm">
                    </component>
                </div>
                <span v-if="descFieldIsNull" class=" aw-desc-tip"><Icon type="ios-information"></Icon>至少输入20个以上字符</span>
                <div class="aw-word-tag" v-if="canNumOfWords >= 0">还可以输入<span class="aw-word-num">{{canNumOfWords}}</span>字。</div>
                <div class="aw-word-tag aw-words-exceed" v-else>字数超出了<span class="aw-word-num">{{Math.abs(canNumOfWords)}}</span>字。</div>
               
                <i-button type="primary" @click.native="handleSubmit('formValidate')" icon="paper-airplane">提交</i-button>
                <i-button v-if="!isEditMode" type="ghost" @click.native="handleReset('formValidate')" style="margin-left: 8px" icon="refresh">重置</i-button>
                <i-button v-else type="ghost" @click.native="returnToList" style="margin-left: 8px" icon="arrow-return-left">返回</i-button>
            </Form-item>
        </i-form>

    </div>
</template>

<script>
import {
    addData,
    delData,
    updateData,
    queryData,
    clearData,
    getStrleng,
    substring,
    isNull
} from '@/assets/js/utils';
import h2m from 'h2m';
import { mapGetters, mapActions } from "vuex";
import MarkdownEditor from './markdown-editor';
import Rtf from './rtf';

const FORM_KEY = 'ADD_GOODS';
// const IMGS_KEY = 'IMGS_LIST';
const URL = API + '/images/';
const MAX_WORDS = 800;

export default {
    props: ['productId'],
    data() {
        const validatepNum = (rule, value, callback) => {
            let pNum = Number(value)
            if (!value) {
                return callback(new Error('数量不能为空'));
            } 
            if (!Number.isInteger(pNum)) {
                // this.$refs.formValidate.fields[2].resetField();
                return callback(new Error('请输入正确的整数值'));
            } 
            if (pNum <= 0) {
                return callback(new Error('请输入正确的整数值'));
            }
            callback();
                        
        };
        const validatepPrice = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('价格不能为空'));
            }
            let pPrice = Number(value)
            if (!Number.isInteger(pPrice)) {
                // print(this.$refs.props);
                // this.$refs.formValidate.fields[2].resetField();
                return callback(new Error('请输入正确的整数值'));
            } 
            callback();
        };
      
        return {
            descHTML: '',
            descMkd: '',
            editable: true,
            setActive: 'MarkdownEditor',
            currentView: 'MarkdownEditor',
            canNumOfWords: MAX_WORDS,
            showImgAlertFlag: true,
            imgFieldIsNull: false,
            descFieldIsNull: false,
            isEditMode: false,
            imgName: '',
            product: {},
            visible: false,
            uploadList: [],
            defaultList: [],
            imagesList: {},
            editorOption: {},
            formValidate: {
                productName: '',
                salePrice: '',
                productNum: '',
            },
            formFields: {
                pDesc: false,
                pImages: false,
            },
            ruleValidate: {
                productName: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                salePrice: [{
                    required: true,
                    validator: validatepPrice,
                    trigger: 'blur'
                }],
                productNum: [{
                    required: true,
                    validator: validatepNum,
                    trigger: 'blur'
                }],
                productImg: [{
                    required: false,
                    message: 'ERW   Nt  2brwngs',
                    trigger: 'blur'
                }],
                productDesc: [{
                    required: false,
                    message: '  gNBR2Q',
                    trigger: 'blur'
                }]
            }
        }
    },
    computed: mapGetters(["user"]),
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(async valid => {
                if (valid && this.formFields.pImages && this.formFields.pDesc && (this.canNumOfWords >= 0)) {
                    const body = {
                        productName: this.formValidate.productName,
                        salePrice: this.formValidate.salePrice,
                        productNum: this.formValidate.productNum,
                        prodcutImgs: Object.values(this.imagesList),
                        productDesc: {
                            html: this.descHTML,
                            markdown: this.descMkd
                        }
                    };
                    // 添加操作
                    if (!this.isEditMode) {
                        let res = await this.$http.post('/v1/admin/goods', body);
                        var data = res.data.data || res.data;
                        if (201 === data.status && "Goods created." === data.message) {
                            this.resetForm("formValidate");
                            this.$Message.success('添加成功！');
                        }
                    // 编辑操作
                    } else {
                        body.productId = this.$route.params.productId;
                        let res = await this.$http.put('/v1/admin/goods', body);
                        var data = res.data.data || res.data;
                        if (201 === data.status && data.success) {
                            this.resetForm("formValidate");
                            this.$Message.success('编辑成功！');
                            this.$router.push('/admin/goods/list');
                        }
                    }
                } else {
                    if (!this.formFields.pImages) this.imgFieldIsNull = true;
                    if (!this.formFields.pDesc) this.descFieldIsNull = true;
                }
            });
        },
        handleReset(name) {
            this.resetForm(name);
            this.$Message.warning('表单重置成功！');
        },
        resetForm(name) {
            delData(FORM_KEY);
            this.descMkd = '';
            this.descHTML = '';
            this.uploadList = [];
            this.imagesList = [];
            this.product = {};
            this.$refs[name].resetFields();
            this.$refs.upload.clearFiles();
            this.formFields.pImages = false;
            this.imgFieldIsNull = false;
            this.descFieldIsNull = false;
            // 清空之后需要重新引用
            this.uploadList = this.$refs.upload.fileList;
            
        },
        selectComponet(selectItemName) {
            this.currentView = selectItemName;
        },
        saveForm(mdText, html) {
            let images = [];
            for (let val in this.imagesList) {
                let image = {};
                image.name = val;
                image.url = URL + val;
                images.push(image);
            }
            
            let product = {
                property: this.formValidate,
                imagesList: this.uploadList,
                descHTML: html,
                descMarkdown: mdText || h2m(html)
            };
            addData(FORM_KEY, product)
        },
        updateDesc(value, html) {
            // const product = queryData(FORM_KEY);
            // 限制输入字数
            let len = getStrleng(value||'');
            this.canNumOfWords = MAX_WORDS - len;
            this.descHTML = html;
            this.descMkd = value;

            if ( (!isNull(this.descHTML) && this.descHTML) || (!isNull(this.descMkd) && this.descMkd)) {
                this.formFields.pDesc = true;
                this.descFieldIsNull = false; 
            }
        },
        handleView(name) {
            this.imgName = URL + name;
            this.visible = true;
        },
        async handleRemove(file) {
            const url = '/v1/admin/goods_images?name=' + file.name;
            // 从 upload 实例删除数据
            const res = await this.$http.delete(url);
            const data = res.data.data || res.data;

            if (200 === data.status && 'Delete success.' === data.message) {
                const fileList = this.$refs.upload.fileList;
                
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.defaultList.splice(fileList.indexOf(file), 1);
                delete this.imagesList[file.name];

                const product = queryData(FORM_KEY);
                if (product) {
                    product.imagesList.forEach( (item, index) => {
                        if (file.name === item.name) {
                            product.imagesList.splice(index, 1);
                        }
                    });
                    addData(FORM_KEY, product);
                }
            }
            
        },
        // 图片上传
        handleSuccess(res, file) {
            const data = res //res.data.data || res.data || res;

            if (201 === data.status && data.images) {
                
                if (!this.imagesList.hasOwnProperty(data.images)) {
                    file.url = URL + data.images;
                    file.name = data.images;
                    this.imagesList[file.name] = file.name;
                    this.imgFieldIsNull = false;
                    if (this.isEditMode) {
                        this.defaultList.push(file);
                    }
                } else {
                    file.name = '';
                }
                
                this.uploadList.forEach( (item, index) => {
                    if (!item.name) {
                        this.uploadList.splice(index, 1);
                    }
                });
            }
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 5 张图片。'
                });
            }
            return check;
        },
        notShowImgAlert() {
            const obj = {showImgAlertFlag: false};
            addData('SHOW_IMG_ALERT', obj)
        },
        async getGoodsById(id) {
            let res = await this.$http.get('/v1/goods/' + id);
            return res;
        },
        returnToList() {
            //    this.$router.push('/admin/list'); 
           this.$router.go(-1); 
        }
    },
    watch: {
        uploadList: {
            handler(val) { 
                if (Object.values(val).length > 0) {
                    this.formFields.pImages = true;
                } else {
                    this.formFields.pImages = false;
                }
            },
            deep: true
        }
        // '$route': 'getGoodsById'
    },
    async mounted() {
        if (!this.user || this.user.role < 10) {
            this.$router.go(-1);
            this.$Message.error("您无权限进行该操作！");
            return;
        }

        let product = queryData(FORM_KEY);

        // 为了复用该组件此处判断是否是路由编辑模式
        let pId =  this.productId;
        if (pId) {
            this.isEditMode = true; // 路由编辑编辑模式标识
            let res = await this.getGoodsById(pId);
            let data = res.data.data || res.data;

            if (200 === data.status && data.goods) {
                let goods = data.goods;
                let property = {
                    productName: goods.productName,
                    productNum: goods.productNum,
                    salePrice: goods.salePrice
                }
                let images = goods.prodcutImgs.map(item => {
                    let image = {};
                    image.name = item;
                    image.url = URL + item;
                    return image;
                });
                this.defaultList = images;
                product = {
                    property: property,
                    imagesList: images,
                    descHTML: goods.productDesc.html,
                    descMarkdown: goods.productDesc.markdown
                };
            }

        } else {
            // this.$Message.warning('请选择一个物品进行编辑!');
            // this.$router.push('admin/list');
        }

        if (product) {
            let p = product.property;
            this.descHTML = product.descHTML;
            this.descMkd = product.descMarkdown;
            this.formValidate.productName = p.productName;
            this.formValidate.productNum = p.productNum;
            this.formValidate.salePrice = p.salePrice;
            this.imagesList = Array.from(product.imagesList, item => item.name);
            let ps = Object.assign({}, product);
            this.$refs.upload.fileList = ps.imagesList;
        }
        if (!window.localStorage) {
            this.$Notice.warning({
                title: '警告！！！',
                desc: '该浏览器不支持存储，请妥善备份编辑。'
            });
        } else {
            this.$Notice.info({
                title: '编辑过程中可通过快捷键Ctrl + S保存。',
            });
        }

        const showImgAlert = queryData('SHOW_IMG_ALERT')
        if (showImgAlert)
            this.showImgAlertFlag = showImgAlert.showImgAlertFlag;

        this.uploadList = this.$refs.upload.fileList;
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
           if (!vm.user || vm.user.role < 10) {
               vm.$router.go(-1);
               vm.$Message.error("您无权限进行该操作！");
           }
        })
    },
    components: {
        MarkdownEditor,
        Rtf,
    }
}

</script>
