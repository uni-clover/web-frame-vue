<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="active" :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    active: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    // 由于同路由参数搭在地址栏的，故添加fullPath为key，可以缓存同路由的多个页面
    key() {
      // 页面刷新后，中文不会被转码。此处强制转码，避免刷新后首次缓存失效
      return encodeURI(decodeURI(this.$route.fullPath))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/frame/variables.scss";
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: $appMainBg;
}

.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 95px);
  }

  .fixed-header + .app-main {
    padding-top: 95px;
  }
}
</style>
