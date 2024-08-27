# cross-label-text-annotation

## Project setup
```
npm i cross-text-highlight
```
# 基于vue-search-highlight 的跨标签可标注序号的文本高亮插件

[演示案例图展示](https://s3.bmp.ovh/imgs/2024/08/13/3bfd6518df6b48dc.png)
## 参数配置说明

说明除了 基于 vue-search-highlight 的基本props之外，额外增加了一些配置
```vue
// 标记高
markWidth: { type: String, default: '32px' }
// 标记宽
markHeight: {
type: String,
default: '32px'
},
// 标记颜色
startColor: {
type: String,
default: '#ff9632'
},
// 标记颜色
endColor: {
type: String,
default: '#ffff00'
},
// 文字颜色
textColor: {
type: String,
default: '#fff'
},
// 边框颜色
borderColor: {
type: String,
default: '#ff9632'
},
// 边框定位
markLeft:{
type: String,
default: '-30px'
},
// 边框定位
markTop: {
type: String,
default: '-16px'
},
// 文字粗细
markWeight: {
type: String,
default: '700'
},
// 文字大小
markFontSize: {
type: String,
default: '22px'
},

markZoom: {
type: String,
default: '.65'
},
// 是否开启标记
isNeedMark: {
type: Boolean,
default: false
},
// 对应父元素名称
pEle: {
type: String,
default: 'htmlContent'
}
```
## 展示用法案例
```html
<template>
    <div id="app">
    <!-- 外层的id htmlContent 一定要和组件属性pEle保持一致  -->
        <div ref="htmlContent" id="htmlContent">
            <button @click="goTo">指定位置</button>
            <button @click="goBfter">第一个</button>
            <button @click="goAfter">第二个</button>
            <button @click="goAfter2">第三个</button>
            <crossTextHighLight
                    ref="search"
                    @current-change="currentChange"
                    :content="text"
                    :keyword="keyword"
                    :is-need-mark="true"
                    :pEle="`htmlContent`"
                    @match-count-change="matchCountChange"
                    :highlightStyle="`background: #ffff00`"
                    :currentStyle="`background: rgb(224, 234, 250)`"
            />

        </div>
    </div>
</template>

<script>
    import crossTextHighLight from "crossTextHighLight";
    export default {
        name: 'App',
        components: {
            crossTextHighLight
        },
        data(){
            return {
                text: ``,
                keyword: "",
                matchCount: 0,
            }
        },
        methods: {
            currentChange(){

            },
            matchCountChange (count) {
                this.matchCount = count
            },
            goTo(){
                this.$refs.search.scrollToOrder(2,this.$refs.search)
            },
            goBfter(){
                this.$refs.search.scrollToOrder(1,this.$refs.search)
            },
            goAfter(){
                this.$refs.search.scrollToOrder(2,this.$refs.search)
            },
            goAfter2(){
                this.$refs.search.scrollToOrder(3,this.$refs.search)
            }
        }
    }
</script>

<style>
    *{
        line-height: 80px;
    }
    #htmlContent{
        height: 600px;
        overflow-y: auto;
    }
</style>


```
## 更新记录 

1. 2024-8-27 
- 可自定义是否开启默认的右键事件，当前里面只有一个复制操作
- 对外暴露事件 'selection-change' ,包含了位置信息，以及文本内容
- bug：修复了更新节点时候的类名错误