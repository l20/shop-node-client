<style media="screen">
.rtf-content {
    height: 100%;
    margin-bottom: 50px;
}

.ql-editor {
    min-height: 320px;
}
</style>
<template>
    <div class="rtf-content">
        <quill-editor 
        ref="myTextEditor" 
        :content="descHtml" 
        @change="updateDesc($event)" 
        :options="editorOption">

        </quill-editor>
    </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
export default {
    props: ['descHtml'],
    data() {
        return {
            content: '',
            editorOption: {
                modules: {
                    toolbar: [
                        [{ 'size': ['small', false, 'large'] }],
                        ['bold', 'italic'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image']
                    ],
                    history: {
                        delay: 1000,
                        maxStack: 50,
                        userOnly: false
                    },
                    imageImport: true,
                    imageResize: {
                        displaySize: true
                    }
                }
            }
        }
    },
    methods: {
        saveForm(mdText, html) {
            // this.$emit('aw-save', mdText, html);
        },
        updateDesc({ editor, html, text }) {
            this.content = html;
            this.$emit('aw-update', text, html);
        },
    },
    mounted() {
        this.$el.addEventListener('keydown', e => {
            if (e.ctrlKey && !e.altKey && !e.shiftKey) {
                if (83 === e.keyCode) {
                    e.preventDefault()
                    this.saveForm('', this.content);
                }
            }
        });
    },
    components: {
        quillEditor
    },

}
</script>
