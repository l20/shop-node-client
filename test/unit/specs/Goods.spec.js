import Vue from 'vue'
import goods from '@/views/Goods'

// 挂载元素并返回已渲染的文本的工具函数
function getRenderedText(Component, propsData={}) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor(propsData).$mount()
  return vm
}

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const vm =  getRenderedText(goods)
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.loading-container h1').textContent).to.be('hello vue!')
    });
  })
})
