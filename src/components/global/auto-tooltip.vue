<template>
  <el-tooltip
    :disabled="hidden"
    @mouseenter.native="onMouseEnter"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #default>
      <div class="text-ellipsis">
        <slot></slot>
      </div>
    </template>
    <template #content>
      <slot name="content">
        <p v-for="text of contents" :key="text">{{text}}</p>
      </slot>
    </template>
  </el-tooltip>
</template>
<script>
/**
 * 用于文字超出时的自动提示，使用此组件包裹文本节点即可
 * 1、文字未超出时，不会显示提示，超出则鼠标移入显示提示
 * 2、若有多个节点，提示时会自动换行
 * @author wangqian
 * @date 2020/08/19
 */

import { getStyle } from 'element-ui/lib/utils/dom'
export default {
  props: {
    content: null,
    // 是否禁用提示功能
    disabled: Boolean,
    // 是否自动判断省略显示，关闭后将无提示
    autoEllipsis: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      overflow: false,
      contents: []
    }
  },
  computed: {
    // 转化内容为字符串
    contentText() {
      if (!this.content) return ''
      if (typeof this.content === 'string') return this.content
      if (this.content.toString) return this.content.toString()
      return this.content + ''
    },
    // 是否隐藏 => disabled
    hidden() {
      if (!this.autoEllipsis) return this.disabled
      if (this.disabled) return true
      return !this.overflow
    }
  },
  methods: {
    // 鼠标移入
    onMouseEnter(e) {
      this.$emit('mouseenter', e)
      if (!this.autoEllipsis) return
      const overflow = this.calcOverflow()
      this.overflow = overflow
      if (!overflow) return
      this.contents = this.content ? [this.contentText] : this.getContents()
    },
    // 计算当前文本内容是否溢出
    calcOverflow() {
      const el = this.$el
      const range = document.createRange()
      range.setStart(el, 0)
      range.setEnd(el, el.childNodes.length)
      const rangeWidth = Math.trunc(range.getBoundingClientRect().width)
      const padding =
        (parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(el, 'paddingRight'), 10) || 0)
      return rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth
    },
    // 获取当前内容
    getContents() {
      const nodes = this.$slots.default
      if (!nodes) return []
      return nodes.filter(it => it.elm).map(it => it.elm.textContent.trim())
    }
  }
}
</script>
<style scoped>
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
