<template>
  <div class="hlm-assignmentTips" :style="style">
    <a-button class="hlm-assignmentTips-button-style static-btn">作业提示</a-button>
    <a-button class="hlm-assignmentTips-button-text-style static-btn">{{ text }}</a-button>
  </div>
</template>

<script>
export default {
  name: 'AssignmentTipBar',
  props: {
    // 提示文字
    text: {
      type: String,
      default: ''
    },

    style: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>
