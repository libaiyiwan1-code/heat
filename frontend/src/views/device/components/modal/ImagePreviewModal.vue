<template>
  <a-modal
    :visible="visible"
    :footer="null"
    :closable="true"
    :style="{ marginTop: '15vh', marginLeft: '29vw' }"
    @cancel="$emit('cancel')"
  >
    <img
      v-if="image"
      :src="image"
      class="preview-image"
      alt="产品图片预览"
    />
  </a-modal>
</template>

<script>
export default {
  name: 'ImagePreviewModal',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
  },

  emits: ['cancel'],
};
</script>

<style scoped>
.preview-image {
  display: block;
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  margin: 0 auto;
}
</style>
