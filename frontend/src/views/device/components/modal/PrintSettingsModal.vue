<template>
  <a-modal
    :visible="visible"
    title="打印机，标签设置"
    :body-style="{ height: '60vh' }"
    style="margin-left: 22vw; margin-top: -5vh"
    ok-text="确定"
    cancel-text="取消"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 打印机列表 -->
    <div>
      <a-list size="small" bordered :data-source="localPrinterList">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-checkbox
              v-model:checked="item.isSelected"
              @change="togglePrinterSelection(item)"
            >
              {{ item.displayName }}
            </a-checkbox>
          </a-list-item>
        </template>
        <template #header>
          <div>打印机列表</div>
        </template>
      </a-list>
    </div>

    <!-- 标签设置表单 -->
    <a-form layout="horizontal" style="width: 100%; margin-top: 0.5vh">
      <div style="font-weight: bold; margin-bottom: 10px;">标签设置</div>

      <a-row :gutter="8">
        <!-- 第一列 -->
        <a-col :span="11">
          <a-form-item label="标签尺寸(宽×高)">
            <a-select
              v-model:value="selectLabelPaperSize"
              style="width: 7vw"
              @change="onSizeChange"
            >
              <a-select-option v-for="item in labelPaperSizeList" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="双排标签设置">
            <div style="display: flex; align-items: center; gap: 10px;">
              <a-select
                v-model:value="listDoubleRowLabels"
                style="width: 7vw; margin-left: 18px"
                @change="onDoubleRowLabelsChange"
              >
                <a-select-option v-for="item in selectDoubleRowLabels" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </a-form-item>

          <a-form-item label="标签字号(mm)">
            <a-input-number
              v-model:value="secondColumnFontSize"
              :min="1"
              style="width: 7vw; margin-left: 14px"
              placeholder="字号"
            />
          </a-form-item>

          <a-form-item label="标签下距(mm)">
            <a-input-number
              v-model:value="labelMargin"
              :min="-20"
              style="width: 7vw; margin-left: 14px"
              placeholder="下边距"
            />
          </a-form-item>

          <a-form-item label="标签右移(mm)">
            <a-input-number
              v-model:value="lableMarginLeft"
              :min="-20"
              style="width: 7vw; margin-left: 14px"
              placeholder="右移"
            />
          </a-form-item>
        </a-col>

        <!-- 第二列 -->
        <a-col :span="12">
          <a-form-item label="标签宽度(mm)">
            <a-input-number
              v-model:value="labelWidth"
              :min="1"
              style="width: 8vw"
              placeholder="宽度"
            />
          </a-form-item>

          <a-form-item label="标签高度(mm)">
            <a-input-number
              v-model:value="labelHeight"
              :min="1"
              style="width: 8vw"
              placeholder="高度"
            />
          </a-form-item>

          <a-form-item label="标签预览(图片)">
            <div class="label-preview-box">
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="标签预览"
                class="label-preview-thumb"
                @click="openLabelModal(previewImage)"
              />
              <span v-else class="label-preview-empty">暂无预览</span>
              <div class="label-preview-desc">
                {{ imageDesc || '点击查看大图' }}
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- 标签大图预览 -->
    <a-modal
      :visible="labelModalVisible"
      :footer="null"
      :closable="true"
      :bodyStyle="{ padding: 0, height: '80vh', background: '#000' }"
      centered
      width="90%"
      @cancel="closeLabelModal"
    >
      <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
        <img
          :src="selectedLabelImage"
          style="max-width:100%; max-height:100%; object-fit:contain;"
        />
        <div style="position: absolute; bottom: 20px; left: 20px; right: 20px;
          background: rgba(0,0,0,0.7); color: #fff; padding: 8px 12px;
          border-radius: 6px; font-size: 14px; text-align:center;">
          {{ imageDesc || '标签图片' }}
        </div>
        <div style="position: absolute; top: 10px; right: 50px; color: rgba(255,255,255,0.7); font-size: 12px;">
          点击空白处关闭
        </div>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>
import preview40x20 from '@/assets/label/40x20.png'
import preview50x12 from '@/assets/label/50x12.png'
import preview30x12 from '@/assets/label/30x12.png'
import preview28x15 from '@/assets/label/30x12.png'

export default {
  name: 'PrintSettingsModal',

  props: {
    visible: { type: Boolean, default: false },
    printerList: { type: Array, default: () => [] },

    // 上次选中的打印机名，打开时用来回显
    initialPrinterName: { type: String, default: '' },

    initialPaperSize: { type: String, default: '40x20' },
    initialLabelWidth: { type: Number, default: 40 },
    initialLabelHeight: { type: Number, default: 19 },
    initialLabelMargin: { type: Number, default: 3 },
    initialLableMarginLeft: { type: Number, default: 14 },
    initialSecondColumnFontSize: { type: Number, default: 3.6 },
    initialListDoubleRowLabels: { type: String, default: '是' }
  },

  emits: ['update:visible', 'ok', 'cancel'],

  data() {
    return {
      labelPaperSizeList: ['30x12', '40x20', '50x12', '28x15', '20x10'],
      selectDoubleRowLabels: ['是', '否'],
      labelImages: {
        '40x20': preview40x20,
        '30x12': preview30x12,
        '50x12': preview50x12,
        '28x15': preview28x15
      },

      // 打印机列表本地副本（避免直接改父组件的 printerList）
      localPrinterList: [],

      // 标签设置草稿
      selectLabelPaperSize: '40x20',
      labelWidth: 40,
      labelHeight: 19,
      labelMargin: 3,
      lableMarginLeft: 14,
      secondColumnFontSize: 3.6,
      listDoubleRowLabels: '是',
      previewImage: null,
      imageDesc: '40x20标签样例',

      // 标签大图
      labelModalVisible: false,
      selectedLabelImage: ''
    }
  },

  watch: {
    // 打开时初始化
    // val === true（打开）→ 调 resetFromProps()，把父组件的初始值灌入草稿
    // val === false（关闭）→ 不做事
    visible(val) {
      if (val) this.resetFromProps()
    },

    // 父组件的 printerList 变化时，如果弹窗开着，重新初始化
    printerList: {
      handler() {
        if (this.visible) this.resetFromProps()
      },
      deep: true //深层监听
    },

  },

  mounted() {
    // 组件首次挂载时也初始化一次（防止打开时 watch 没触发）
    this.resetFromProps()
  },

  methods: {
    /* ---------- 草稿初始化 ---------- */
    resetFromProps() {
      // 1. 打印机列表：深拷贝 + 按 initialPrinterName 回显 isSelected
      this.localPrinterList = this.printerList.map(p => ({ ...p }))
      this.localPrinterList.forEach(item => {
        item.isSelected = (item.name === this.initialPrinterName)
      })

      // 2. 标签参数：从 props 灌入草稿
      this.selectLabelPaperSize = this.initialPaperSize
      this.labelWidth = this.initialLabelWidth
      this.labelHeight = this.initialLabelHeight
      this.labelMargin = this.initialLabelMargin
      this.lableMarginLeft = this.initialLableMarginLeft
      this.secondColumnFontSize = this.initialSecondColumnFontSize
      this.listDoubleRowLabels = this.initialListDoubleRowLabels
      // 3. 更新预览图
      this.updatePreview()
    },

    /* ---------- 预览图 ---------- */
    updatePreview() {
      this.previewImage = this.labelImages[this.selectLabelPaperSize] || null
    },

    /* ---------- 标签尺寸切换 ---------- */
    onSizeChange() {
      this.updatePreview()
      if (this.selectLabelPaperSize === '40x20') {
        this.imageDesc = '40mm x 20mm 标签纸预览图'
        this.labelHeight = 19
        this.labelWidth = 40
        this.labelMargin = 3
        this.lableMarginLeft = 14
        this.secondColumnFontSize = 3.6
      } else if (this.selectLabelPaperSize === '30x12') {
        this.imageDesc = '30mm x 12mm 标签纸预览图'
        this.labelHeight = 11
        this.labelWidth = 30
        this.labelMargin = 8
        this.lableMarginLeft = 31
        this.secondColumnFontSize = 4
        if (this.listDoubleRowLabels === '是') {
          this.labelHeight = 11
          this.labelWidth = 30
          this.labelMargin = 8
          this.lableMarginLeft = 31
          this.secondColumnFontSize = 4
        }
      } else if (this.selectLabelPaperSize === '50x12') {
        this.imageDesc = '50mm x 12mm 标签纸预览图'
        this.labelHeight = 11
        this.labelWidth = 50
        this.labelMargin = 8
        this.lableMarginLeft = 7
        this.secondColumnFontSize = 3.3
      } else if (this.selectLabelPaperSize === '28x15') {
        this.imageDesc = '28mm x 15mm 标签纸预览图'
        this.labelHeight = 11
        this.listDoubleRowLabels = '否'
        this.labelWidth = 28
        this.labelMargin = 8
        this.lableMarginLeft = 12
        this.secondColumnFontSize = 5
      } else if (this.selectLabelPaperSize === '20x10') {
        this.imageDesc = '20mm x 10mm 标签纸预览图'
        this.labelHeight = 8
        this.listDoubleRowLabels = '否'
        this.labelWidth = 20
        this.labelMargin = 12
        this.lableMarginLeft = 46
        this.secondColumnFontSize = 3
      }
    },

    /* ---------- 双排标签切换 ---------- */
    onDoubleRowLabelsChange() {
      this.updatePreview()
      if (this.selectLabelPaperSize === '30x12' && this.listDoubleRowLabels === '是') {
        this.imageDesc = '30mm x 12mm 标签纸预览图'
        this.labelHeight = 11
        this.labelWidth = 30
        this.labelMargin = 8
        this.lableMarginLeft = 31
      }
      if (this.selectLabelPaperSize === '50x12' && this.listDoubleRowLabels === '否') {
        this.imageDesc = '50mm x 12mm 标签纸预览图'
        this.labelHeight = 11
        this.labelWidth = 50
        this.labelMargin = 8
        this.lableMarginLeft = 33
        this.secondColumnFontSize = 3.3
      }
      if (this.selectLabelPaperSize === '28x15' && this.listDoubleRowLabels === '否') {
        this.imageDesc = '28mm x 15mm 标签纸预览图'
        this.labelHeight = 11
        this.labelWidth = 28
        this.labelMargin = 8
        this.lableMarginLeft = 12
        this.secondColumnFontSize = 5
      }
      if (this.selectLabelPaperSize === '20x10' && this.listDoubleRowLabels === '否') {
        this.imageDesc = '20mm x 10mm 标签纸预览图'
        this.labelHeight = 9
        this.labelWidth = 20
        this.labelMargin = 5
        this.lableMarginLeft = 12
        this.secondColumnFontSize = 3
      }
    },

    /* ---------- 打印机选择（只改本地副本） ---------- */
    togglePrinterSelection(printer) {
      this.localPrinterList.forEach(item => {
        if (item !== printer) item.isSelected = false
      })
      printer.isSelected = true
    },

    /* ---------- 标签大图 ---------- */
    openLabelModal(url) {
      if (!url) return
      this.selectedLabelImage = url
      this.labelModalVisible = true
    },

    closeLabelModal() {
      this.labelModalVisible = false
      this.selectedLabelImage = ''
    },

    /* ---------- 提交 ---------- */
    handleOk() {
      const selectedPrinter = this.localPrinterList.find(item => item.isSelected)
      if (!selectedPrinter) {
        this.$message.error('请选择打印机')
        return
      }

      // 校验
      if (
        this.labelMargin === undefined ||
        this.labelWidth === undefined ||
        this.lableMarginLeft === undefined ||
        this.secondColumnFontSize === undefined ||
        this.labelHeight === undefined ||
        this.listDoubleRowLabels === undefined
      ) {
        this.$message.error('请配置打印参数')
        return
      }

      // 抛给父组件
      this.$emit('ok', {
        printerName: selectedPrinter.name,
        paperSize: this.selectLabelPaperSize,
        labelWidth: this.labelWidth,
        labelHeight: this.labelHeight,
        labelMargin: this.labelMargin,
        lableMarginLeft: this.lableMarginLeft,
        secondColumnFontSize: this.secondColumnFontSize,
        whetherDoubleRowPrinting: this.listDoubleRowLabels
      })

      this.$emit('update:visible', false)
    },

    /* ---------- 取消 ---------- */
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.label-preview-box {
  width: 90%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px;
  min-height: 7vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  position: relative;
  overflow: hidden;
}
.label-preview-thumb {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  cursor: pointer;
}
.label-preview-empty {
  color: #999;
  z-index: 1;
}
.label-preview-desc {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 2;
  pointer-events: none;
}
</style>
