<!--
  用法案例
  htmlContent 父元素的id名称
  content 整个文本内容
  keyword 搜索的关键词
  ref="search" 子元素
 <div id="htmlContent">
  <crossTextHighLight
    class="search-highlight"
    ref="search"
    @current-change="currentChange"
    :content="text"
    :keyword="keyword"
    :isContextMenu='isContextMenu'
    highlightStyle="background: rgb(224, 234, 250)"
    currentStyle="{background: rgb(224, 234, 250)}"
    @selection-change='selectionChange'
  />
 </div>

 文本标注序号用法
-->
<template>
  <div class="content-main" @contextmenu.prevent.stop="openContextMenu" @mouseup="handleMouseUp">
    <div v-if="showContentMenu" id="contentMenu" :style="{ 'left': left + 'px', 'top': top + 'px' }">
      <ul>
        <li @click="copy">
          <i class="el-icon-copy-document"></i>
          <span>复制</span>
        </li>
      </ul>
    </div>
    <div id="highlight" class="highlight" v-html="contentShow"></div>
  </div>
</template>

<script>
const FONT_FLAG = 'cross-text-hightlight'

export default {
  name: 'CrossTextHighLight',
  props: {
    content: {
      type: String,
      default: ''
    },
    moveBehavior: { 
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      default: ''
    },
    highlightStyle: {
      type: String,
      default: 'background: #ffff00'
    },
    currentStyle: {
      type: String,
      default: 'background: #ff9632'
    },
    regExp: {
      type: Boolean,
      default: false
    },
    // 标记样式‘
    markWidth: {
      type: String,
      default: '32px'
    },
    markHeight: {
      type: String,
      default: '32px'
    },
    startColor: {
      type: String,
      default: '#ff9632'
    },
    endColor: {
      type: String,
      default: '#ffff00'
    },
    textColor: {
      type: String,
      default: '#fff'
    },
    borderColor: {
      type: String,
      default: '#ff9632'
    },
    markLeft: {
      type: String,
      default: '-30px'
    },
    markTop: {
      type: String,
      default: '-16px'
    },
    markWeight: {
      type: String,
      default: '700'
    },
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
    pEle: {
      type: String,
      default: 'htmlContent'
    },
    isContextMenu: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      left: 0,
      top: 0,
      showContentMenu: false,
      lightIndex: 0,
      matchCount: 0,
      contentShow: '',
      copyText: '',
      random: `${Math.random()}`.slice(2)
    }
  },
  computed: {
    watchString() {
      return [this.content, this.keyword]
    },
    watchStyle() {
      return [this.lightIndex, this.highlightStyle, this.currentStyle]
    },
    flag() {
      return `${FONT_FLAG}${this.random}`
    },
    styleSelector() {
      return `style[${this.flag}]`
    },
  },
  watch: {
    watchString: {
      immediate: true,
      handler() {
        this.replaceKeywords()
      }
    },
    watchStyle: {
      immediate: true,
      handler() {
        this.setStyle()
      }
    },
    lightIndex: {
      immediate: true,
      handler() {
        this.$emit('current-change', this.lightIndex)
      }
    },
    matchCount: {
      immediate: true,
      handler() {
        this.$emit('match-count-change', this.matchCount)
      }
    }
  },
  mounted() {
    if (this.isNeedMark) {
      this.$nextTick(() => {
        this.markNumber(0)
      })
    }
    // 选中监听
    document.onclick = () => {
      // console.log(event);
      if (this.showContentMenu && this.checkIn(document.getElementById('contentMenu'))) {
        return
      }
      this.showContentMenu = false
    }
  },
  beforeDestroy() {
    this.clearStyle()
    document.removeEventListener('click', () => {
      // console.log(event)
    })
  },
  methods: {
    handleMouseUp() {
      if (!this.isContextMenu) return
      let selectedText = '';
      selectedText = window.getSelection().toString()
      if (selectedText) {
        this.copyText = selectedText
      }
      if (!this.showContentMenu && this.checkIn(document.getElementById('highlight'))) {
        this.left = event.offsetX
        this.top = event.offsetY
      }
      this.$emit('selection-change', selectedText, event.offsetX, event.offsetY);
    },
    copy() {
      this.$copyText(this.copyText).then(() => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        // console.log(e)
      }, (e) => {
        this.$message({
          message: '复制失败',
          type: 'error'
        })
        console.log(e)
      })
    },
    openContextMenu() {
      if (!this.isContextMenu) return
      if(!window.getSelection().toString()){
        return 
      }
      console.log(window.getSelection().toString());
      this.showContentMenu = true
    },
    checkIn(obj) {
      var x = Number(window.event.clientX) // 鼠标相对屏幕横坐标
      var y = Number(window.event.clientY) // 鼠标相对屏幕纵坐标

      var div_x = Number(obj.getBoundingClientRect().left) // obj相对屏幕的横坐标
      var div_x_width = Number(
        obj.getBoundingClientRect().left + obj.clientWidth
      ) // obj相对屏幕的横坐标+width

      var div_y = Number(obj.getBoundingClientRect().top) // obj相对屏幕的纵坐标
      var div_y_height = Number(
        obj.getBoundingClientRect().top + obj.clientHeight
      ) // obj相对屏幕的纵坐标+height

      if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        return true
      } else {
        return false
      }
    },
    getTextNodeList(dom) {
      const nodeList = [...dom.childNodes]
      const textNodes = []
      while (nodeList.length) {
        const node = nodeList.shift()
        if (node.nodeType === node.TEXT_NODE) {
          node.wholeText && textNodes.push(node)
        } else {
          nodeList.unshift(...node.childNodes)
        }
      }
      return textNodes
    },

    getTextInfoList(textNodes) {
      let length = 0
      return textNodes.map(node => {
        let startIdx = length, endIdx = length + node.wholeText.length
        length = endIdx
        return {
          text: node.wholeText,
          startIdx,
          endIdx
        }
      })
    },

    getMatchList(content, keyword) {
      if (!this.regExp) {
        const characters = [...'\\[](){}?.+*^$:|'].reduce((r, c) => (r[c] = true, r), {})
        keyword = keyword.split('').map(s => characters[s] ? `\\${s}` : s).join('[\\s\\n]*')
      }
      const reg = new RegExp(keyword, 'gmi')
      const matchList = []
      let match = reg.exec(content)
      while (match) {
        matchList.push(match)
        match = reg.exec(content)
      }
      return matchList
    },

    replaceMatchResult(textNodes, textList, matchList) {
      // 对于每一个匹配结果，可能分散在多个标签中，找出这些标签，截取匹配片段并用font标签替换出
      for (let i = matchList.length - 1; i >= 0; i--) {
        const match = matchList[i]
        const matchStart = match.index, matchEnd = matchStart + match[0].length // 匹配结果在拼接字符串中的起止索引
        // 遍历文本信息列表，查找匹配的文本节点
        for (let textIdx = 0; textIdx < textList.length; textIdx++) {
          const { text, startIdx, endIdx } = textList[textIdx] // 文本内容、文本在拼接串中开始、结束索引
          if (endIdx < matchStart) continue // 匹配的文本节点还在后面
          if (startIdx >= matchEnd) break // 匹配文本节点已经处理完了
          let textNode = textNodes[textIdx] // 这个节点中的部分或全部内容匹配到了关键词，将匹配部分截取出来进行替换
          const nodeMatchStartIdx = Math.max(0, matchStart - startIdx) // 匹配内容在文本节点内容中的开始索引
          const nodeMatchLength = Math.min(endIdx, matchEnd) - startIdx - nodeMatchStartIdx // 文本节点内容匹配关键词的长度
          if (nodeMatchStartIdx > 0) textNode = textNode.splitText(nodeMatchStartIdx) // textNode取后半部分
          if (nodeMatchLength < textNode.wholeText.length) textNode.splitText(nodeMatchLength)
          const font = document.createElement('font')
          font.setAttribute(this.flag, i + 1)
          font.innerText = text.substr(nodeMatchStartIdx, nodeMatchLength)
          textNode.parentNode.replaceChild(font, textNode)
        }
      }
    },

    replaceKeywords() {
      let errFlag = false
      if (this.regExp) {
        try {
          const reg = new RegExp(this.keyword)
          if (reg.test('')) errFlag = true
        } catch (err) {
          errFlag = true
        }
      }
      if (errFlag || !this.keyword) {
        this.matchCount = 0;
        this.lightIndex = 0;
        this.contentShow = this.content
        return
      }
      const div = document.createElement('div')
      div.innerHTML = this.content
      const textNodes = this.getTextNodeList(div)
      const textList = this.getTextInfoList(textNodes)
      const content = textList.map(({ text }) => text).join('')
      const matchList = this.getMatchList(content, this.keyword)
      this.matchCount = matchList.length
      this.lightIndex = this.matchCount ? 1 : 0
      this.replaceMatchResult(textNodes, textList, matchList)
      this.contentShow = div.innerHTML
    },
    /**
     * scrollToOrder 滚动方法
     * @param index 当前序号 
     * @param cEle 子元素也是文本内容元素
     */
    scrollToOrder(index, cEle) {
      this.$nextTick(() => {
        let node = this.$el.querySelector(`font[${this.flag}='${index}']`)
        if (node) {
          this.lightIndex = index
          // 标记序号
          if (this.isNeedMark) {
            this.markNumber(index - 1, this.pEle)
          }
          // 外层包裹的盒子
          const contentElement2 = document.getElementById(this.pEle)

          setTimeout(() => {
            const contentDiv = cEle; // 获取 ref 为 "content" 的 DOM 元素
            if (contentDiv) {
              const contentRect = contentDiv.$el.getBoundingClientRect() // 获取 contentDiv 的位置
              const highlightRect = node.getBoundingClientRect() // 获取 highlightedElement 的位置
              // 计算相对于 contentDiv 的位置
              const relativeTop = highlightRect.top - contentRect.top;
              contentElement2.scrollTo({ top: relativeTop - 200, behavior: 'smooth' });
            }
          }, 100)
        }else{
          console.log("未找到该节点")
          return
        }
      })
    },
    scrollTo(index) {
      this.$nextTick(() => {
        let node = this.$el.querySelector(`font[${this.flag}='${index}']`)
        if (node) {
          this.lightIndex = index
          node.scrollIntoView()
        }
      })
    },
    markNumber(index) {
      let parent = document.getElementById(this.pEle);
      let arr = []
      // 获取所有font标签
      let fonts = parent.getElementsByTagName('font');
      for (let i = 0; i < fonts.length; i++) {
        if (fonts[i].attributes.length > 0 && fonts[i].attributes[0].name.search('cross-text-hightlight') != -1) {
          arr.push(fonts[i])
        }
      }
      if (!arr[index]) {
        console.log("未找到该节点")
        return
      }
      let canvas = document.createElement('canvas')
      canvas.width = 200 // 设置canvas宽度
      canvas.height = 200 // 设置canvas高度
      let ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '150px Arial' // 设置文本字体大小和样式
      ctx.fillStyle = 'white' // 设置文本颜色
      ctx.textAlign = 'center' // 设置文本水平居中
      ctx.textBaseline = 'middle' // 设置文本垂直居中
      ctx.fillText(index + 1, 95, 110) // 在canvas上绘制文本
      let img = new Image()
      img.src = canvas.toDataURL()
      let imageElement = document.createElement('img')
      imageElement.src = img.src
      // imageElement.style.zIndex = `${index}`
      imageElement.className = `common-marker`

      imageElement.style.setProperty('width', `${this.markWidth}`);
      imageElement.style.setProperty('height', `${this.markHeight}`);
      imageElement.style.setProperty('border-radius', '50%');
      imageElement.style.setProperty('background', `linear-gradient(to right, ${this.startColor}, ${this.endColor})`);
      imageElement.style.setProperty('color', `${this.textColor}`);
      imageElement.style.setProperty('border', `1px solid ${this.borderColor}`);
      imageElement.style.setProperty('line-height', `${this.markHeight}`);
      imageElement.style.setProperty('font-weight', `${this.markWeight}`);
      imageElement.style.setProperty('position', 'absolute');
      imageElement.style.setProperty('left', `${this.markLeft}`);
      imageElement.style.setProperty('top', `${this.markTop}`);
      imageElement.style.setProperty('font-size', `${this.markFontSize}`);
      imageElement.style.setProperty('zoom', `${this.markZoom}`);
      imageElement.style.setProperty('text-align', 'center');
      imageElement.style.setProperty('user-select', 'none');
      imageElement.style.setProperty('z-index', '999');
      imageElement.style.setProperty('max-width', 'none', '!important');
      // 清除之前节点
      document.querySelectorAll(".common-marker").forEach(element => {
        element.remove();
      })
      // 把之前节点去掉
      arr[index].insertBefore(imageElement, arr[index].firstChild);
    },
    searchNext() {
      this.$nextTick(() => {
        let idx = this.lightIndex >= this.matchCount ? 1 : this.lightIndex + 1
        this.scrollToOrder(idx)
      })
    },
    searchLast() {
      this.$nextTick(() => {
        let idx = this.lightIndex <= 1 ? this.matchCount : this.lightIndex - 1
        this.scrollToOrder(idx)
      })
    },
    setStyle() {
      let style = document.head.querySelector(this.styleSelector)
      if (!style) {
        style = document.createElement('style')
        style.setAttribute(this.flag, 1)
      }
      style.innerText = `font[${this.flag}]{${this.highlightStyle};position:relative}font[${this.flag}='${this.lightIndex}']{${this.currentStyle};position:relative}`
      document.head.appendChild(style)
    },
    clearStyle() {
      let style = document.head.querySelector(this.styleSelector)
      style && document.head.removeChild(style)
    }
  }
}
</script>

<style scoped lang="scss">
.content-main {
  position: relative;

  #contentMenu {
    position: absolute;
    border-radius: 10px;
    z-index: 10;

    ul {
      margin: 0;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 2px;
      //background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      background-color: #2e3138;
      color: rgba(255, 255, 255, 0.85);

      li {
        padding: 10px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        width: 112px;
        font-size: 14px;
        padding: 0 11px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.85);
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;

        i {
          width: 12px;
          height: 12px;
        }

        span {
          margin-left: 6px;
          font-size: 12px;
        }

        &:hover {
          background: rgba(204, 229, 255, 0.08);
        }
      }
    }

  }
}
</style>
