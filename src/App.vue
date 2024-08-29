<template>
  <div id="app">
    <div ref="htmlContent" id="htmlContent">
      <button @click="goBfter">第一个</button>
      <button @click="goAfter">第二个</button>
      <button @click="goAfter2">第三个</button>
      <button @click="before">上一个</button>
      <button @click="next">下一个</button>
      <crossTextHighLight
          ref="search"
          @current-change="currentChange"
          :move-behavior="false"
          :content="text"
          :keyword="keyword"
          :is-need-mark="true"
          :is-context-menu="true"
          :pEle="`htmlContent`"
          @match-count-change="matchCountChange"
          :start-color="`#409EFF`"
          :end-color="`#E0EAFA`"
          :border-color="`#E0EAFA`"
          highlightStyle="background: rgb(224, 234, 250)"
          currentStyle="{background: rgb(224, 234, 250)}"
          @selection-change="selectionChange"
      />

    </div>
  </div>
</template>

<script>
import crossTextHighLight from "@/components/crossTextHighLight/index.vue";
export default {
  name: 'App',
  components: {
    crossTextHighLight
  },
  data(){
    return {
      text: `<font>在一个遥远的</font>星球上，有一个名叫阿瓦隆的神秘岛屿，岛上居住着一群拥有超凡智慧的生物。他们拥有控制自然元素的能力，能够与风对话，与水共舞，甚至能够召唤雷电。然而，他们最珍贵的能力是预知未来。每当阿瓦隆的夜空中出现奇异的星象，他们就会聚集在古老的神庙前，通过古老的仪式来解读星辰的预言。

这个星球的文明非常发达，他们的科技与自然和谐共存，创造出一种独特的生态平衡。岛上的建筑与自然景观融为一体，仿佛是大自然的一部分。他们的交通工具是利用风能和太阳能驱动的，既环保又高效。

然而，阿瓦隆的居民们也面临着挑战。他们的星球正逐渐受到一个遥远星系的威胁，那个星系的居民企图侵占阿瓦隆，掠夺其丰富的资源。为了保护自己的家园，阿瓦隆的居民们必须团结起来，利用他们预知未来的能力，制定出一套防御策略。

在这场星际斗争中，阿瓦隆的居民们展现出了他们的勇气和智慧。他们不仅成功地抵御了外来的侵略，还通过外交手段，与邻近的星球建立了友好关系，共同维护了宇宙的和平与秩序。

这段文字是一个虚构的故事，但它展示了一个和谐共存、智慧与勇气并存的文明形象。希望你喜欢这段文字。`,
      keyword: "他们",
      matchCount: 0,
      index: 0,
    }
  },
  methods: {
    before(){
      this.$refs.search.searchLast()
    },
    next(){
      this.$refs.search.searchNext()
    },
    matchCountChange (count) {
      this.matchCount = count
    },
    currentChange (idx) {
      this.currentIdx = idx
    },
    goBfter(){
      this.$refs.search.scrollToOrder(1,this.$refs.search)
    },
    goAfter(){
      this.$refs.search.scrollToOrder(2,this.$refs.search)
    },
    goAfter2(){
      this.$refs.search.scrollToOrder(3,this.$refs.search)
    },
    selectionChange(text, x, y){
      console.log('文本， x， y：' ,text, x, y);
    },
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
