<template>
    <div class="aw-chat-wrap">
        <div class="aw-chat-head">
            <a class="ivu-modal-close " @click="closeThis">
                <Icon type="close" class="ivu-icon ivu-icon-ios-close-empty"></Icon>
            </a>
        </div>
        <div class="aw-chat-body">
            <div id="chatArea" ng-class="{'chatRoom':currentContact.isRoomContact(),'no-choose':!currentContact.getDisplayName()}" class="box chat ng-scope chatRoom">
                <!--BEGIN HD-->
                <div class="box_hd">
                    <div id="chatRoomMembersWrap"></div>
                    <div class="title_wrap">
                        <div class="title poi" ng-click="currentContact.MMCanCreateChatroom && showChatRoomMembers($event)">
                            <a class="title_name ng-binding" data-username="@@37b2e09e0b89d93ca640f9d86b29aa180bc6565615946f11dd41a48e324dc0c2" ng-bind-html="currentContact.getDisplayName()">卖家</a>
                        </div>
                    </div>
                </div>

                <div class="scroll-wrapper box_bd chat_bd scrollbar-dynamic" style="position: absolute;">
                    <div jquery-scrollbar="" ref="scrollbar" class="box_bd chat_bd scrollbar-dynamic scroll-content" data-cm="{type:clean,username:}" style="height:100%; margin-bottom: 0px; margin-right: 0px;">

                        <div data-for="message in chatContent" data-height-calc="heightCalc" data-buffer-height="300" data-pre-calc="true" class="ng-scope">
                            <div ng-style="{height:topHeight}" class="top-placeholder ng-scope" style="height: 0px;"></div>
                            <div v-for="(message, index) in chatContent" class="ng-scope" :key="index">
                                <div class="clearfix" message-directive="">
                                    <div ng-switch="" on="message.MsgType" style="overflow: hidden;" ng-init="contact = getUserContact(message.MMActualSender,message.MMPeerUserName);">
                                        <div ng-switch-default="" class="message ng-scope" :class="{you:!message.MMIsSend,me:message.MMIsSend,first:(index==0&&!message.MMTime)}">
                                            <div ng-if="message.MMTime||(newMsg && newMsg==message)" class="message_system ng-scope">
                                                <div ng-if="(message.MMTime&&!(newMsg && newMsg==message))" class="content ng-binding ng-scope">14:53</div>
                                            </div>
                                            <img class="avatar" src="/cgi-bin/mmwebwx-bin/webwxgeticon?seq=0&username=@7ea0ce8a68384fb78fdad955f45aa66e&chatroomid=@914e86a49f814dcd0a61b0fbb37aa411&skey=" mm-src="/cgi-bin/mmwebwx-bin/webwxgeticon?seq=0&username=@7ea0ce8a68384fb78fdad955f45aa66e&chatroomid=@914e86a49f814dcd0a61b0fbb37aa411&skey=" data-cm="{type:avatar,username:@7ea0ce8a68384fb78fdad955f45aa66e,isFriend:false}" title="感情深一口闷，感情浅舔一舔" ng-click="showProfile($event,message.MMActualSender)">
                                            <div class="content">
                                                <div 
                                                class="bubble js_message_bubble ng-scope bubble_default" 
                                                :class="{bubble_default:!message.MMIsSend, left:!message.MMIsSend, bubble_primary: message.MMIsSend,right:message.MMIsSend}" 
                                                data-cm="{type:message,actualSender:@7ea0ce8a68384fb78fdad955f45aa66e, msgType:1,subType:0,msgId:3276257714766086428}">

                                                    <div class="bubble_cont ng-scope" ng-if="message.MsgType == CONF.MSGTYPE_TEXT && message.SubMsgType != CONF.MSGTYPE_LOCATION">
                                                        <div class="plain">
                                                            <pre class="js_message_plain ng-binding" v-html="message.MMActualContent"></pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ng-style="{height:bottomHeight}" class="bottom-placeholder ng-scope" style="height: 0px;"></div>
                        </div>
                        <div id="prerender" style="
                            visibility: hidden;
                            position: absolute;
                            width: 100%;
                            top: 333px;
                            height: 0;
                            padding: 0 19px;
                            box-sizing: border-box;
                            margin-left: -19px;
                            overflow: hidden;
                            "></div>
                    </div>
                </div>
                <div class="box_ft ng-scope" ng-controller="chatSenderController" ng-show="currentContact && !currentContact.isReadOnlyContact()">
                    <div class="toolbar" id="tool_bar">
                        <a class="web_wechat_face" ng-click="showEmojiPanel($event)" href="javascript:;" title="表情"></a>
                        <a mm-action-track="" track-type="['click']" track-opt="{'target':'截图'}" class="web_wechat_screencut ng-isolate-scope" ng-hide="noflash" ng-click="screenShot()" href="javascript:;" title="截屏"></a>
                        <a mm-action-track="" track-type="['click']" ng-click="sendClick($event)" track-opt="{'target':'发文件'}" class="web_wechat_pic js_fileupload ng-isolate-scope webuploader-container" ng-hide="noflash" href="javascript:;" title="图片和文件">
                            <div class="webuploader-pick"></div>
                            <div id="rt_rt_1bqk2u67q13kmeq44mqf2eoc21" style="position: absolute; top: 0px; left: 0px; width: 30px; height: 30px; overflow: hidden; bottom: auto; right: auto;"><input type="file" name="file" class="webuploader-element-invisible" multiple="multiple">
                                <label style="opacity: 0; width: 100%; height: 100%; display: block; cursor: pointer; background: rgb(255, 255, 255);"></label>
                            </div>
                        </a>
                    </div>
                    <div class="content ng-isolate-scope" mm-action-track="" track-type="['click','keydown']" track-opt="{target:'发送框',keys:['enter','backspace','blankspace']}">
                        <textarea 
                        id="editArea" 
                        contenteditle-directive="" 
                        mm-abpaste="" 
                        class="flex edit_area ng-isolate-scope ng-pristine ng-valid" 
                        contenteditable="true" 
                        v-model="editAreaCtn"
                        ng-blur="editAreaBlur($event)" 
                        ng-click="editAreaClick($event)" 
                        ng-keyup="editAreaKeyup($event)" 
                        ng-keydown="editAreaKeydown($event)"></textarea>
                        <span class="caret_pos_helper" id="caretPosHelper"></span>
                    </div>

                    <div class="action">
                        <span ng-if="!isMacOS" class="desc ng-scope">按下Ctrl+Enter发送</span>
                        <button class="btn btn_send" href="javascript:;" @click="sendTextMessage">发送</button>
                    </div>
                </div>
                <div id="J_CatchDrop" class="catch-drop-area"></div>
            </div>
        </div>
    </div>
</template>

<script>
// import Icon from "iview/src/components/icon/icon";

export default {
    data() {
        return {
            editAreaCtn: '',
            chatContent: [],
        };
    },
    sockets: {
        connect() {
            console.log('socket connected')
        },
        customEmit(val) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    methods: {
        sendTextMessage() {
            // $socket is socket.io-client instance
            let msg = {
                MMIsSend: true,
                MMTime: '',
                MMActualSender: '',
                MMPeerUserName: '',
                MMActualContent: this.editAreaCtn,
            };
            this.$socket.emit('private message', 'alan', msg);
            this.chatContent.push(msg);
            this.scroll2Btm();
            this.editAreaCtn = '';
        },
        closeThis() {
            this.$emit('chat-close');
        },
        scroll2Btm() {
            const scrollbar = this.$refs.scrollbar;
            scrollbar.scrollTop = scrollbar.scrollHeight;
        }
    },
    mounted() {
        this.$el.addEventListener('keydown', e => {
            if (e.ctrlKey && !e.altKey && !e.shiftKey) {
                if (13 === e.keyCode) {
                    e.preventDefault()
                    this.sendTextMessage();
                }
            }
        });
    }
}

</script>
<style scoped>
    @import '../assets/css/chat.css';
</style>

<style lang="stylus" scoped>
    .aw-chat-wrap
        position fixed
        z-index 999
        bottom 20px
        right 20px
        height 500px
        width 450px
        transition right .5s ease-out
        background-color #fff
        border 1px solid rgba(51, 51, 51, 0.15)
        .aw-chat-head
            // padding 5px 5px 0 0
            .chat-close
               float right
               cursor pointer
        .aw-chat-body
            .clearfix
                display block
    .edit_area
        width 100%
    button.btn_send 
        height: 30px;
        width: 80px;
        line-height: 30px;
        letter-spacing: 0;
        text-align: center;
</style>
