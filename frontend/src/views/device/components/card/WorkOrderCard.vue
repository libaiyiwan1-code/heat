<template>
  <a-card
    title="工单信息"
    class="hlm-card-workNumber"
    :head-style="headStyle"
    :body-style="bodyStyle"
  >
    <div class="hlm-card-workNumber-body">
      <div
        v-for="item in infoList"
        :key="item.label"
        class="hlm-card-workNumber-body-info-line"
      >
        <span class="label hlm-card-workNumber-body-info-line-label">
          {{ item.label }}
        </span>
        <span class="value hlm-card-workNumber-body-info-line-value">
          {{ item.value }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'WorkOrderCard',
  props: {
    workDetail: {
      type: Object,
      required: true,
      default: () => ({})
    },
    headStyle: {
      type: Object,
      default: () => ({})
    },
    bodyStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    infoList() {
      const d = this.workDetail || {}
      return [
        { label: '加工单号:', value: d.workNumber },
        { label: '产品编码:', value: d.productCode },
        { label: '产品名称:', value: d.productName },
        { label: '型号规格:', value: d.productModel },
        { label: '程序名称: ', value: d.programName },
        { label: '工单数量: ', value: d.workQuantity },
        { label: '完工日期: ', value: d.finishDate },
        { label: '厂商代码: ', value: d.vendorCode },
        { label: '注意事项: ', value: d.memo }
      ]
    }
  }
}
</script>

<style scoped>
/* 只保留与本组件相关的样式，避免污染全局 */
.hlm-card-workNumber {
  width: calc(640 / 1920 * 100vw);
  height: calc(360 / 1080 * 100vh);
  border: 1px solid grey;
  left: 0;
}

.hlm-card-workNumber-body {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-workNumber-body-info-line {
  text-align: left;
  display: flex;
  width: 100%;
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-workNumber-body-info-line-label {
  width: calc(80 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-workNumber-body-info-line-value {
  width: calc(520 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
}

/* 继承原有 label / value 样式（如果全局已有可删掉） */
.label {
  color: black;
  font-weight: bold;
  font-size: calc(15 / 1920 * 100vw);
}

.value {
  color: #FF770F;
  font-weight: bold;
  font-size: calc(15 / 1920 * 100vw);
}
</style>
