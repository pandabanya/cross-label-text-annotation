import crossTextHighLight from "./crossTextHighLight/index.vue";
import "./assets/style/index.css"
const components = [crossTextHighLight]
// 批量注册组件
const install = function (Vue) {
    components.forEach(com => {
        Vue.component(com.name, com)
    })
}

if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}