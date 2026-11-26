<!-- ProductImageCard.vue -->
<template>
  <a-card
    title="产品图片"
    class="hlm-card-png"
    :head-style="headStyle"
    :body-style="{ padding: 0 }"
  >
    <div class="product-image-wrapper">
      <img
        :src="image"
        :style="imageStyle"
        @click="handleClick"
        @load="handleLoad"
      />
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'ProductImageCard',
  props: {
    image: { type: String, default: '' },
    headStyle: { type: Object, default: () => ({}) }
  },
  emits: ['preview'],
  data() {
    return { imageWidth: null, imageHeight: null }
  },
  computed: {
    imageStyle() {
      if (!this.imageWidth || !this.imageHeight) return {}
      const containerWidthVw = (640 / 1920) * 100
      const containerHeightVh = (319 / 1080) * 100
      const viewportWidth = window.innerWidth
      const imageWidthVw = (this.imageWidth / viewportWidth) * 100
      const imageHeightVh = (this.imageHeight / 1080) * 100
      const widthScale = containerWidthVw / imageWidthVw
      const heightScale = containerHeightVh / imageHeightVh
      const scale = Math.min(widthScale, heightScale)
      return {
        width: `${imageWidthVw * scale}vw`,
        height: `${imageHeightVh * scale}vh`,
        display: 'block',
        maxWidth: `${containerWidthVw}vw`,
        maxHeight: `${containerHeightVh}vh`,
        objectFit: 'contain',
        margin: 'auto'
      }
    }
  },
  methods: {
    handleLoad(e) {
      this.imageWidth = e.target.naturalWidth
      this.imageHeight = e.target.naturalHeight
    },
    handleClick() {
      this.$emit('preview', this.image)
    }
  }
}
</script>

<style scoped>
.product-image-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>
