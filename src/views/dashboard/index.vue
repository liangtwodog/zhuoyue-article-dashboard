<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text"></div> -->
    <div class="index">
      <span class="index-text">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      title: this.$store.state.settings.title
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
     .index {
      position: fixed;
      margin: auto;
      left: 0;
      right: 0;
      top: 0;
      bottom: 100px;
      width: 268px;
      height: 204px;
      background-size: 100%;
      &-text {
        position: absolute;
        bottom: 40px;
        right: 26px
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
