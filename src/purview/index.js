
export default {
    install(Vue, options = {}) {
        /**
        * coustom directive
        */
        Vue.directive('permission', {
            bind: function (el, binding, vnode) {
                const s = JSON.stringify
                el.innerHTML =
                    'name: ' + s(binding.name) + '<br>' +
                    'value: ' + s(binding.value) + '<br>' +
                    'expression: ' + s(binding.expression) + '<br>' +
                    'argument: ' + s(binding.arg) + '<br>' +
                    'modifiers: ' + s(binding.modifiers) + '<br>' +
                    'vnode keys: ' + Object.keys(vnode).join(', ');
                    // print(Vue)
        
            }
        })
    }
}