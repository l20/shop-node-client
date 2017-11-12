<template>
    <div class="comment-wrap">
        <div class="review_nav">评论</div>
        <div class="review_listBox" :class="{hide: !showMoreCom}">
            <div class="review_list clearfix" v-for="(comment, indexParent) in commentList" :id="'com-' + indexParent" :key="comment._id">
                <div class="review_userHead fl">
                    <div class="review_user">
                        <span class="review_avatar">
                            <Icon type="person"></Icon>
                        </span>
                        <p class="user_name"><a href="#">{{ comment.from.userName }}</a></p>
                    </div>
                </div>
                <div class="review_cont">
                    <p class="review_text">{{ comment.content }}</p>
                    <p class="review_opt">
                        <a href="#" title="赞同" class="ding"@click="voteUp({index: indexParent, cid: comment._id})"><Icon type="thumbsup"></Icon>赞同({{ comment.voteNo.length }})</a>
                        <a href="#" title="反对" class="cai" @click="voteDown({index: indexParent, cid: comment._id})"><Icon type="thumbsdown"></Icon>反对({{ comment.voteYes.length }})</a>
                        <a href="#" title="回复" class="reply" @click="showThisForm(indexParent)"><Icon type="reply"></Icon>回复({{ comment.reply.length || 0 }})</a>
                        <span v-if="user">
                            <a href="#" title="删除" v-if="user._id === comment.from._id || user.role > 30" class="delete" @click="delThis({index: indexParent, cid: comment._id})"><Icon type="ios-trash"></Icon>删除</a>
                        </span>
                        <span class="review_at">发表于　{{ dateFormat(comment.meta.createAt) }}</span>
                    </p>
                    <i-form ref="reply" v-if="showReplyByIndex === indexParent" :model="replyValidate" inline>
                        <Form-item prop="content" style="min-width:65%">
                            <Input 
                            type="textarea"
                            v-model="replyValidate.content" 
                            :autosize="{minRows: 1,maxRows: 5}"
                            :placeholder="'回复' + comment.from.userName"></Input>
                        </Form-item>
                        <Form-item>
                            <Button  type="ghost"  @click="hideThisForm" icon="arrow-return-left">取消</Button>
                            <Button 
                            :loading="rplLoading" 
                            :disabled="disableReply"
                            icon="ios-chatboxes-outline"
                            @click="submitReply({index: indexParent, toCom: true, cid: comment._id, to: comment.from._id })" 
                            type="primary">回复</Button>
                        </Form-item>
                    </i-form>
                </div>
                <div class="review_cont review_reply"  v-for="(reply, index) in comment.reply" :id="'reply-' + (indexParent*10+index)"  :key="index">
                    <div class="review_reply_item clearfix" >
                        <div class="fl reply_avatar">
                            <span class="review_avatar"><Icon type="person"></Icon></span>
                            <a href="#" class="user_name reply-from">{{ reply.from.userName }}</a>
                            <span v-if="!reply.toCom && reply.to.userName !== reply.from.userName">回复<a href="#" class="reply-to">{{ reply.to.userName }}</a></span>：
                        </div>
                        <div class="reply_cont">{{ reply.content }}</div>
                        <span class="review_at">回复于　{{ dateFormat(reply.createAt) }}</span>
                        <a class="review_reply_btn" @click="showR2RForm([indexParent, index])">回复</a>
                        <span v-if="user">
                            <a class="review_reply_del" v-if="user._id === reply.from._id || user.role > 30" @click="delThis({index: [indexParent, index], cid: comment._id, rid: reply._id})">删除</a>
                        </span>
                    </div>
                    <i-form ref="reply2reply" v-if="showR2RByIndex === indexParent*10+index " :model="replyValidate" inline>
                        <Form-item prop="content" style="min-width:65%">
                            <Input 
                            type="textarea"
                            v-model="replyValidate.content" 
                            :autosize="{minRows: 1,maxRows: 5}"
                            :placeholder="'回复' + reply.from.userName"></Input>
                        </Form-item>
                        <Form-item>
                            <Button  type="ghost"  @click="hideThisForm" icon="arrow-return-left">取消</Button>
                            <Button 
                            :loading="rplLoading" 
                            :disabled="disableReply"
                            icon="ios-chatboxes-outline"
                            @click="submitReply({index: [indexParent, index], toCom: false, cid: comment._id, to: reply.from._id })" 
                            type="primary">回复</Button>
                        </Form-item>
                    </i-form>
                </div>
            </div>
        </div>
        <div class="more-comments" title="展开更多评论" style="display: none;" v-if="commentList.length > 0" @click="showMoreCom = true">
            <Icon type="chevron-up" style="display: none;"></Icon>
            <Icon type="chevron-down"></Icon>
        </div>
        <div class="Comments-footer CommentEditor--normal"
        :class="{'CommentEditor--active': isEdit, 'commnet-leave': !isEdit}">
            <i-form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <Form-item prop="content" >
                    <Input 
                    type="textarea"
                    @on-focus="isEdit = true"
                    v-model="formValidate.content" 
                    :autosize="{minRows: 1,maxRows: 5}"
                    :placeholder="commentList.length > 0 ? '写下你的评论...' : '该物品暂无评论，快来抢沙发。'"></Input>
                </Form-item>
                <Button class="Button CommentEditor-singleButton" 
                :disabled="disableSubmit"
                icon="ios-chatboxes-outline"
                @click="submitComment"
                :loading="comLoading" 
                type="primary">
                <span v-if="!comLoading">评论</span>
                <span v-else>提交...</span>
                </Button>
            </i-form>
        </div>
        <Modal
        v-model="showNotice"
        width="300"
        class-name="vertical-center-modal comment-confirm"
        :closable="false">
            <p style="font-weight: 600;padding: 10px">确定要删除该评论吗？删除后不可恢复。</p>
            <div slot="footer">
                <Button type="ghost" @click="cancel">取消</Button>
                <Button type="error" @click="ok">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {isNull} from '@/assets/js/utils';
import { mapGetters, mapActions } from 'vuex';

export default {
    // 物品id
    props: ['pid'],
    data() {
        // 评论表单失去焦点回调
         const validateComment = (rule, value, callback) => {
            if (!this.formValidate.content) {
                this.isEdit = false;
            }
            callback();
        };
        return {
            // 删除评论、回复generator函数
            delGen: null,
            // 回复框控制标识            
            isEdit: false,
            // 删除弹出提示框标识
            showNotice: false,
            // 提交评论按钮动画标识
            comLoading: false,
            // 提交回复按钮动画标识
            rplLoading: false,
            // 是否显示部分评论标识
            showMoreCom: true,
            // 回复——回复标识
            disableR2R: true,
            // 回复——评论标识
            disableReply: true,
            // 表单提交控制标识
            disableSubmit: true,
            // 是否显示删除弹出提示框
            modalEnable: true,
            // 回复——回复索引
            showR2RByIndex: -1,
            // 回复——评论索引
            showReplyByIndex: -1,
            // 评论数据列表
            commentList: [],
            // 评论表单内容字段
            formValidate: {
                content: '',
            },
            // 评论表单内容规则验证
            ruleValidate: {
                content: [{
                    required: true,
                    validator: validateComment,
                    trigger: 'blur'
                }],
            },
            // 回复表单内容
            replyValidate: {
                content: '',
            },
            // 回复——回复表单内容
            reply2reply: '',
        };
    },
    methods: {
        ...mapActions([
            'showModal',
            'hideModal',
            'checkLogin',
            'setModalTip',
        ]),
        // 显示评论表单
        showThisForm(index) {
            this.replyValidate.content = '';
            this.reply2reply = '';
            this.showReplyByIndex = index;
            this.showR2RByIndex = -1;
        },
        // 隐藏评论表单
        hideThisForm() {
            this.replyValidate.content = '';
            this.reply2reply = '';
            this.showReplyByIndex = -1;
            this.showR2RByIndex = -1;
        },
        // 显示回复表单
        showR2RForm(index) {
            index = index[0] * 10 + index[1];
            this.replyValidate.content = '';
            this.reply2reply = '';
            this.showR2RByIndex = index;
            this.showReplyByIndex = -1;
        },
        // 日期格式化
        dateFormat(date) {
            const moment = require('moment');
            moment.locale('zh-cn');     // 设置语言为中文
            return moment(date).startOf().fromNow(); // 相对时间
            // return moment(date).format('lll');  // yyyy年mm月dd日 hh:mm
        },
        // 删除提示框取消事件回调
        cancel() {
            this.delGen.next(false);
        },
        // 删除提示框删除事件回调
        ok() {
            this.delGen.next(true);
        },
        // 删除评论提示框弹出
        delThis(opt) {
            this.delGen = this.delCom(opt);
            this.delGen.next();
        },
        // 删除评论、回复generator函数
        delCom: function* (opt) {
            // 显示提示框
            if (this.modalEnable) {
                this.showNotice = true
                if (yield) {    
                    this.deleteSubmit(opt);
                }
                this.showNotice = false;
            // 不显示提示框
            } else {
                this.deleteSubmit(opt);
            }
        },
        // 点赞
        async voteUp(obj) {
            this.checkLogin(this);
            const user = this.user;
            const index = obj.index;
            delete obj.index;

            if (user) {
                obj.from = user._id;
                obj.type = 'voteUp';
                const res = await this.$http.put('/v1/comment/vote', obj);
                const data = res.data.data || res.data;

                if (data.comment && data.success) {
                    const currentCom = this.commentList[index];
                    currentCom.voteNo.push(obj.from);
                } else if(data.existed) {
                    this.$Message.warning('您已赞过该评论。');
                } else {
                    this.$Message.error(data.message);
                }
            } else {
                this.comLoading = false;
                this.$Message.warning({
                    content: '先登录才能进行此操作。',
                    duration: 5
                });
                this.showModal('登录');
            }
        },
        // 反对
        async voteDown(obj) {
            this.checkLogin(this);
            const user = this.user;
            const index = obj.index;
            delete obj.index;

            if (user) {
                obj.from = user._id;
                const res = await this.$http.put('/v1/comment/vote', obj);
                const data = res.data.data || res.data;

                if (data.comment && data.success) {
                    const currentCom = this.commentList[index];
                    currentCom.voteYes.push(obj.from);
                } else if(data.existed) {
                    this.$Message.warning('您已反对过该评论。');
                } else {
                    this.$Message.error(data.message);
                }
            } else {
                this.comLoading = false;
                this.$Message.warning({
                    content: '先登录才能进行此操作。',
                    duration: 5
                });
                this.showModal('登录');
            }
        },
        // 提交回复
        async submitComment() {
            const content = this.formValidate.content;
            // 内容为空直接返回
            if (!content) return;

            // 检查登录
            this.checkLogin(this);
            const user = this.user;

            // 按钮加载动画
            this.comLoading = true;

            if (user) {
                const body = {
                    from: user._id,
                    goods: this.pid,
                    content: content
                };
                // 提交评论
                const res = await this.$http.post('/v1/comment/', body);
                const data = res.data.data || res.data;

                if (data.comment && data.success) {
                    this.commentList.push(data.comment);
                    this.formValidate.content = '';
                    this.comLoading = false;
                    this.isEdit = false;
                }
            // 未登录
            } else {
                this.comLoading = false;
                this.$Message.warning({
                    content: '您还为登录请先登录再评论。',
                    duration: 5
                });
                this.showModal('登录');
            }
        },
        // 回复评论
        async submitReply(reply) {
            const content = this.replyValidate.content;
            // 内容为空直接返回
            if (!content) return; 

            // 检查登录
            this.checkLogin(this);
            const user = this.user;
            let index = -1;

            // 回复给回复
            if (!reply.toCom) { 
                index = reply.index[0] //* 10 + reply.index[1];
            // 回复给评论
            } else {
                index = reply.index;
            }
            delete reply.index;

            // 按钮加载动画
            this.rplLoading = true;

            if (user) {
                reply.from = user._id;
                reply.content = content;

                // 提交回复
                const res = await this.$http.post('/v1/comment/', reply);
                const data = res.data.data || res.data;

                if (data.comment && data.success) {
                    this.commentList[index].reply.push(data.comment);
                    this.replyValidate.content = '';
                    this.rplLoading = false;
                    this.isEdit = false;
                    this.hideThisForm();
                }
            // 未登录
            } else {
                this.rplLoading = false;
                this.$Message.warning({
                    content: '您还为登录请先登录再评论。',
                    duration: 5
                });
                this.showModal('登录');
            }
        },
        // 删除评论
        async deleteSubmit(obj) {
            // 检查登录
            this.checkLogin(this);
            const user = this.user;
            const index = obj.index;

            if (user) {
                let url = '/v1/comment?cid=';
                const isReply = Array.isArray(index);
                isReply ? 
                url += obj.cid + '&rid=' + obj.rid :
                url += obj.cid;

                const res = await this.$http.delete(url);
                const data = res.data.data || res.data;

                // 删除评论
                if (200 === data.status && data.success && data.result && !isReply) {
                    this.commentList.forEach( (item, index) => {
                        if (obj.cid === item._id) {
                            this.commentList.splice(index, 1);
                            this.$Message.success('删除成功！');
                        }
                    });
                }

                // 删除回复
                if (200 === data.status && data.success && data.replyId && isReply) {
                    let replies = this.commentList[index[0]].reply;
                    replies.forEach( (item, index) => {
                        if (data.replyId === item._id) {
                            replies.splice(index, 1);
                            this.$Message.success('删除成功！');
                        }
                    });
                }
            // 未登录
            } else {
                this.$Message.warning({
                    content: '您无权限进行此操作。',
                    duration: 5
                });
                this.showModal('登录');
            }
        },
    },
    watch: {
        // 评论框监测
        formValidate: {
            handler(val) { 
                if (!isNull(val.content)) {
                    this.disableSubmit = false;
                } else {
                    this.disableSubmit = true;
                }                
            },
            deep: true
        },
        // 回复框监测
        replyValidate: {
            handler(val) { 
                if (!isNull(val.content)) {
                    this.disableReply = false;
                } else {
                    this.disableReply = true;
                }                
            },
            deep: true
        },
    },
    computed: mapGetters(['user']),
    async mounted() {
        // Get comments list by id
        const res = await this.$http.get('/v1/comment/list?goodsId=' + this.pid);
        const data = res.data.data || res.data;

        if (data.comments && data.success) {
            const comments = data.comments;
            this.commentList = comments;
        }
    }
}

</script>

<style lang="stylus" scoped>
.comment-wrap
    margin-top 40px
    border-top 1px solid rgba(51, 51, 51, 0.15)
    padding: 50px 80px 10px 90px
    position relative
    .review_nav
        font-size 18px
        font-weight 600
        padding-bottom 20px
    .review_listBox
        overflow hidden
        transition all .4s ease
        &.hide
            height 22px
        .review_list
            // padding: 50px 80px 10px 90px
            width 100%
            .review_at
                color #aaa
            .review_user
                .review_avatar
                    color #fff
                    padding 6px 10px
                    border-radius 4px
                    display inline-block
                    background-color  #666
                    i
                        font-size 30px
            .fl
                float left
            .review_cont
                padding-left 100px
                margin-bottom 25px
                .review_text
                    font-size 16px
                    font-weight 700
                    color #666

                .review_opt
                    // text-align right
                    color #aaa
                    &:hover
                        a
                            color #888!important
                            &:hover
                                color #eebc00!important

                    a
                        padding 0 5px
                        display inline-block
                        color #aaa
                        &.cai,
                        &.reply
                        &.delete
                            color rgba(255, 255, 255, 0)

                    .review_at
                        color #aaa
                        padding 0 10px
                        float right 
                .review_t 
                    height 24px
                    padding-top 5px
                p
                    line-height 30px
            .review_reply
                .review_reply_item
                    display block
                    .review_reply_del
                        color rgba(255, 255, 255, 0)
                    &:hover
                        .review_reply_del
                            color #000
                            &:hover
                                color #eebc00
                    .review_reply_btn
                        padding 0 10px
                    .reply_avatar
                        font-size 15px
                        .review_avatar
                            color #fff
                            padding 5px 8px
                            border-radius 2px
                            background-color  #666
                        .user_name
                            padding 0 5px
                        .reply-to
                            padding 0 5px
                            
                    .reply_cont
                        margin-bottom 10px
                        color #000

    .more-comments
        text-align center
        cursor pointer
        position absolute
        transition all .2s ease-in-out
        width 100%
        height 40px
        left 0
        bottom -5px
        box-shadow  1px 2px 3px rgba(238, 238, 238, 0.49)
        > i
            font-size 12px
            line-height 65px
            color #888
            z-index 2
            position relative
            transition all .2s ease-in-out
        &:before 
            content ""
            width 100%
            height 100%
            position absolute
            left 0
            bottom 0
            z-index 1
            box-shadow inset 0 -20px 30px #fff
        &:hover
            box-shadow  1px 2px 3px #999
            >i
                color #eebc00
    
    .Comments
        box-direction: normal;
    .Comments-footer
        padding: 12px 16px;
        // background: #fff;
        border-top: 1px solid #ebeef5;
    
    
    .CommentEditor-singleButton
        right: 16px;
        top: 12px;
        position: absolute;
        transform: scale(0);
        line-height: 34px!important;
        transition: all .3s ease,transform .3s ease;
  
    .Button
        padding: 0 16px;

    .CommentEditor--normal
        position: relative;
        transition: padding-right .3s ease;
        textarea
            transition: all .3s ease;
            
        &.CommentEditor--active
            padding-right: 115px;
            .CommentEditor-singleButton
                transform: scale(1);
                &:disabled
                    background-color rgba(92, 173, 255, 0.77)
                    border 1px solid rgba(92, 173, 255, 0.77)
                    color #eee
</style>
<style lang="stylus" >
    .comment-confirm
        .ivu-modal
            top 0
        .ivu-modal-footer
            display block!important
            border none
    .vertical-center-modal
        display flex
        align-items center
        justify-content center
        flex-direction column
    .CommentEditor--normal
        textarea
            min-height 34px!important;
    .commnet-leave 
        textarea
            background-color: #f3f3f3;
            cursor: pointer;
            color: #ccc;
            opacity: 1;
            &:hover
                border-color: #e4e5e7;
</style>