<style lang="stylus" >

    #editor 
        margin auto
        width 100%
        .v-note-wrapper .v-note-panel,
        .v-note-wrapper .v-note-op
            box-shadow none 
            border 1px solid #ddd
        .v-note-op
            border-bottom  none!important

    .aw-markdown-container
        margin-bottom 50px!important
        .markdown-body 
            min-height 403px
            z-index 10
</style>

<template>
    <div id="editor" class="aw-markdown-container">
        <mavon-editor 
        :value="descMkd" 
        :toolbars="toolbars"
        :editable="editable" 
        @save="saveForm" 
        @change="updateDesc" 
        style="height: 100%">
        </mavon-editor>
    </div>
</template>

<script>
import {
    addData,
    delData,
    updateData,
    queryData,
    clearData
} from '@/assets/js/utils';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

const FORM_KEY = 'addGoods';

export default {
    name: 'editor',
    props: ['descHtml', 'descMkd', 'editable'],
    data() {
        return {
            toolbars: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                // imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                // undo: true, // 上一步
                // redo: true, // 下一步
                trash: true, // 清空
                save: true, // 保存（触发events中的save事件）
                navigation: false, // 导航目录
                alignleft: false, // 左对齐
                aligncenter: false, // 居中
                alignright: false, // 右对齐
                subfield: true, // 单双栏模式
                preview: true, // 预览
            }
        }
    },
    components: {
        mavonEditor
    },
    methods: {
        saveForm(mdText, html) {
            this.$emit('aw-save', mdText, html);
        },
        updateDesc(value, render) {
            
            this.$emit('aw-update', value, render);
        },
    },
    created() {
        this.$emit('aw-update')
    },
    
}
</script>
