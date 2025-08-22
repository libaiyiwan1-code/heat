<template>
  <div>
    <custom-title-bar :page="'device'"
                      :isDeviceView="true"
                      :userAccount="this.routerParam.userName"
                      :productModel="this.productModel"
                      :isMaximized="this.isMaximized"
                      @toggle-maximize="handleToggleMaximize"
                      @minimize-window="handleMinimizeWindow"
                      @close-window="handleCloseWindow"
    />
    <a-layout style="height: 100vh; width: 100vw;overflow: hidden;">
      <a-layout-content style=" height: 100%; width: 100%;margin-top: -1.1vh">


        <div>
          <a-modal
            v-model:visible="modalShow.configInputDetailModalShow"
            title="参数配置"
            :bodyStyle="{ height: '54vh' }"
            style="margin-left: 22vw; margin-top: -5vh"
            okText="确定"
            cancelText="取消"
            @ok="configInputDetailModalOk()"
          >
            <a-form
              layout="horizontal"
              style="width: 100%; height: 100%"
            >
              <a-row :gutter="4">
                <a-col :span="11">
                  <h1 style="font-weight: bold;margin-top: -2vh"
                      v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    配置项</h1>
                  <a-form-item label="压力探头" v-show="this.isNBDevice===true"
                               v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <a-select
                      v-model:value="this.configForm.pressureProbes"
                      style="width: 7vw; margin-left: 3vw"
                      placeholder="需手动录入"
                      @change="changePrintModel()"
                    >
                      <a-select-option
                        v-for="item in this.pressureProbesList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="测温类型" v-show="this.isNBDevice===true"
                               v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <a-select
                      v-model:value="this.configForm.temperatureProbes"
                      style="width: 7vw; margin-left: 3vw"
                      placeholder="需手动录入"
                      @change="changePrintModel()"
                    >
                      <a-select-option
                        v-for="item in this.temperatureProbesList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="屏幕显示" v-show="this.isNBDevice===true"
                               v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <a-select
                      v-model:value="this.configForm.screenDisplay"
                      style="width: 7vw; margin-left: 3vw"
                      placeholder="需手动录入"
                    >
                      <a-select-option
                        v-for="item in this.screenDisplayList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="扭矩" v-show="this.isNBDevice===true&&this.configForm.produceModel==='WAC710CD'">
                    <a-select
                      v-model:value="this.configForm.torques"
                      style="width: 7vw; margin-left: 4.5vw"
                      placeholder="需手动录入"
                      @change="changePrintModel()"
                    >
                      <a-select-option
                        v-for="item in this.torquesList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="波特率">
                    <a-select style="width: 7vw; margin-left: 3.8vw"
                              v-model:value="this.portAttributes.selectedBadRate">
                      <a-select-option v-for="port in this.baudRateList" :value="port">{{
                          port
                        }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="校验位">
                    <a-select style="width: 7vw; margin-left: 3.8vw"
                              v-model:value="this.portAttributes.selectedCheckDigit">
                      <a-select-option v-for="port in this.checkDigitList" :value="port">{{
                          port
                        }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item label="电流源"
                               v-show="this.isNBDevice===true&&
                this.configForm.produceModel==='WAC710CD'&&
                this.configForm.pressureProbes==='压差'">
                    <a-select
                      v-model:value="this.configForm.currentSource"
                      style="width: 7vw; margin-left: 3.9vw"
                    >
                      <a-select-option
                        v-for="item in this.currentSourceList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="12">
                  <h1 style="font-weight: bold;margin-top: -2vh">验证项</h1>
                  <a-form-item label="产品型号">
                    <a-select
                      v-model:value="this.configForm.produceModel"
                      style="width: 7vw; margin-left: 4.7vw"
                      placeholder="需手动录入"
                      @change="handleProduceModelChange"
                    >
                      <a-select-option
                        v-for="item in this.produceModelList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item label="打印型号" v-show="this.isNBDevice===true"
                               v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <a-select
                      v-model:value="this.configForm.customizePrintLabel"
                      style="width: 7vw; margin-left: 4.7vw"
                      placeholder="需手动录入"
                    >
                      <a-select-option
                        v-for="item in this.customizePrintLabelList"
                        :value="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <!--                <a-form-item label="温度标定" v-show="this.isNBDevice===true">-->
                  <!--                  <a-input-number-->
                  <!--                    v-model:value="this.configForm.temperature"-->
                  <!--                    style="width: 7vw; margin-left: 3vw"-->
                  <!--                    placeholder="需手动录入"-->
                  <!--                  ></a-input-number>-->
                  <!--                </a-form-item>-->
                  <a-form-item label="温度误差"
                               v-show="this.isNBDevice===true && this.configForm.temperatureProbes!=='无探头'">
                    <a-input-number
                      v-model:value="this.configForm.temperatureDiff"
                      style="width: 7vw; margin-left: 4.8vw"
                      placeholder="需手动录入"
                    ></a-input-number>
                  </a-form-item>

                  <a-form-item label="源设误差(mA)"
                               v-show="this.isNBDevice===true&&
                             this.configForm.pressureProbes==='压差'&&
                             this.configForm.currentSource==='有'">
                    <a-input-number
                      v-model:value="this.configForm.cs_device_err"
                      style="width: 7vw; margin-left: 3.3vw"
                      placeholder="需手动录入"
                      :precision="3"
                      :parser="value => value.replace(/\.\d{3,}/, match => match.substring(0, 4))"
                      :formatter="value => typeof value === 'number' ? value.toFixed(3) : value"
                    ></a-input-number>
                  </a-form-item>
                  <a-form-item label="信源误差(mA)"
                               v-show="this.isNBDevice===true &&
                             this.configForm.pressureProbes==='压差'&&
                             this.configForm.currentSource==='有'">
                    <a-input-number
                      v-model:value="this.configForm.sig_cs_err"
                      style="width: 7vw; margin-left: 3.3vw"
                      placeholder="需手动录入"
                      :precision="3"
                      :parser="value => value.replace(/\.\d{3,}/, match => match.substring(0, 4))"
                      :formatter="value => typeof value === 'number' ? value.toFixed(3) : value"
                    ></a-input-number>
                  </a-form-item>
                  <a-form-item label="信设误差(mA)"
                               v-show="this.isNBDevice===true &&
                             this.configForm.pressureProbes==='压差'&&
                             this.configForm.currentSource==='无'">
                    <a-input-number
                      v-model:value="this.configForm.sig_device_err"
                      style="width: 7vw; margin-left: 3.2vw"
                      placeholder="需手动录入"
                      :precision="3"
                      :parser="value => value.replace(/\.\d{3,}/, match => match.substring(0, 4))"
                      :formatter="value => typeof value === 'number' ? value.toFixed(3) : value"
                    >
                    </a-input-number>
                  </a-form-item>
                  <a-form-item label="程序版本" v-show="this.isNBDevice===true"
                               v-if="this.configForm.produceModel!=='东元热表'">
                    <a-input
                      v-model:value="this.configForm.version"
                      style="width: 7vw; margin-left: 4.9vw"
                      placeholder="需手动录入"
                    ></a-input>
                  </a-form-item>
                  <a-form-item label="通信方式" v-show="this.isNBDevice===true"
                                             v-if="this.configForm.produceModel==='WAC330HE'">
                  <a-select
                    v-model:value="this.configForm.communication"
                    style="width: 7vw; margin-left: 4.7vw"
                    placeholder="需手动录入"
                  >
                    <a-select-option
                      v-for="item in this.communicationList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                </a-col>
              </a-row>

              <h2 style="margin-left: 6vw;  color: red; font-weight: bold;margin-top: -2vh"
                  v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                需手动录入项，现规格型号或接口不支持</h2>
              <a-form-item label="工序重点" style="margin-top: 3vh; margin-left: 4vw" v-show="this.isNBDevice===true"
                           v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                <div
                  style="width: 20vw; height: 5vh; border: 1px solid; padding: 4px;"
                >
    <textarea
      v-model="configForm.processFocus"
      style="width: 100%; height: 100%; border: none; resize: none; outline: none; overflow-y: auto;"
      placeholder="需手动录入"
    ></textarea>
                </div>
              </a-form-item>
              <!-- Password field at the bottom -->
              <a-form-item label="密码" style="margin-top: 20px;margin-left: 4vw">
                <a-input-password
                  style="width: 8vw; margin-left: 1.5vw"
                  v-model:value="this.password"
                  placeholder="请输入密码"
                />
              </a-form-item>
            </a-form>
          </a-modal>
        </div>

        <div>
          <!--        <a-modal v-model:visible="modalShow.workNumberDetailModalShow" title="工单配置"
                           :bodyStyle="{  height: '26vh'  }"
                           style="margin-left: 22vw;margin-top: -5vh"
                           okText="确定" cancelText="取消" @ok="workNumberModalOk"

                  >
                    <a-form
                      layout="horizontal"
                      style="width: 100%;height: 100%"
                    >
                      <a-form-item label="工单号">
                        <a-input
                          v-model:value="this.workNumberForm.workNumber"
                          style="width: 12vw; margin-left: 3.4vw"
                          @input="handleWorkNumberInput"
                        />
                      </a-form-item>

                      <a-form-item label="工单注意事项">
                        <a-input v-model:value="this.workNumberForm.precautions" style="width: 20vw;margin-left: 1.2vw"></a-input>
                      </a-form-item>
                      <a-form-item label="开工注意事项">
                        <a-input v-model:value="this.workNumberForm.startPrecautions"
                                 style="width: 20vw;margin-left: 1.2vw"></a-input>
                      </a-form-item>

                      <a-form-item label="厂商代码">
                        <a-select v-model:value="this.workNumberForm.vendorCode" style="width: 7vw;margin-left: 2.7vw">
                          <a-select-option v-for="item in this.vendorCodeList"
                                           :value="item">
                            {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                      &lt;!&ndash;            <a-form-item label="客户">
                                    <a-select v-model:value="this.workNumberForm .customer" style="width: 7vw;margin-left: 2.65vw">
                                      <a-select-option v-for="item in this.customerList"
                                                       :value="item">
                                        {{ item }}
                                      </a-select-option>
                                    </a-select>
                                  </a-form-item>&ndash;&gt;
                      <a-form-item label="密码">
                        <a-input-password style="width: 8vw;margin-left: 4.1vw" v-model:value="this.password"
                                          placeholder="请输入密码"/>
                      </a-form-item>
                    </a-form>
                  </a-modal>-->
        </div>


        <div>
          <a-modal v-model:visible="modalShow.printDeviceModalShow" title="打印机，标签设置"
                   @ok="printDeviceModalHandleOk"
                   @open="setPreviousSelection"
                   :bodyStyle="{  height: '52vh' }"
                   style="margin-left: 22vw;margin-top: -5vh"
                   cancelText="取消" ok-text="确定">
            <div>
              <a-list size="small" bordered :data-source="printerList">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-checkbox v-model:checked="item.isSelected"

                                @change="togglePrinterSelection(item)">
                      {{ item.displayName }}
                    </a-checkbox>
                  </a-list-item>
                </template>
                <template #header>
                  <div>打印机列表</div>
                </template>
              </a-list>
            </div>
            <a-form layout="horizontal" style="width: 100%; height: 100%; margin-top: 5vh">
              <div style="font-weight: bold; margin-bottom: 10px;">标签设置</div>
              <a-form-item label="标签纸大小(宽*高)">
                <a-select v-model:value="this.selectLabelPaperSize" style="width: 7vw">
                  <a-select-option v-for="item in this.labelPaperSizeList" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="是否打印双排标签">
                <a-select v-model:value="this.listDoubleRowLabels" style="width: 7vw">
                  <a-select-option v-for="item in this.selectDoubleRowLabels" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form>

          </a-modal>
        </div>

        <div class="hlm-card-info-container">
          <a-card
            title="工单信息"
            class="hlm-card-workNumber"
            :headStyle="upperCardHeadStyle"
            :bodyStyle="upperCardBodyStyle"
          >
            <div class="hlm-card-workNumber-body" v-if="!this.routerParam.startsWithJ">
              <!-- 工单信息内容 -->
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">加工单号:</span>
                <span class="value hlm-card-workNumber-body-info-line-value"
                >{{ workDetail.workNumber }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">产品编码:</span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.productCode }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">产品名称:</span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.productName }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">型号规格:</span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.productModel }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">程序名称: </span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.programName }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">工单数量: </span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.workQuantity }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">完工日期: </span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.finishDate }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">厂商代码: </span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.vendorCode }}</span>
              </div>
              <div class="hlm-card-workNumber-body-info-line">
                <span class="label hlm-card-workNumber-body-info-line-label">注意事项: </span>
                <span class="value hlm-card-workNumber-body-info-line-value">{{ workDetail.memo }}</span>
              </div>

            </div>
          </a-card>

          <a-card
            title="配置信息"
            class="hlm-card-configInfo"
            :headStyle="upperCardHeadStyle"
            :bodyStyle="upperCardBodyStyle"
          >
            <!-- 使用 extra 插槽在标题栏添加按钮 -->
            <template #extra>
              <div style="display: flex; gap: 4px;     ">
                <!--        <a-button class="custom-button" @click="workNumberInputDetail">-->
                <!--          工单配置-->
                <!--        </a-button>-->
                <!--        <a-button class="custom-button" @click="configInputDetail" v-show="this.routerParam.produceMachine===0">
                          参数配置
                        </a-button>  -->
                <a-button class="custom-button config-btn" @click="configInputDetail">
                  参数配置
                </a-button>
                <a-button class="custom-button print-btn" @click="getPrinter">
                  打印设置
                </a-button>
              </div>
            </template>
            <div v-if="this.isNBDevice===true">
              <a-row style="width: calc(680/1920*100vw);height: calc(206/1080*100vh) ">
                <a-col class="hlm-card-nb-configInfo-body-left-column"
                       v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                  <div class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">测温类型:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        configDetail.temperatureProbe
                      }}</span>
                  </div>

                  <div class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">压力探头:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        configDetail.pressureProbes
                      }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">屏幕显示:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.screenDisplay }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line" v-show="configDetail.printLabel==='WAC710CD'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">扭矩:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.torques }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">温度误差:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        configDetail.temperatureDiff
                      }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configDetail.pressureProbes==='压差'&&this.configDetail.currentSource==='有'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">源设误差:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.cs_device_err+' mA' }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configDetail.pressureProbes==='压差'&&this.configDetail.currentSource==='有'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">信源误差:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.sig_cs_err+' mA' }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configDetail.pressureProbes==='压差'&&this.configDetail.currentSource==='无'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">信设误差:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        configDetail.sig_device_err+' mA'
                      }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line" v-show="configDetail.printLabel==='WAC710CD'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">电流源:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.currentSource }}</span>
                  </div>
                </a-col>
                <a-col class="hlm-card-nb-configInfo-body-right-column">
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">温度标定:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.temperature }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">标签型号:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.printLabel }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line"
                       v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">打印型号:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        configDetail.customizePrintLabel
                      }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line" v-if="this.routerParam.startsWithJ">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">产品型号:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.printLabel }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line" v-if="this.configForm.produceModel!=='东元热表'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">程序版本:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.version }}</span>
                  </div>
                  <div class="hlm-card-configInfo-body-info-line" v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel==='WAC330HE'">
                    <span class="label hlm-card-nb-configInfo-body-info-line-label">通信方式:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ this.configDetail.communication }}</span>
                  </div>

                </a-col>

              </a-row>

              <div class="hlm-card-configInfo-body-info-line"
                   style=" white-space: nowrap; margin-top: 3.5vh ">
                <div v-show="true" class="hlm-card-configInfo-body-info-line" style='margin-left: 0.9vw'>
                  <span class="label hlm-card-nb-configInfo-body-info-line-label">波特率: </span>
                  <span class="value hlm-card-configInfo-body-info-line-value">{{
                      this.portAttributes.selectedBadRate
                    }}</span>
                </div>
                <div v-show="true" class="hlm-card-configInfo-body-info-line" style="margin-left: -9.8vw">
                  <span class="label hlm-card-nb-configInfo-body-info-line-label">校验位: </span>
                  <span class="value hlm-card-configInfo-body-info-line-value">{{
                      this.portAttributes.selectedCheckDigit
                    }}</span>
                </div>
              </div>

              <div v-show="true" class="hlm-card-configInfo-body-info-line"
                   style='margin-top: -1vh; margin-left: 0.9vw'>
                <span class="label hlm-card-nb-configInfo-body-info-line-label">工序重点: </span>
                <span class="value hlm-card-configInfo-body-info-line-value">{{ configDetail.processFocus }}</span>
              </div>
              <div class="hlm-card-configInfo-body-info-line"
                   style="  margin-left: 0.9vw;white-space: nowrap;margin-top: -1vh;">
                <div class="info-line-span-printInfo" style="display: flex;align-items: center;">
                  <span class="label ">打印机名: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.printerName }}</span>
                </div>
                <div class="info-line-span-printInfo" style="margin-left: 2vw">
                  <span class="label">纸张大小: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.paperSize }}</span>
                </div>
                <div class="info-line-span-printInfo" style="margin-left: 2vw">
                  <span class="label">双排打印: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.whetherDoubleRowPrinting }}</span>
                </div>

              </div>
            </div>

            <div v-show="this.isNBDevice === false">
              <a-row style="width: calc(680/1920*100vw);height: calc(206/1080*100vh) ">
                <!--       左侧列         -->
                <a-col class="hlm-card-configInfo-body-left-column">
                  <div v-show="wireValveCardFormShow.model" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">规格型号:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{ wireValveCardForm.model }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.operatorLine" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">运营商:</span>
                    <span class="value hlm-card-configInfo-body-info-li ne-value">{{
                        this.operatorLineData[wireValveCardForm.operatorLine]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.temperatureProbe" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">温度探头:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.temperatureProbeData[wireValveCardForm.temperatureProbe]
                      }}</span></div>
                  <div v-show="wireValveCardFormShow.pressureProbes" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">压力探头:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.pressureProbeData[wireValveCardForm.pressureProbes]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.temperatureUpperLimit" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">温度上限:</span>
                    <span class="value">{{ wireValveCardForm.temperatureUpperLimit }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.temperatureDownLimit" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">温度下限:</span>
                    <span
                      class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.temperatureDownLimit
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.cleaningCycle" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">清洗周期: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.cleaningCycle
                      }}</span>
                  </div>

                </a-col>
                <!--       中间列         -->
                <a-col class="hlm-card-configInfo-body-center-column">
                  <div v-show="wireValveCardFormShow.openingUpperLimit" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">开度上限: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.openingUpperLimit
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.openingDownLimit" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">开度下限: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.openingDownLimit
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.heatingDate" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">供暖日期: </span>
                    <span
                      class="value hlm-card-configInfo-body-info-line-value">{{
                        `${wireValveCardForm.heatingStartDate}   ~  ${wireValveCardForm.heatingEndDate}`
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.powerState" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">断电状态:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.powerStateData[wireValveCardForm.powerState]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.wirelessAnomaly" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">无线异常:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.wirelessAnomalyData[wireValveCardForm.wirelessAnomaly]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.screenDisplay" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">屏幕显示:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.screenDisplayData[wireValveCardForm.screenDisplay]
                      }}</span>
                  </div>
                  <div v-show="true" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">程序版本: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.wireValveCardForm.version
                      }}</span>
                  </div>


                </a-col>
                <!--       右侧列         -->
                <a-col class="hlm-card-configInfo-body-right-column">
                  <div v-show="wireValveCardFormShow.regulationMode" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">调节模式:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.regulationModeData[wireValveCardForm.regulationMode]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.regulationModeValue" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">调节目标 :</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.wireValveCardForm.regulationModeValue
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.strongTemperatureSetting"
                       class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">强制设温: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        strongTemperatureSettingData[wireValveCardForm.strongTemperatureSetting]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.forcedTemperature" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">强制温度: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.forcedTemperature
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.selfRegulating" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">自调节:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.selfRegulatingData[wireValveCardForm.selfRegulating]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.adjustmentCycle" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">调节周期: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.adjustmentCycle
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.proportionalAdjustment" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">调节比例:</span>
                    <span
                      class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.proportionalAdjustment
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.swipeCard" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">刷卡功能: </span>
                    <span
                      class="value hlm-card-configInfo-body-info-line-value">{{
                        this.swipeCardData[wireValveCardForm.swipeCard]
                      }}
                  </span>
                  </div>
                  <div v-show="wireValveCardFormShow.mainAuxiliaryValve" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">副阀通讯:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.mainAuxiliaryValveData[wireValveCardForm.mainAuxiliaryValve]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.separateWarn" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">分离测试:</span>
                    <span
                      class="value hlm-card-configInfo-body-info-line-value">{{
                        separateWarnData[wireValveCardForm.separateWarn]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.factoryOpening" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">出厂状态:</span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        this.factoryOpeningData[wireValveCardForm.factoryOpening]
                      }}</span>
                  </div>
                  <div v-show="wireValveCardFormShow.adjustDeadZone" class="hlm-card-configInfo-body-info-line">
                    <span class="label hlm-card-configInfo-body-info-line-label">调节死区: </span>
                    <span class="value hlm-card-configInfo-body-info-line-value">{{
                        wireValveCardForm.adjustDeadZone
                      }}</span>
                  </div>
                </a-col>
              </a-row>
              <div v-show="true" class="hlm-card-configInfo-body-info-line" style='margin-top:2vh;margin-left: 0.9vw'>
                <span class="label">工序重点: </span>
                <span class="value" style="margin-left: 0.9vw">{{ wireValveCardForm.processFocus }}</span>
              </div>
              <div class="hlm-card-configInfo-body-info-line"
                   style=" margin-top:1vh;margin-left: 0.9vw;white-space: nowrap;">
                <div class="info-line-span-printInfo" style="display: flex;align-items: center;">
                  <span class="label">打印机名: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.printerName }}</span>
                </div>
                <div class="info-line-span-printInfo" style="margin-left: 2vw">
                  <span class="label">纸张大小: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.paperSize }}</span>
                </div>
                <div class="info-line-span-printInfo" style="margin-left: 2vw">
                  <span class="label">双排打印: </span>
                  <span class="value" style="margin-left: 0.8vw">{{ configDetail.whetherDoubleRowPrinting }}</span>
                </div>

              </div>

            </div>


          </a-card>


          <a-card
            v-show="!this.routerParam.startsWithJ"
            title="产品图片"
            class="hlm-card-png"
            :headStyle="upperCardHeadStyle"
            :bodyStyle="{
              padding: 0,/*无边距*/
            }"
          >
            <div style="
                position: relative;
                height: 100%;
                width: 100%;
                align-items: center;
                justify-content: center;
                overflow: hidden;
           ">
              <template v-if="mainImage">
                <img
                  :src="mainImage"
                  :style="getImageStyle()"
                  @click="openModal(mainImage)"
                  @load="onImageLoad"
                />
              </template>
              <template v-else>
                <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed grey;
        color: grey;
      ">
                  未获取到照片
                </div>
              </template>
            </div>
          </a-card>
          <a-modal
            :visible="modalShow.imageModalVisible"
            :footer="null"
            :closable="true"
            @cancel="closeModal"
            width="80vw"
            centered
          >
            <img
              :src="selectedImage"
              style="width: 100%; height: auto; object-fit: contain; max-height: 80vh;"
            />
          </a-modal>
          <!--        <a-card
                    title="产品首件图片"
                    style="height: 35vh; width: 46.5vw;margin-top: -35vh;margin-left: 55.5vw;border:1.5px solid grey;"
                    :headStyle="{
                      textAlign: 'left',
                      background: 'linear-gradient(45deg, #409EFF, #67C23A)',
                      color: '#fff',
                      fontWeight: 'bold',
                      padding: '0.9px 16px'}"

                  >
                    <a-row :gutter="5" style="height: 100%;width: 100%">
                      <img src="http://192.168.0.159:82/bdaFile/preview?objectKey=1910246876502339585"
                           style="width: 15.3vw;
                           height: 29.3vh;
                           margin-top: -2.1vh;
                           margin-left: -1.22vw;
                           object-fit: cover;"/>
                      <img src="http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897"
                           style="width: 15.3vw;
                           height: 29.3vh;
                           margin-top: -2.1vh;
                           margin-left: -1.22vw;
                           object-fit: cover;"/>
                      <img src="http://192.168.0.159:82/bdaFile/preview?objectKey=1696475386392657922"
                           style="width: 18vw;
                           height: 14.5vh;
                           margin-top: -29.3vh;
                           margin-left: 28.1vw;
                           object-fit: cover;"/>
          &lt;!&ndash;     http://192.168.0.159:81/api/prdMaterial/info?materialCode=3B0340010       当前产品图片获取链接。  &ndash;&gt;
                      <img src="http://192.168.0.159:82/bdaFile/preview?objectKey=1696475765050228737"
                           style="width: 18vw;
                           height: 14.9vh;
                           margin-top: -14.8vh;
                           margin-left: 28.1vw;
                           object-fit: cover;"/>
                    </a-row>

                  </a-card>-->
        </div>

        <div class="hlm-frock-container" v-if="this.isNBDevice!==undefined && this.isNBDevice">
          <a-card :title="this.leftProduceViewTitle"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle"
          >

            <!--&&configDetail.currentSource==='有'&&this.configDetail.pressureProbes==='压差'            -->
            <!-- 左侧工装内容 -->
            <a-form
              v-if="this.configDetail.pressureProbes!=='压差'"
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">设备串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortOne"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortOne,'one')">
                <a-select-option v-for="port in this.computedPortsExcludeLeft" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>


              <a-form-item>
                <a-button
                  class="hlm-operate-button-style"
                  @click="openPort(
                this.portAttributes.selectedPortOne,
                'one'
              )"
                  :disabled="!this.portAttributes.portClosedOneStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button
                  class="hlm-operate-button-style"
                  @click="closePort(this.portAttributes.selectedPortOne,'one')"
                  :disabled="this.portAttributes.portClosedOneStatus">关闭
                </a-button>
              </a-form-item>
            </a-form>


            <a-form
              v-if="this.configDetail.pressureProbes==='压差'&&configDetail.currentSource==='无'"
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">设备串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortOne"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortOne,'one')">
                <a-select-option v-for="port in this.computedPortsExcludeLeft" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>


              <a-form-item>
                <a-button
                  class="hlm-operate-button-style"
                  @click="openPort(
                this.portAttributes.selectedPortOne,
                'one'
              )"
                  :disabled="!this.portAttributes.portClosedOneStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button
                  class="hlm-operate-button-style"
                  @click="closePort(this.portAttributes.selectedPortOne,'one')"
                  :disabled="this.portAttributes.portClosedOneStatus">关闭
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">信号源串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortSignalSource"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortSignalSource,'three')">
                <a-select-option v-for="port in this.computedPortsExcludeRight" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="openPort(
                          this.portAttributes.selectedPortSignalSource,'three' )"
                          :disabled="!this.portAttributes.portClosedSignalSourceStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-operate-button-style"
                          @click="closePort(this.portAttributes.selectedPortSignalSource,'three')"
                          :disabled="this.portAttributes.portClosedSignalSourceStatus">关闭
                </a-button>
              </a-form-item>
            </a-form>

            <a-form
              v-if="this.configDetail.pressureProbes==='压差'&&configDetail.currentSource==='有'"
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">设备串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortOne"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortOne,'one')">
                <a-select-option v-for="port in this.computedPortsExcludeLeft" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>


              <a-form-item>
                <a-button
                  class="hlm-operate-button-style"
                  @click="openPort(
                this.portAttributes.selectedPortOne,
                'one'
              )"
                  :disabled="!this.portAttributes.portClosedOneStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button
                  class="hlm-operate-button-style"
                  @click="closePort(this.portAttributes.selectedPortOne,'one')"
                  :disabled="this.portAttributes.portClosedOneStatus">关闭
                </a-button>
              </a-form-item>
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">信号源串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortSignalSource"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortSignalSource,'three')">
                <a-select-option v-for="port in this.computedPortsExcludeRight" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="openPort(
                          this.portAttributes.selectedPortSignalSource,'three' )"
                          :disabled="!this.portAttributes.portClosedSignalSourceStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-operate-button-style"
                          @click="closePort(this.portAttributes.selectedPortSignalSource,'three')"
                          :disabled="this.portAttributes.portClosedSignalSourceStatus">关闭
                </a-button>
              </a-form-item>


            </a-form>


            <a-form
              v-if="this.configDetail.pressureProbes==='压差'&&configDetail.currentSource==='有'"
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">电流源串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortCurrentSource"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortCurrentSource,'four')">
                <a-select-option v-for="port in this.computedPortsExcludeRight" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>

              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="openPort(
                this.portAttributes.selectedPortCurrentSource,
                'four'
              )"
                          :disabled="!this.portAttributes.portClosedCurrentSourceStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-operate-button-style"
                          @click="closePort(this.portAttributes.selectedPortCurrentSource,'four')"
                          :disabled="this.portAttributes.portClosedCurrentSourceStatus">关闭
                </a-button>
              </a-form-item>

            </a-form>


            <!--                </div>-->
            <!--              </div>-->


            <!--              <div v-if="this.configForm.produceModel === 'WAC710CD'&&this.configDetail.pressureProbes==='压差'">-->

            <!--                <div style="display: inline-flex" v-show="configDetail.currentSource==='有'">-->

            <!--                </div>-->
            <!--              </div>-->
            <div class="hlm-assignmentTips">
              <a-button class="hlm-assignmentTips-button-style static-btn">作业提示</a-button>
              <a-button class="hlm-assignmentTips-button-text-style static-btn"> {{ leftWorkPrompt }}</a-button>

            </div>


            <div style="position: relative; display: inline-flex; margin-left:-2vw;   margin-top: calc(20/1080*100vh)">
              <!--            二次验证用写地址组件              -->
              <a-form
                name="basic"
                layout="inline"
                style="margin-left: -16.6vw"
                v-if="this.routerParam.startsWithJ"
              >
                <a-form-item label="写入地址">
                  <a-input
                    style="width: 10vw"
                    type="text"
                    v-model:value="this.secondaryInspectionGenerateAddress"
                    placeholder="请输入地址"
                    ref="secondaryInspectionGenerateAddress"
                    @keydown.enter="handleEnterSecondaryInspection"
                    @input="validateNumberInputSecondaryInspectionGenerateAddress"
                  ></a-input>
                </a-form-item>
              </a-form>
              <a-button type="primary" block
                        v-if="this.routerParam.startsWithJ"
                        @click="quadraticVerify(protocolIDMap[this.configForm.produceModel].protocolId,'one')"
                        :disabled="nbButtonDisabledStatus.quadraticVerify"
                        :style="{
                           backgroundColor: nbButtonColor.quadraticVerify
                        }">
                二次验证
              </a-button>

              <a-button type="primary" block
                        v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'"
                        @click="selfTest(protocolIDMap[this.configForm.produceModel].protocolId,'one')"
                        :disabled="nbButtonDisabledStatus.selfTest"
                        :style="{
                           backgroundColor: nbButtonColor.selfTest
                        }"
                        class="hlm-nb-business-start-button-style"
              >
                自检发送
              </a-button>
              <a-button type="primary" block
                        v-if="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'"
                        @click="addressWrite(protocolIDMap[this.configForm.produceModel].protocolId,'one')"
                        :disabled="nbButtonDisabledStatus.writeAddress"
                        :style="{
                           backgroundColor: nbButtonColor.writeAddress
                        }"
                        class="hlm-nb-business-start-button-style"
              >
                地址写入
              </a-button>
              <a-button type="primary" block
                        v-if="
                      this.configDetail.printLabel === 'WAC230CF'||
                      this.configDetail.printLabel === 'WAC710CD'||
                      this.configDetail.printLabel === 'WAC300CD'||
                      this.configDetail.printLabel === 'NTP100C' ||
                      this.configDetail.printLabel==='CT1000' ||
                      this.configDetail.printLabel==='ET01' ||
                      this.configDetail.printLabel==='WAC300N'||
                      this.configDetail.printLabel === 'WAC330HE'||
                      this.configDetail.printLabel==='WAC300NH'"
                        v-show="
                        this.configForm.produceModel!=='东元热表'
                        &&this.configForm.produceModel!=='NBT200'
                        &&this.configDetail.communication==='无线'"
                        @click="awaken(
                        protocolIDMap[this.configForm.produceModel].protocolId,'one'
                        )"
                        :disabled="nbButtonDisabledStatus.awaken"
                        :style="{
                           backgroundColor: nbButtonColor.awaken
                        }"
                        class="hlm-nb-business-start-button-style">
                联网唤醒
              </a-button>

              <a-button type="primary" block
                        v-if="
                      (this.configDetail.printLabel === 'WAC710CD'||
                      this.configDetail.printLabel === 'WAC300CD'||
                      this.configDetail.printLabel === 'NTP100C'||
                      this.configDetail.printLabel === 'CT1000'||
                      this.configDetail.printLabel === 'ET01'||
                          this.configDetail.printLabel === 'WAC330HE'||
                        this.configDetail.printLabel==='WAC300N'||
                        this.configDetail.printLabel==='WAC300NH'
                        )&&this.configDetail.communication==='无线'
"
                        @click="scanCodeVerification(
                        protocolIDMap[this.configForm.produceModel].protocolId,'one'
                        )"
                        :disabled="nbButtonDisabledStatus.scanCode"
                        :style="{
                           backgroundColor: nbButtonColor.scanCode
                        }"
                        class="hlm-nb-business-start-button-style">
                扫码验证
              </a-button>
              <div class="hlm-nb-not-important-business-body-style">
                <a-button type="primary" block
                          v-show="this.configForm.produceModel!=='东元热表'&&this.configForm.produceModel!=='NBT200'"
                          @click="printLabel(
                      false,
                        protocolIDMap[this.configForm.produceModel].protocolId,'one'
                        )"
                          :disabled="nbButtonDisabledStatus.labelPrint"
                          class="hlm-nb-not-important-business-start-button-style"
                          :style="{
                           color: nbButtonColor.labelPrint
                        }"
                >
                  标签<br/>重打

                </a-button>

                <a-button type="primary" block
                          v-if="
                      this.configDetail.printLabel === 'WAC710CD'||
                      this.configDetail.printLabel === 'WAC300CD'||
                      this.configDetail.printLabel === 'NTP100C'||
                      this.configDetail.printLabel === 'CT1000'||
                      this.configDetail.printLabel === 'ET01'||
                        this.configDetail.printLabel==='WAC300N'||
                            this.configDetail.printLabel === 'WAC330HE'||
                        this.configDetail.printLabel==='WAC300NH'
"
                          @click="breakSelfTest(
                        protocolIDMap[this.configForm.produceModel].protocolId,'one'
                        )"
                          :disabled="nbButtonDisabledStatus.breakSelfTest"
                          class="hlm-nb-not-important-business-start-button-style"
                          :style="{
                           color: nbButtonColor.breakSelfTest
                        }">
                  退出<br/>自检
                </a-button>
              </div>

            </div>

            <div class="hlm-nb-flow-arrowContainer-style">
              <!-- 箭头直线 -->
              <div class="hlm-nb-flow-straightArrows-style"/>
              <!-- 空心箭头 -->
              <div class="hlm-nb-flow-arrows-style"/>
            </div>


            <div class="hlm-nb-statistics-container-style">
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                机号
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ machineNumber }}
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                良品数
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ leftGoodProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良数
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ leftBadProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良率
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ this.computedLeftBadRate('one') }}
              </a-button>
              <a-button v-if="!this.routerParam.startsWithJ" class="hlm-nb-address-style static-btn"
                        style="margin-left: calc(104/1920*100vw)">
                写入/扫码地址
              </a-button>
              <a-input
                v-if="!this.routerParam.startsWithJ"
                class="no-spinner hlm-nb-address-style"
                type="number"
                v-model:value="this.leftGenerateAddress"
                placeholder="(待生成|扫码)地址"
                :maxlength="8"
                ref="input1"
                @input="validateNumberInputOne($event, 8)"
              ></a-input>
            </div>


            <!-- 外层固定高度，不滚动 -->
            <div
              id="left_textarea_id"
              ref="receptionOneText"
              class="hlm-nb-log-container-style"
            >
              <!-- 内层高度60%，内容超出时滚动 -->
              <div
                v-html="text.receptionOneText"
                class="hlm-flow-log-info-style"
              ></div>
            </div>

          </a-card>
          <a-card :title="this.rightProduceViewTitle"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle">
            <div style="margin-top: 2vh;">
              <div
                id="fail_textarea_id"
                ref="receptionFailText"
                class="hlm-flow-fail-log-container-style"
              >
                <div
                  v-html="text.receptionFailText"
                  class="hlm-flow-fail-log-info-style"
                ></div>
              </div>
            </div>


          </a-card>
        </div>


        <div class="hlm-frock-container" v-if="this.isNBDevice!==undefined && !this.isNBDevice">
          <a-card :title="this.leftProduceViewTitle"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle"
          >
            <!-- 左侧工装内容 -->
            <a-form
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <!-- 左侧功能区 -->
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>

              <a-form-item class="form-item-spacing">
                <a-button class="hlm-operate-button-style static-btn">串口</a-button>
              </a-form-item>

              <a-select
                v-model:value="portAttributes.selectedPortOne"
                class="hlm-port-button-select-style form-item-spacing"
                @change="handlePortChange(portAttributes.selectedPortOne,'one')"
              >
                <a-select-option
                  v-for="port in computedPortsExcludeLeft"
                  :value="port"
                >
                  {{ port }}
                </a-select-option>
              </a-select>

              <a-form-item>
                <a-button
                  class="hlm-operate-button-style"
                  @click="openPort(portAttributes.selectedPortOne,'one' )"
                  :disabled="!portAttributes.portClosedOneStatus"
                >
                  打开
                </a-button>
              </a-form-item>

              <a-form-item class="form-item-spacing">
                <a-button
                  class="hlm-operate-button-style"
                  @click="closePort(portAttributes.selectedPortOne,'one' )"
                  :disabled="portAttributes.portClosedOneStatus"
                >
                  关闭
                </a-button>
              </a-form-item>
              <!-- 动态间距元素 -->
              <div class="flex-spacer"></div>
              <!-- 写入地址组 -->
              <div class="address-group">
                <a-form-item>
                  <a-button class="hlm-writeAddress-button-style static-btn">写入地址</a-button>
                </a-form-item>

                <a-form-item class="form-item-spacing">
                  <a-input
                    class="hlm-writeAddress-input-style"
                    type="text"
                    v-model:value="leftGenerateAddress"
                    placeholder="请输入地址"
                    ref="input1"
                    @keydown.enter="handleEnterOne"
                    @input="restrictNumberInputOne"
                  />
                </a-form-item>
              </div>
            </a-form>

            <div class="hlm-assignmentTips">
              <a-button class="hlm-assignmentTips-button-style static-btn">作业提示</a-button>
              <a-button class="hlm-assignmentTips-button-text-style static-btn"> {{ this.leftWorkPrompt }}</a-button>
            </div>

            <!-- 箭头容器 -->
            <div class="hlm-flow-container-style">
              <div class="hlm-flow-arrowContainer-style">
                <!-- 箭头直线 -->
                <div class="hlm-flow-straightArrows-style"/>
                <!-- 空心箭头 -->
                <div class="hlm-flow-arrows-style"/>
              </div>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                          backgroundColor: this.wireButtonBackgroundColor.configureWriteOneColor,
                          color: this.wireButtonColor.configureWriteOneColor,
                         }">
                配写<br>置入
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.versionMatchOneColor}">
                版匹<br>本配
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.writeAddressOneColor}">
                地写<br>址入
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.closeCalibrationOneColor}">
                全标<br>关定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.openCalibrationOneColor}">
                全标<br>开定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.panelCommunicationOneColor,
                    color: this.wireButtonColor.panelCommunicationOneColor
                }">
                面通<br>板信
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.swipeCardFunctionOneColor,
                    color: this.wireButtonColor.swipeCardFunctionOneColor
                }">
                刷功<br>卡能
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.separationAlarmOneColor,
                    color: this.wireButtonColor.separationAlarmOneColor
                }">
                分测<br>离试
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.mainAuxiliaryValveOneColor,
                    color: this.wireButtonColor.mainAuxiliaryValveOneColor
                }">
                副通<br>阀讯
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.temperatureCalibrationOneColor,
                    color: this.wireButtonColor.temperatureCalibrationOneColor
                }">
                温标<br>度定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.factoryStatusWriteOneColor,
                    color: this.wireButtonColor.factoryStatusWriteOneColor
                }">
                出配<br>厂置
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    color: this.wireButtonColor.scanVerificationOneColor
                }">
                扫验<br>码证
              </a-button>


              <a-button class="hlm-flow-start-button-style "
                        @click="this.executeHandler('one',protocolIDMap[this.configForm.produceModel].protocolId,'writeCompleteConfiguration')"
                        :disabled="wireButtonDisabledStatus.processOne">
                {{ this.processTextOne }}
              </a-button>


            </div>
            <div class="hlm--statistics-container-style">
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                机号
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ machineNumber }}
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                良品数
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ leftGoodProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良数
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ leftBadProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良率
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ this.computedLeftBadRate('one') }}
              </a-button>
            </div>
            <!-- 外层固定高度，不滚动 -->
            <div
              id="left_textarea_id"
              ref="receptionOneText"
              class="hlm-flow-log-container-style"
            >
              <!-- 内层高度60%，内容超出时滚动 -->
              <div
                v-html="text.receptionOneText"
                class="hlm-flow-log-info-style"
              ></div>
            </div>
          </a-card>


          <!--  右侧工装         -->
          <a-card :title="this.rightProduceViewTitle"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle"
          >
            <a-form name="basic"
                    layout="inline"
                    class="hlm-form-port">
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click=" this.getAllPorts('two')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-operate-button-style static-btn">串口</a-button>
              </a-form-item>
              <a-select v-model:value="this.portAttributes.selectedPortTwo"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(this.portAttributes.selectedPortTwo,'two')">
                <a-select-option v-for="port in this.computedPortsExcludeRight" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>
              <a-form-item>
                <a-button class="hlm-operate-button-style"
                          @click="openPort(this.portAttributes.selectedPortTwo,'two' )"
                          :disabled="!this.portAttributes.portClosedTwoStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item style="margin-left: -0.9vw">
                <a-button class="hlm-operate-button-style"
                          @click="closePort(this.portAttributes.selectedPortTwo,'two')"
                          :disabled="this.portAttributes.portClosedTwoStatus">关闭
                </a-button>
              </a-form-item>
              <!-- 动态间距元素 -->
              <div class="flex-spacer"></div>
              <div class="address-group">
                <a-form-item>
                  <a-button class="hlm-writeAddress-button-style static-btn">写入地址</a-button>
                </a-form-item>

                <a-form-item class="form-item-spacing">
                  <a-input
                    class="hlm-writeAddress-input-style"
                    type="text"
                    v-model:value="rightGenerateAddress"
                    placeholder="请输入地址"
                    ref="input2"
                    @keydown.enter="handleEnterTwo"
                    @input="restrictNumberInputTwo"
                  />
                </a-form-item>
              </div>
            </a-form>
            <div class="hlm-assignmentTips">
              <a-button class="hlm-assignmentTips-button-style static-btn">作业提示</a-button>
              <a-button class="hlm-assignmentTips-button-text-style static-btn"> {{ this.rightWorkPrompt }}</a-button>
            </div>


            <div class="hlm-flow-container-style">
              <div class="hlm-flow-arrowContainer-style">
                <!-- 箭头直线 -->
                <div class="hlm-flow-straightArrows-style"/>
                <!-- 空心箭头 -->
                <div class="hlm-flow-arrows-style"/>
              </div>


              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                          backgroundColor: this.wireButtonBackgroundColor.configureWriteTwoColor,
                          color: this.wireButtonColor.configureWriteTwoColor,
                         }">
                配写<br>置入
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.versionMatchTwoColor}">
                版匹<br>本配
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.writeAddressTwoColor}">
                地写<br>址入
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.closeCalibrationTwoColor}">
                全标<br>关定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{color: this.wireButtonColor.openCalibrationTwoColor}">
                全标<br>开定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.panelCommunicationTwoColor,
                    color: this.wireButtonColor.panelCommunicationTwoColor
                }">
                面通<br>板信
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.swipeCardFunctionTwoColor,
                    color: this.wireButtonColor.swipeCardFunctionTwoColor
                }">
                刷功<br>卡能
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.separationAlarmTwoColor,
                    color: this.wireButtonColor.separationAlarmTwoColor
                }">
                分测<br>离试
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.mainAuxiliaryValveTwoColor,
                    color: this.wireButtonColor.mainAuxiliaryValveTwoColor
                }">
                副通<br>阀讯
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.temperatureCalibrationTwoColor,
                    color: this.wireButtonColor.temperatureCalibrationTwoColor
                }">
                温标<br>度定
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    backgroundColor: this.wireButtonBackgroundColor.factoryStatusWriteTwoColor,
                    color: this.wireButtonColor.factoryStatusWriteTwoColor
                }">
                出配<br>厂置
              </a-button>
              <a-button class="hlm-flow-button-style static-btn"
                        :style="{
                    color: this.wireButtonColor.scanVerificationTwoColor
                }">
                扫验<br>码证
              </a-button>

              <a-button class="hlm-flow-start-button-style "
                        @click="this.executeHandler('two',protocolIDMap[this.configForm.produceModel].protocolId,'writeCompleteConfiguration')"
                        :disabled="wireButtonDisabledStatus.processTwo">
                {{ this.processTextTwo }}
              </a-button>
            </div>
            <div class="hlm--statistics-container-style">

              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                机号
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ machineNumber }}
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                良品数
              </a-button>
              <a-button class="hlm-flow-machine-goodProduct-statistics-style static-btn">
                {{ rightGoodProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良数
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ rightBadProductQuantity }}
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                不良率
              </a-button>
              <a-button class="hlm-flow-defectiveProducts-statistics-style static-btn">
                {{ this.computedRightBadRate() }}
              </a-button>

            </div>
            <div
              id="right_textarea_id"
              ref="receptionTwoText"
              class="hlm-flow-log-container-style"
            >
              <div
                v-html="text.receptionTwoText"
                class="hlm-flow-log-info-style"
              ></div>
            </div>


          </a-card>
        </div>

      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {
  checkPort,
  doClosePort,
  doHandleSelectChange,
  doOpenPort,
  initializeAllSerialPorts
} from "@/views/device/handler/portHandler";
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";

import button from "@/views/device/button";
import {protocolIDMap} from "@/views/device/enum/enum";
import {
  doAwaken,
  doBreakSelfTest,
  doPrintLabel, doQuadraticVerification, doScanCodeVerification,
  doSelfTest,
  doWriteAddress
} from "@/views/device/operations/nbDeviceOperations";
import {executeWithAddress, executionProcess,} from "@/views/device/handler/wireHandler";
import {handleError} from "@/views/device/action/deviceAction";
import {
  findBadRecordList, findGoodRecordList,
  getProductImageList,
  getWorkConfigParam,
  getWorkDetail,
  saveVacDeviceProduceInfo,
} from "@/api/remote";
import {getDefaultPassword, getPrintListByProductName} from "@/components/global/productdb";
import data from '@/views/device/data'
import {
  deviceMainAndAuxiliaryValves,
  deviceSeparationAlarm,
  deviceTemperatureCalibration,
  writeOutFactoryOpenCondition
} from "@/views/device/action/deviceWireAction";
import CustomTitleBar from "@/views/device/CustomTitleBar.vue";
// import {checkNetWork} from "@/utils/serviceUtils";

export default {
  components: {CustomTitleBar},
  data() {
    return {
      communicationList:['有线','无线'],
      printLabelWidth: 0,
      printLabelHeight: 0,
      leftScanAddressMissionStop: false,
      rightScanAddressMissionStop: false,
      //有线阀任务执行状态
      leftAllInButtonExecuteStatus: 0,
      rightAllInButtonExecuteStatus: 0,
      //工装对象
      receivedData: {
        globalReceivedOneData: '',
        globalReceivedTwoData: '',
        globalReceivedSignalSourceData: '',
        globalReceivedCurrentSourceData: '',
      },
      leftGoodProductQuantity: 0,
      leftBadProductQuantity: 0,
      rightGoodProductQuantity: 0,
      rightBadProductQuantity: 0,
      leftBadRate: 0,
      rightBadRate: 0,
      leftWorkPrompt: '    ',
      rightWorkPrompt: '    ',
      selectedImage: '',
      click: true,
      machineNumber: undefined,
      audioContext: undefined,
      defaultDeviceName: '',
      portAttributes: {
        portClosedOneStatus: true,
        portClosedTwoStatus: true,
        portClosedSignalSourceStatus: true,
        portClosedCurrentSourceStatus: true,
        serialPortOne: undefined,
        selectedPortOne: undefined,
        serialPortTwo: undefined,
        selectedPortTwo: undefined,
        serialPortSignalSource: undefined,
        selectedPortSignalSource: undefined,
        serialPortCurrentSource: undefined,
        selectedPortCurrentSource: undefined,
        addressOne: '',
        addressTwo: '',
        serialPortList: undefined,
        selectedBadRate: '2400',
        selectedCheckDigit: '偶校验'
      },
      printerList: [],
      routerParam: {
        pwd: undefined,
        userId: undefined,
        machineNumber: undefined,
        produceMachine: undefined,
        workNumber: undefined,
        token: undefined,
        startsWithJ: undefined,
        userName: undefined,
      },
      workDetail: {
        workNumber: undefined,
        productCode: undefined,
        productName: undefined,
        productModel: undefined,
        programName: undefined,
        workQuantity: undefined,
        finishDate: undefined,
        memo: undefined,
        startPrecautions: undefined,
        vendorCode: '000000',
        customerName: undefined,
      },
      deviceInTemperature: 0,
      temperatureProbesList: ['无探头', '回温探头', '进温探头', '双探头'],
      screenDisplayList: ['轮显', '不轮显'],
      pressureProbesList: ['无探头', '进压探头', '回压探头', '双探头', '压差'],
      torquesList: ['25Nm', '50Nm'],
      vendorCodeList: ['0000000',],
      labelPaperSizeList: ['30mm*12mm', '40mm*20mm', '50mm*12mm'],
      customerList: ['青岛海龙马电子', '泉州七阳'],
      baudRateList: ['2400', '9600'],
      checkDigitList: ['偶校验', '无'],
      produceModelList: [],
      customizePrintLabelList: [],
      selectLabelPaperSize: '40mm*20mm',
      listDoubleRowLabels: '是',
      currentSourceList: ['有', '无'],
      selectDoubleRowLabels: ['是', '否'],
      configForm: {
        temperatureProbes: '无探头',
        version: undefined,
        temperature: 50,
        temperatureDiff: 0.3,
        cs_device_err: 0.048,// 电流源与设备电流误差
        sig_cs_err: 0.3, //信号源与电流源电流误差
        sig_device_err: 0.2,//信号源与设备误差
        processFocus: undefined,
        screenDisplay: '轮显',
        produceModel: undefined,
        customizePrintLabel: undefined,
        communication: undefined,
        pressureProbes: '无探头',
        torques: '25Nm',
        currentSource: '无'
      },
      workNumberForm: {
        workNumber: undefined,
        precautions: undefined,
        vendorCode: '000000',
        customer: undefined,
        startPrecautions: undefined,

      },
      modalShow: {
        printDeviceModalShow: false,
        configInputDetailModalShow: false,
        workNumberDetailModalShow: false,
        imageModalVisible: false,
      },
      configDetail: {
        cs_device_err: 0.048,// 电流源与设备电流误差
        sig_cs_err: 0.3, //信号源与电流源电流误差
        sig_device_err: 0.2,//信号源与设备误差
        temperatureProbe: undefined,//温度探针 0、无探头: 1、回温: 2、进温: 3、双探头
        version: undefined, //程序版本号
        temperature: 50,//设定温度 默认
        processFocus: undefined, //工序重点
        screenDisplay: undefined, //屏幕显示 0 不轮显 1 轮显
        printLabel: undefined, //打印标签
        customizePrintLabel: undefined,//定制化打印标签
        pressureProbes: undefined, //压力探头,
        torques: undefined,//扭矩
        temperatureDiff: undefined,//温度误差
        differentialPressureDiff: undefined,//压力误差
        currentSource: undefined,//电流源
        whetherDoubleRowPrinting: undefined,//是否双行打印
        paperSize: undefined,//标签纸尺寸
        printerName: undefined,
        communication:'无线',//通信方式
      },
      diffTemperature: 0.2, //温度偏差值±0.2
      leftGenerateAddress: data.leftGenerateAddress,
      secondaryInspectionGenerateAddress: data.rightGenerateAddress,
      rightGenerateAddress: data.rightGenerateAddress,
      leftReadAddress: '',
      rightReadAddress: '',
      text: {
        receptionOneText: '',
        receptionTwoText: '',
        receptionFailText: '',
      },
      password: undefined,
      workNumberPassword: undefined,
      nbButtonDisabledStatus: button.nbDeviceButton.disabledStatus,
      nbButtonColor: button.nbDeviceButton.color,
      publicButtonColor: button,
      wireButtonDisabledStatus: button.wireDeviceButton.disabledStatus,
      wireButtonColor: button.wireDeviceButton.color,
      wireButtonBackgroundColor: button.wireDeviceButton.backgroundColor,
      scanAddress: undefined,
      maxRetries: 3,
      timeout: 3000,
      productName: undefined,
      protocolId: undefined,
      version: undefined,
      netprovider: 2,
      imei: undefined,
      torqueStr: undefined,
      torque: undefined,
      iccid: undefined,
      uploadDataList: [],
      token: 'Bearer',
      workNumberList: undefined,
      url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=',
      imageWidth: null, // 存储图片宽度
      imageHeight: null, // 存储图片高度
      mainImage: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696479583662030849',
      // mainImages: [
      //   {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: true}
      // ],

      // mainImage:heigeImage,
      // mainImage:'',
      // subImages: [
      //   // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: false}
      // ],
      // imageList: [
      //   // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: true},
      //   // // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: true},
      //   // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: false},
      //   // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: false}
      // ],
      decodeConfigForm: {
        produceModel: '', // 第一级：产品型号
        secondLevelContainsD: false, // 第二级是否包含 D 显示屏
        temperatureConfig: '', // 第三级：测温配置
        pressureConfig: '' // 第九级：压力传感器配置
      },
      uploadAddressList: [],
      isNBDevice: undefined,
      leftProduceViewTitle: '',
      rightProduceViewTitle: '',


      //有线设备写地址
      wireScanAddressOne: data.wire.scanAddressOne,
      wireScanAddressTwo: data.wire.scanAddressTwo,
      leftTime: data.wire.leftTime,
      rightTime: data.wire.rightTime,
      processTextOne: data.wire.processTextOne,
      processTextTwo: data.wire.processTextTwo,
      //有线按钮颜色
      buttonColor: button.color,
      //有线阀门配置
      wireConfig: {
        temperatureUpperLimit: undefined,//温度上限
        temperatureDownLimit: undefined,//温度下限
        powerState: undefined,//电源状态
        wirelessAnomaly: undefined,//无线异常
        screenDisplay: undefined,//屏幕显示
        temperatureProbes: undefined,//温度探头
        openingUpperLimit: undefined,//开度上限
        openingDownLimit: undefined,//开度下限
        cleaningCycle: undefined,//清洗周期
        regulationMode: undefined,//调节模式
        adjustmentCycle: undefined,//调节周期
        adjustDeadZone: undefined,//调节死区
        proportionalAdjustment: undefined,//定比例调节
        heatingStartDate: undefined,//供暖开始日期
        heatingEndDate: undefined,//供暖结束日期
        version: undefined,//版本
      },
      readVersion: '',//读取版本


      //有线阀门card 表单项默认值
      wireValveDefaultCardForm: {
        operatorLine: '2',  //运营商： 1:单侧无线  2:不带无线 3:带面板测无线
        temperatureProbe: '0',   //温度探头 ： 0  ：无探头  1：蓝色回温探头  2：红色进温探头 3：红蓝双探头
        pressureProbes: '0',    //压力探头  0：无探头 1：回压探头 2：进压探头 3：进回压双探头
        temperatureUpperLimit: '30',  //温度上限
        temperatureDownLimit: '10',  //温度下限
        openingUpperLimit: '100',   //开度上限
        openingDownLimit: '0',      //开度下限
        powerState: '0',            // 断电状态   0：不动作  1：开阀  2：关阀
        wirelessAnomaly: '0',       // 无线异常  0：不动作  1：开阀  2：关阀
        regulationMode: '0',        //调节模式   0:  面板模式 1:远程模式  2:回温模式   3:温差模式
        regulationModeValue: '100',  //调节值
        strongTemperatureSetting: '1',//强制设温    0：否 1：是
        forcedTemperature: '25',  //强制温度
        selfRegulating: '1',   //自调节 0：   0:启动 1:禁用
        adjustmentCycle: '30',//调节周期
        screenDisplay: '1', //屏幕显示 : 0:不轮显 1:轮显
        cleaningCycle: '0', //清洗周期
        factoryOpening: '0', //出厂状态  0：全开 1：全关
        swipeCard: '0',  //刷卡功能   0: 否 1：是
        separateWarn: '0', //分离测试  0 ：否  1：是
        mainAuxiliaryValve: '0', //副阀通讯  0：否 1：是
        processFocus: '', //工序重点
        adjustDeadZone: '0',// 调节死区
        proportionalAdjustment: '0', //定比例调节值
        heatingStartDate: '06-10',//供暖开始日期
        heatingEndDate: '06-09',//供暖结束日期
        version: '1.1',//TODO 默认版本 研发需要提供一个默认版本
      },

      //有线阀门card 展示model
      wireValveCardForm: {
        model: undefined,
        operatorLine: '2',  //运营商： 1:单侧无线  2:不带无线 3:带面板测无线
        temperatureProbe: '0',   //温度探头 ： 0 ：无探头  1：蓝色回温探头  2：红色进温探头 3：红蓝双探头
        printModel: undefined, //打印型号
        pressureProbes: '0', //压力探头  0：无探头 1：回压探头 2：进压探头 3：进回压双探头
        temperatureUpperLimit: '30',  //温度上限
        temperatureDownLimit: '10',  //温度下限
        openingUpperLimit: '100',   //开度上限
        openingDownLimit: '0',      //开度下限
        powerState: '0',            // 断电状态   0：不动作  1：开阀  2：关阀
        wirelessAnomaly: '0',       // 无线异常  0：不动作  1：开阀  2：关阀
        regulationMode: '0',        //调节模式   0:  面板模式 1:远程模式  2:回温模式   3:温差模式
        regulationModeValue: '100',  //调节值
        strongTemperatureSetting: '1',//强制设温    0：否 1：是
        forcedTemperature: '25',  //强制温度
        selfRegulating: '1',   //自调节 0：   0:启动 1:是
        adjustmentCycle: '30',//调节周期
        screenDisplay: '1', //屏幕显示 : 0:不轮显 1:轮显
        cleaningCycle: '0', //清洗周期
        factoryOpening: '0', //出厂状态  0：全开 1：全关
        swipeCard: '0',  //刷卡功能   0: 否 1：是
        separateWarn: '0', //分离测试  0 ：否  1：是
        mainAuxiliaryValve: '0', //副阀通讯  0：否 1：是
        processFocus: '', //工序重点
        adjustDeadZone: '0',// 调节死区
        proportionalAdjustment: '0',//定比例调节值
        heatingStartDate: '06-10',//供暖开始日期
        heatingEndDate: '06-09',//供暖结束日期
        version: '1.1',//TODO 默认版本 研发需要提供一个默认版本
      },
      //有线阀门card 控制展示Disable
      wireValveCardFormShow: {
        model: true,
        operatorLine: false,  //运营商： 1:单侧无线  2:不带无线 3:带面板测无线
        temperatureProbe: false,   //温度探头 ： 0 ：无探头  1：蓝色回温探头  2：红色进温探头 3：红蓝双探头
        pressureProbes: false,    //压力探头  0：无探头 1：回压探头 2：进压探头 3：进回压双探头
        temperatureUpperLimit: false,  //温度上限
        temperatureDownLimit: false,  //温度下限
        openingUpperLimit: false,   //开度上限
        openingDownLimit: false,      //开度下限
        powerState: false,            // 断电状态   0：不动作  1：开阀  2：关阀
        wirelessAnomaly: false,       // 无线异常  0：不动作  1：开阀  2：关阀
        regulationMode: false,        //调节模式   0:  面板模式 1:远程模式  2:回温模式   3:温差模式
        regulationModeValue: false,  //调节值
        strongTemperatureSetting: false,//强制设温    0：否 1：是
        forcedTemperature: false,  //强制温度
        selfRegulating: false,   //自调节 0：   0:启动 1:是
        adjustmentCycle: false,//调节周期
        screenDisplay: false, //屏幕显示 : 0:不轮显 1:轮显
        cleaningCycle: false, //清洗周期
        factoryOpening: false, //出厂状态  0：全开 1：全关
        swipeCard: false,  //刷卡功能   0: 否 1：是
        separateWarn: false, //分离警报  0 ：否  1：是
        mainAuxiliaryValve: false, //副阀通讯  0：否 1：是
        processFocus: true, //工序重点
        adjustDeadZone: false,// 调节死区
        proportionalAdjustment: false, //定比例调节值
        heatingDate: false, // 供暖日期是否展示

      },
      operatorData: {
        '0': '移动',
        '1': '电信',
        '2': 'lora'
      },
      operatorLineData: {
        '1': '单测无线',
        '2': '不带无线',
        '3': '带面板测无线' // 修正重复的 '2' 键
      },
      temperatureProbeData: {
        '0': '无探头',
        '1': '回温探头',
        '2': '进温探头',
        '3': '双探头'
      },
      pressureProbeData: {
        '0': '无探头',
        '1': '回压探头',
        '2': '进压探头',
        '3': '进回压双探头'
      },
      shellTypeData: {
        '0': '白方壳',
        '1': '灰长壳',
        '2': '白圆壳',
        '3': '灰圆壳',
        '4': '红方壳'
      },
      powerStateData: {
        '0': '不动作',
        '1': '开阀',
        '2': '关阀'
      },
      wirelessAnomalyData: {
        '0': '不动作',
        '1': '开阀',
        '2': '关阀'
      },
      regulationModeData: {
        '0': '面板模式',
        '1': '远程模式',
        '2': '回温模式',
        '3': '温差模式'
      },
      regulationValueData: {
        '0': '无',
        '1': '50%开度',
        '2': '温度 0.5℃',
        '3': '温差 0.5℃'
      },
      strongTemperatureSettingData: {
        '0': '否',
        '1': '是'
      },
      selfRegulatingData: {
        '0': '启动',
        '1': '禁用'
      },
      screenDisplayData: {
        '0': '不轮显',
        '1': '轮显'
      },
      factoryOpeningData: {
        '0': '全开',
        '1': '全关'
      },
      swipeCardData: {
        '0': '否',
        '1': '是'
      },
      separateWarnData: {
        '0': '否',
        '1': '是'
      },
      mainAuxiliaryValveData: {
        '0': '否',
        '1': '是'
      },
      isProcessing: false,// 添加处理标志
      flowTimeout: 15000,
      separateCount: 0,
      closeCount: 0,
      mainValveCount: 0,
      leftInTemperature: 0,
      leftOutTemperature: 0,
      rightInTemperature: 0,
      rightOutTemperature: 0,
      leftInTempHistory: [], // 保存进温历史
      leftOutTempHistory: [], // 保存回温历史
      rightInTempHistory: [], // 保存进温历史
      rightOutTempHistory: [], // 保存回温历史
      leftValveState: '',//阀门状态        故障 阀关 阀开
      rightValveState: '',//阀门状态        故障 阀关 阀开
      autoLeftWorkExecute: true,
      autoRightWorkExecute: true,
      panelTestTimeout: 15000,
      creditCardTestTimeout: 15000,
      separationTestTimeout: 15000,
      mainAuxiliaryValvesTestTimeout: 15000,
      scanAddressTestTimeout: 30000,
      lowerLimitOf4mACalibratedADValue: undefined,
      upperLimitOf20mACalibratedADValue: undefined,
      readInTemperature: undefined,
      readOutTemperature: undefined,
      readDeviceTemperatureProbes: undefined,
      readDevicePressureProbes: undefined,
      leftErrorScanValveAddress: '',
      rightErrorScanValveAddress: '',
      readDifferentialPressure: undefined,
      readCurrent: undefined,
      autoSecondaryInspectionWorkExecute: true,
      productModel: '',
      vacActuatorsList: [
        'VAC002',
        'VAC005C',
        'VAC400',
        'VAC100',
        'VAC100R',
        'VAC100Y',
        'VAC101',
        'VAC103',
        'VAC200',
        'VAC200C',
        'VAC200Y',
        'VAC200S',
        'VAC200SC',
        'VAC201',
        'VAC203',
        'VAC230',
        'VAC330C',
        'VAC300',
        'VAC300Z',
        'VAC300H',
        'VAC300HC',
        'VAC710S',
        'VAC710',
      ],
      wacActuatorsList: [
        'WAC100N',
        'WAC100NY',
        'WAC400N',
        'WAC400NS',
        'WAC200N',
        'WAC300N',
        'WAC300NH',
        'WAC300NZ',
        'WAC300NS',
        'WAC330N',
        'WAC300NC',
        'WAC300C',
        'WAC300CD',
        'WAC300CY',
        'WAC230CF',
        'WAC300CS',
        'WAC330NE',
        'WAC330HE',
        'WAC500N',
        'WAC510N',
        'WAC520N',
        'WAC530N',
        'WAC710N',
        'WAC710NS',
        'WAC710C',
        'WAC710CD',
        'WAC710CS',
        'WAC710C',
        'WAC730N',
        'WAC710L',
        'WAC550N',
        'WAC600N',
        'WAC610N',
        'WAC100L',
        'WAC200L',
        'WAC300L',
        'WAC300LH',
        'WAC303L',
      ],
      temperatureControlPanelList: [
        'TPC100',
        'TPC400',
        'TPC004',
        'FKC100',
        'TPC010',
        'TPC002',
        'TPC003',
        'TPC006',
      ],
      roomTemperatureCollectorList: [
        'NBC100',
        'NBC200',
        'NBC200C',
        'NBT200',
        'CAT200',
        'NTC100',
        'NBT400',
        'NBT400S',
        'CAT400',
        'CAT400S',
        'NTR200',
        'NTR300',
        'NTR300C',
        'NTR300GZ',
        'WAT300NH',
        'VAT100',
        'NTP100',
        'NTP100C',
        'VTP100',
        'PTC100-CAT1',
        'PTC100-RF',
        'PTC100-4~20mA',
        'PTC100-RS485',
        'LPC300',
        'LPC100-NB',
        'LPC100-Cat1',
        'LPC210',
        'LPC210E',
        'LPC230-DF',
        'LPC110',
        'LPC130E-NB',
        'LPC130B-NB',
        'LPC130E-Cat1',
        'LPC130B-Cat1',
        'CPT100-10A',
        'CPT100-16A',
      ],
      isMaximized: true,
      /*不良记录列表*/
      badRecordList: [],
      goodRecordList: [],
      uploadMesList: [],
      badRecordCounter: 0, // 记录全局不良序号
      readMeterAddress:'',
      readMeterInTemperature:undefined, //WAC330HE热表温度读取。
      readMeterOutTemperature:undefined, //WAC330HE热表温度读取。
      whetherVerificationState:false, //是否退出检定状态

    };
  },
  /*移除监听器 */
  beforeDestroy() {
    ipc.removeAllListeners('window-is-maximized');
  },
  async created() {
    // 监听主进程的通知改变：maximized
    ipc.on('window-is-maximized', (event, maximized) => {
      console.log('maximized=>', maximized);
      this.isMaximized = maximized;
    });
  },
  async mounted() {

    //初始化可选串口集合
    this.getAllPorts()
    const route = useRoute();
    //路由 获取userId,mac地址
    //初始化登录MES拿token
    this.routerParam.userId = route.query.userId;
    this.routerParam.machineNumber = route.query.machineNumber;
    this.machineNumber = this.routerParam.machineNumber
    this.routerParam.produceMachine = Number(route.query.produceMachine);
    this.routerParam.workNumber = route.query.workNumber;
    this.routerParam.token = route.query.token;
    this.routerParam.pwd = route.query.pwd;
    this.routerParam.startsWithJ = route.query.startsWithJ === 'true';
    this.routerParam.userName = route.query.userName;
    console.log('路由数据：', this.routerParam)
    this.leftWorkPrompt = '请选择打印机和标签纸规格'
    this.rightWorkPrompt = '请选择打印机和标签纸规格'
    // 按钮禁用
    this.wireDeviceButtonDisabled('one')
    this.wireDeviceButtonDisabled('two')
    //获取工单默认密码
    let defaultPassword = await getDefaultPassword('workNumber')
    this.workNumberPassword = defaultPassword[0].passWord;

    if (this.routerParam.produceMachine === 0) {
      let filteredList = await findBadRecordList(this.routerParam.token, this.routerParam.workNumber, this.routerParam.machineNumber)
      let filteredGoodProduceList = await findGoodRecordList(this.routerParam.token, this.routerParam.workNumber, this.routerParam.machineNumber)
      this.badRecordList = filteredList.data.data
      this.goodRecordList = filteredGoodProduceList.data.data
      if (this.badRecordList!==undefined&&this.badRecordList!==null&&this.badRecordList.length>0) {
        this.leftBadProductQuantity=this.badRecordList.length
        this.badRecordList.forEach(item => {
          if (item.address === null) {
            item.address = ''
          }
          this.badRecordCounter++; // 序号累加
          let msg = `${this.badRecordCounter}、${item.address}、${item.badMemo}。`;
          this.createFailSpanMessage(msg, 'red');
        });
      }
      if (this.goodRecordList!==undefined&&this.goodRecordList!==null&&this.goodRecordList.length>0) {
        this.leftGoodProductQuantity=this.goodRecordList.length
      }

    }
    if (this.routerParam.produceMachine === 0 && !this.routerParam.startsWithJ) {
      const res = await getWorkDetail(this.routerParam.token, this.routerParam.workNumber);
      let data = res.data;
      console.log(data.data)
      if (data.code !== 200) {
        this.$message.error('网络错误请联系管理员');
        this.createLeftSpanMessage('网络错误请联系管理员', 'grey');
      }
      let model = data.data.productModel;
      if (model === undefined || model === null || model === '') {
        this.$message.error('产品型号错误，请联系管理员');
        this.createLeftSpanMessage('产品型号错误，请联系管理员', 'grey');
        return;
      }
      let productNamingConventionsList = model.split('-');
      let productModel = productNamingConventionsList[0];
      this.configForm.produceModel = productNamingConventionsList[0];
      if (!this.produceModelList.includes(this.configForm.produceModel)) {
        this.produceModelList.push(this.configForm.produceModel);
      }
      if (this.vacActuatorsList.includes(this.configForm.produceModel)) {
        this.productModel = '生产测试软件 - 执行器VAC系列 - '
      } else if (this.wacActuatorsList.includes(this.configForm.produceModel)) {
        this.productModel = '生产测试软件 - 执行器WAC系列 - '
      } else if (this.temperatureControlPanelList.includes(this.configForm.produceModel)) {
        this.productModel = '生产测试软件 - 温控面板系列 - '
      } else if (this.roomTemperatureCollectorList.includes(this.configForm.produceModel)) {
        this.productModel = '生产测试软件 - 室温采集器系列 - '
      } else if (this.configForm.produceModel === '东元热表' || this.configForm.produceModel === 'NBT200') {
        this.productModel = '生产测试软件 - 二次验证系列 - '
      } else {
        this.productModel = '生产测试软件 - 二次验证系列 - '
      }
      console.log(this.configForm.produceModel)

      let printList = await getPrintListByProductName(this.configForm.produceModel)

      if (printList.length !== undefined && printList.length !== 0) {
           this.customizePrintLabelList=printList.map((item) => item.printtag)
      }
      //打印列表包含产品型号则产品型号默认取那个
      if (this.customizePrintLabelList!==undefined&&this.customizePrintLabelList!==null&&this.customizePrintLabelList.length>0) {
        let matched = this.customizePrintLabelList.find(item => item === this.configForm.produceModel);
        if (matched) {
          this.configForm.customizePrintLabel = matched;
        } else {
          this.configForm.customizePrintLabel = this.customizePrintLabelList[0]
        }
      }

      //根据不同型号展示的页面不同
      if (this.configForm.produceModel.includes('VAC10') ||
        this.configForm.produceModel.includes('VAC20') ||
        this.configForm.produceModel.includes('VAC30') ||
        this.configForm.produceModel.includes('VAC40') ||
        this.configForm.produceModel.includes('VAC00')
      ) {
        this.isNBDevice = false;
        this.leftProduceViewTitle = '左侧工装'
        this.rightProduceViewTitle = '右侧工装'

        this.listenLeftFixture(); //开启监听器 监听左侧工装
        this.listenRightFixture(); //开启监听器 监听右侧工装
      } else if (this.configForm.produceModel === 'WAC710CD' ||
        this.configForm.produceModel === 'WAC230CF' ||
        this.configForm.produceModel === 'WAC300CD' ||
        this.configForm.produceModel === 'WAC330HE' ||
        this.configForm.produceModel === 'NTP100C' ||
        this.configForm.produceModel === 'CT1000' ||
        this.configForm.produceModel === 'ET01' ||
        this.configForm.produceModel === 'WAC300N' ||
        this.configForm.produceModel === 'WAC300NH'
      ) {
        this.isNBDevice = true
        this.leftProduceViewTitle = '测试验证'
        this.rightProduceViewTitle = '不良记录'
        // NB 配置解析
        if (productNamingConventionsList.length >= 2) {
          this.decodeConfigForm.secondLevelContainsD = productNamingConventionsList[1].includes('D');
        } else {
          this.createLeftSpanMessage('此工单生产产品型号：' + productModel + '缺少显示屏配置,请手动配置', 'red');
        }

        // 第三级：检查 T1（单测温）或 T2（双测温）
        if (productNamingConventionsList.length >= 3) {
          const thirdLevel = productNamingConventionsList[2];
          if (thirdLevel === 'T1') {
            this.decodeConfigForm.temperatureConfig = '回温探头';
          } else if (thirdLevel === 'T2') {
            this.decodeConfigForm.temperatureConfig = '双探头';
          } else {
            this.decodeConfigForm.temperatureConfig = '无探头';
          }
        } else {
          this.decodeConfigForm.temperatureConfig = '无探头';
        }

        // 第九级：检查是否存在，以及 P1（单压力传感器）或 P2（双压力传感器）
        if (productNamingConventionsList.length >= 9) {
          const ninthLevel = productNamingConventionsList[8];
          if (ninthLevel === 'P1') {
            // TODO P1单压力暂时不解析
          } else if (ninthLevel === 'P2') {
            this.decodeConfigForm.pressureConfig = '双探头';
            this.configForm.pressureProbes = this.decodeConfigForm.pressureConfig;
          } else {
            this.decodeConfigForm.pressureConfig = '无探头';
          }
        } else {
          this.decodeConfigForm.pressureConfig = '无探头';
        }
        //配置表单解析赋值
        this.configForm.temperatureProbes = this.decodeConfigForm.temperatureConfig;
        this.configForm.pressureProbes = this.decodeConfigForm.pressureConfig;
        this.decodeConfigForm.secondLevelContainsD === true ? (this.configForm.screenDisplay = '轮显') : (this.configForm.screenDisplay = '不轮显');
        this.configDetail.screenDisplay = this.configForm.screenDisplay
        this.configDetail.printLabel = this.configForm.produceModel
        this.configDetail.temperatureProbe = this.configForm.temperatureProbes
        this.configDetail.pressureProbes = this.configForm.pressureProbes
        this.configDetail.temperatureDiff = this.configForm.temperatureDiff
        this.configDetail.differentialPressureDiff = this.configForm.differentialPressureDiff
      }


      //生产人员有线、无线 获取工单信息 、图片
      this.workDetail = data.data;
      this.workDetail.memo = data.data.memo;
      this.workDetail.productCode = data.data.productCode;
      this.workDetail.productModel = data.data.productModel
      this.workDetail.programName = data.data.procedureName;
      this.workDetail.workQuantity = data.data.workQuantity;
      this.workDetail.finishDate = data.data.finishDate;
      this.workDetail.vendorCode = '000000'
      // 获取产品图片
      // await getProductImageList(this.routerParam.token, this.workDetail.productCode).then((res) => {
      //   if (res.data.code === 200) {
      //     if (res.data.data.imageList !== undefined && res.data.data.imageList.length > 0) {
      //       res.data.data.imageList.forEach(item => {
      //         this.imageList.push({
      //           url: this.url + item.objectKey,
      //           flag: item.flag === 'Y'
      //         });
      //       });
      //       this.mainImages = this.imageList.filter(item => item.flag === true);
      //       // this.subImages = this.imageList.filter(item => item.flag !== true);
      //     }
      //     console.log(this.imageList);
      //   }
      // }).catch((error) => {
      //   this.$message.error('网络错误请联系管理员');
      //   console.log(error);
      // });
      const imageRes = await getProductImageList(this.routerParam.token, this.workDetail.productCode);

      if (imageRes.data?.code !== 200) {
        throw new Error(imageRes.data?.message || 'API返回非200状态');
      }

      const imageList = imageRes.data?.data?.imageList || [];
      const mainImageObj = imageList.find(item => item.flag === true); //find 第一个

      if (mainImageObj) {
        this.mainImage = mainImageObj.objectKey;
      } else {
        console.warn('未找到主图（flag=true的图片）');
      }
      // 表单赋值
      this.workDetail.workNumber = this.routerParam.workNumber;
      console.info('工单获取成功')
      //解析有线配置
      if (!this.isNBDevice) {
        await this.wireDeviceConfigInput()
      }

    }

    //研发人员手动选择型号
    if (this.routerParam.produceMachine === 1) {
      this.produceModelList.push(...Object.keys(protocolIDMap));
      console.warn(this.produceModelList)
    }
    //二次检验添加型号
    if (this.routerParam.startsWithJ) {
      this.produceModelList.push('东元热表', 'NBT200')
    }

    //

  },
  computed: {
    // 动态刷新协议map.
    protocolIDMap() {
      return protocolIDMap
    },
    // 不良率计算
    computedLeftBadRate() {
      return () => {
        if (this.leftBadProductQuantity !== undefined && this.leftBadProductQuantity !== null && this.leftBadProductQuantity !== 0) {
          return Number(Number((this.leftBadProductQuantity / (this.leftGoodProductQuantity + this.leftBadProductQuantity)).toFixed(2)) * 100).toFixed(2) + '%'
        } else {
          return 0 + '%'
        }
      }
    },
    computedRightBadRate() {
      return () => {
        if (this.rightBadProductQuantity !== undefined && this.rightBadProductQuantity !== null && this.rightBadProductQuantity !== 0) {
          return Number((this.rightBadProductQuantity / (this.rightGoodProductQuantity + this.rightBadProductQuantity)).toFixed(2)) * 100 + '%'
        } else {
          return 0 + '%'
        }
      }
    },
    //排除串口左侧已选择的串口
    computedPortsExcludeLeft() {
      return this.portAttributes.serialPortList.filter(
        port =>
          port !== this.portAttributes.selectedPortTwo &&
          port !== this.portAttributes.selectedPortSignalSource &&
          port !== this.portAttributes.selectedPortCurrentSource
      );
    },
    //排除串口右侧已选择的串口
    computedPortsExcludeRight() {
      return this.portAttributes.serialPortList.filter(
        port =>
          port !== this.portAttributes.selectedPortOne &&
          port !== this.portAttributes.selectedPortSignalSource &&
          port !== this.portAttributes.selectedPortCurrentSource
      );
    },
    upperCardHeadStyle() {
      // 计算视口宽度百分比
      const widthPercent = (640 / 1920) * 100
      const heightPercent = (40 / 1080) * 100
      return {
        textAlign: 'center',
        width: `${widthPercent}vw`, // 动态计算vw值
        background: '#e6e8eb',
        color: '#F77F00',
        height: `${heightPercent}vh`, // 动态计算vh值
        fontWeight: 'bold',
        padding: '0.9px 16px'

      }
    },
    upperCardBodyStyle() {
      // 计算窗口宽度百分比
      const widthPercent = (640 / 1920) * 100
      const heightPercent = (320 / 1080) * 100
      return {
        width: `${widthPercent}vw`, // 动态计算vw值
        height: `${heightPercent}vh`, // 动态计算vh值
        padding: '0px',
        marginTop: '0.6vh'
      }
    },
    downCardHeadStyle() {
      // 计算窗口宽度百分比
      const widthPercent = (960 / 1920) * 100
      const heightPercent = (40 / 1080) * 100
      return {
        textAlign: 'center',
        width: `${widthPercent}vw`, // 动态计算vw值
        background: '#e6e8eb',
        color: '#F77F00',
        height: `${heightPercent}vh`, // 动态计算vh值
        fontWeight: 'bold',
        padding: '0.9px 16px'
      }
    },

    downCardBodyStyle() {
      // 计算视口宽度百分比
      const widthPercent = (960 / 1920) * 100
      const heightPercent = (660 / 1080) * 100
      return {
        width: `${widthPercent}vw`, // 动态计算vw值
        height: `${heightPercent}vh`, // 动态计算vh值
        padding: '0px',
        marginTop: '0.6vh'
      }
    }

  },

  watch: {
    "text.receptionOneText": {
      handler() {
        this.$nextTick(() => {
          // 操作的是内层滚动容器
          const contentDiv = this.$refs.receptionOneText.querySelector('.hlm-flow-log-info-style');
          if (contentDiv) {
            //当前滚动条距离容器顶部的垂直偏移量（单位：像素）。= 滚动条内可见高度
            contentDiv.scrollTop = contentDiv.scrollHeight;
          }
        });
      },
    },
    "text.receptionTwoText": {
      handler() {
        this.$nextTick(() => {
          // 操作的是内层滚动容器
          const contentDiv = this.$refs.receptionTwoText.querySelector('.hlm-flow-log-info-style');
          if (contentDiv) {
            //当前滚动条距离容器顶部的垂直偏移量（单位：像素）。= 滚动条内可见高度
            contentDiv.scrollTop = contentDiv.scrollHeight;
          }
        });
      },

    },
    "text.receptionFailText": {
      handler() {
        this.$nextTick(() => {
          // 操作的是内层滚动容器
          const contentDiv = this.$refs.receptionFailText.querySelector('.hlm-flow-fail-log-info-style');
          console.log('下滑', contentDiv)
          if (contentDiv) {
            //当前滚动条距离容器顶部的垂直偏移量（单位：像素）。= 滚动条内可见高度
            contentDiv.scrollTop = contentDiv.scrollHeight;
          }
        });
      },
    }
  },

  methods: {
    handleToggleMaximize() {
      ipc.send('toggle-maximize');
    },
    handleMinimizeWindow() {
      ipc.send('minimize-window');
    },
    handleCloseWindow() {
      ipc.send('close-window');
    },
    onImageLoad(event) {
      // 图片加载成功时获取尺寸
      const img = event.target;
      this.imageWidth = img.naturalWidth;
      this.imageHeight = img.naturalHeight;
      console.log(`图片尺寸: ${this.imageWidth}x${this.imageHeight} 像素`);
    },
    async logWrite() {
      // for (let i = 0; i < 10; i++) {
      //   this.createLeftSpanMessage('测试日志写入' + i, 'green')
      //   // this.createRightSpanMessage('测试日志写入'+i,'green')
      // }
      const params = {
        deviceName: this.defaultDeviceName,
        address: '12345678',
        message: '版本匹配失败',
      };
      await ipc.send(ipcApiRoute.printErrorMessage, params)


    },
    handleProduceModelChange(value) {
      this.isNBDevice = !value.includes('VAC20') &&
        !value.includes('VAC00') &&
        !value.includes('VAC40') &&
        !value.includes('VAC10') &&
        !value.includes('VAC30');
      if (value === 'NTP100C') {
        this.configForm.customizePrintLabel = 'NTP100C'
      } else if (value === 'CT1000') {
        this.configForm.customizePrintLabel = 'CT1000'
      } else if (value==='ET01'){
        this.configForm.customizePrintLabel = 'ET01'
      }else if (value === 'WAC300N') {
        this.configForm.customizePrintLabel = 'WAC300N'
      } else if (value === 'WAC300NH') {
        this.configForm.customizePrintLabel = 'WAC300NH'
      }else if(value==='WAC330HE'){
        this.configForm.customizePrintLabel = 'WAC330HE'
      } else {
        this.configForm.customizePrintLabel = undefined
      }
      //710CD 300CD 不直接打印型号
      this.changePrintModel()
    },

    handleEnterOne(event) {
      console.warn(event.target.value)
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.leftGenerateAddress = value;
      console.warn('this.autoLeftWorkExecute', this.autoLeftWorkExecute)
      console.warn('this.leftScanAddressMissionStop', this.leftScanAddressMissionStop)
      if (value.length === 8 && this.autoLeftWorkExecute && !this.leftScanAddressMissionStop) {
        console.warn('流程触发')
        this.executeHandler(
          'one',
          protocolIDMap[this.configForm.produceModel].protocolId,
          'writeCompleteConfiguration'
        )

      }
    },
    handleEnterTwo(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.rightGenerateAddress = value;
      console.warn('this.autoRightWorkExecute', this.autoRightWorkExecute)
      console.warn('this.rightScanAddressMissionStop', this.rightScanAddressMissionStop)
      if (value.length === 8 && this.autoRightWorkExecute && !this.rightScanAddressMissionStop) {
        console.warn('流程触发')
        this.executeHandler(
          'two',
          protocolIDMap[this.configForm.produceModel].protocolId,
          'writeCompleteConfiguration'
        )
      }
    },
    handleEnterSecondaryInspection(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.secondaryInspectionGenerateAddress = value;
      if (value.length === 8 && this.autoSecondaryInspectionWorkExecute) {
        console.warn('流程触发')
        this.quadraticVerify(
          protocolIDMap[this.configForm.produceModel].protocolId,
          'one',
        )
      }
    },
    restrictNumberInputOne(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.leftGenerateAddress = value;
    },
    restrictNumberInputTwo(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.rightGenerateAddress = value;
    },
    async listenLeftFixture(handler) {
      console.warn('handler', handler)
      console.warn('左侧监听工装执行', this.autoLeftWorkExecute)
      while (this.autoLeftWorkExecute) {
        try {
          const receivedDataOne = this.receivedData.globalReceivedOneData;
          if (receivedDataOne.length > 24 && handler === undefined) {
            this.receivedData.globalReceivedOneData = '';
          }
          // 等待 500 毫秒
          await new Promise(resolve => setTimeout(resolve, 200));
          // 检查工装按钮的状态
          if (receivedDataOne === 'FEFEFE684685030F0F005416') {
            this.receivedData.globalReceivedOneData = ''
            if (!checkPort(this, 'one')) {
              continue
            }
            if (handler === 'scan') {
              this.leftWorkPrompt = '请用扫码枪扫描地址标签'
            }
            console.warn('单击左侧工装->执行"左侧工装"')
            this.receivedData.globalReceivedOneData = ''
            await this.$nextTick();
            let input1 = this.$refs.input1.$el
            input1.focus();
            input1.select();

          }
        } catch (error) {
          console.error('监听 左侧 工装按钮的状态时出现异常:', error);
        }
      }

    },
    async listenRightFixture(handler) {
      console.warn('handler', handler)
      console.warn('左侧监听工装执行', this.autoLeftWorkExecute)
      while (this.autoRightWorkExecute) {
        try {
          const receivedDataTwo = this.receivedData.globalReceivedTwoData;
          if (receivedDataTwo.length > 24 && handler === undefined) {
            this.receivedData.globalReceivedTwoData = '';
          }
          // 等待 500 毫秒
          await new Promise(resolve => setTimeout(resolve, 200));
          if (receivedDataTwo === 'FEFEFE684685030F0F005416') {
            this.receivedData.globalReceivedTwoData = ''
            if (!checkPort(this, 'two')) {
              continue
            }
            if (handler === 'scan') {
              this.rightWorkPrompt = '请用扫码枪扫描地址标签'
            }
            console.warn('单击右侧工装->执行"右侧工装"')
            this.receivedData.globalReceivedTwoData = ''
            await this.$nextTick();
            let input2 = this.$refs.input2.$el
            input2.focus();
            input2.select();

          }

        } catch (error) {
          console.error('监听 右侧 工装按钮的状态时出现异常:', error);
        }
      }

    },
    formatToMonthDay(dateStr) {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split(' ')[0].split('-');
      const mm = month.padStart(2, '0');
      const dd = day.padStart(2, '0');
      return `${mm}-${dd}`;
    },
    /**
     * 解析有线配置
     * */
    async wireDeviceConfigInput() {
      if (this.routerParam.produceMachine === 0) {
        const res = await getWorkConfigParam(this.routerParam.token, this.workDetail.workNumber);
        const data = res.data;
        if (data.code !== 200) {
          this.$message.error('网络错误请联系管理员');
          return; // 终止执行
        }
        console.warn('生产配置参数：', data.data)
        this.wireValveCardForm.model = data.data.model === null ? null : data.data.model.toString().split('-')[0];
        this.wireValveCardForm.operatorLine = data.data.operatorLine === null ? null : data.data.operatorLine.toString();
        this.wireValveCardForm.temperatureProbe = data.data.temperatureProbe === null ? null : data.data.temperatureProbe.toString();
        this.wireValveCardForm.printModel = data.data.printModel === null ? null : data.data.printModel.toString();
        this.wireValveCardForm.pressureProbes = data.data.pressureProbe === null ? null : data.data.pressureProbe.toString();
        this.wireValveCardForm.temperatureUpperLimit = data.data.temperatureUpperLimit === null ? null : data.data.temperatureUpperLimit.toString();
        this.wireValveCardForm.temperatureDownLimit = data.data.temperatureDownLimit === null ? null : data.data.temperatureDownLimit.toString();
        this.wireValveCardForm.openingUpperLimit = data.data.openingUpperLimit === null ? null : data.data.openingUpperLimit.toString();
        this.wireValveCardForm.openingDownLimit = data.data.openingDownLimit === null ? null : data.data.openingDownLimit.toString();
        this.wireValveCardForm.powerState = data.data.powerState === null ? null : data.data.powerState.toString();
        this.wireValveCardForm.wirelessAnomaly = data.data.wirelessAnomaly === null ? null : data.data.wirelessAnomaly.toString();
        this.wireValveCardForm.regulationMode = data.data.regulationMode === null ? null : data.data.regulationMode.toString();
        this.wireValveCardForm.regulationModeValue = data.data.regulationModeValue === null ? null : data.data.regulationModeValue.toString();
        this.wireValveCardForm.strongTemperatureSetting = data.data.strongTemperatureSetting === null ? null : data.data.strongTemperatureSetting.toString();
        this.wireValveCardForm.forcedTemperature = data.data.forcedTemperature === null ? null : data.data.forcedTemperature.toString();
        this.wireValveCardForm.selfRegulating = data.data.selfRegulating === null ? null : data.data.selfRegulating.toString();
        this.wireValveCardForm.adjustmentCycle = data.data.adjustmentCycle === null ? null : data.data.adjustmentCycle.toString();
        this.wireValveCardForm.screenDisplay = data.data.screenDisplay === null ? null : data.data.screenDisplay.toString();
        this.wireValveCardForm.cleaningCycle = data.data.cleaningCycle === null ? null : data.data.cleaningCycle.toString();
        this.wireValveCardForm.factoryOpening = data.data.factoryOpening === null ? null : data.data.factoryOpening.toString();
        this.wireValveCardForm.swipeCard = data.data.swipeCard === null ? null : data.data.swipeCard.toString();
        this.wireValveCardForm.separateWarn = data.data.separateWarn === null ? null : data.data.separateWarn.toString();
        this.wireValveCardForm.mainAuxiliaryValve = data.data.mainAuxiliaryValve === null ? null : data.data.mainAuxiliaryValve.toString();
        this.wireValveCardForm.processFocus = data.data.processFocus === null ? null : data.data.processFocus.toString();
        this.wireValveCardForm.adjustDeadZone = data.data.adjustDeadZone === null ? null : data.data.adjustDeadZone.toString();
        this.wireValveCardForm.proportionalAdjustment = data.data.proportionalAdjustment === null ? null : data.data.proportionalAdjustment.toString();
        this.wireValveCardForm.heatingStartDate = data.data.heatingStartDate === null
          ? null
          : data.data.heatingStartDate.split(' ')[0].split('-').slice(1).join('-');

        this.wireValveCardForm.heatingEndDate = data.data.heatingEndDate === null
          ? null
          : data.data.heatingEndDate.split(' ')[0].split('-').slice(1).join('-');
        this.wireValveCardForm.version = data.data.version === null ? null : data.data.version.toString();
        //与此软件固化默认配置对比如果有差别才展示
        this.wireValveCardForm.heatingStartDate = this.formatToMonthDay(data.data.heatingStartDate);
        this.wireValveCardForm.heatingEndDate = this.formatToMonthDay(data.data.heatingEndDate);
      }


      if (
        this.wireValveDefaultCardForm.heatingStartDate === this.wireValveCardForm.heatingStartDate &&
        this.wireValveDefaultCardForm.heatingEndDate === this.wireValveCardForm.heatingEndDate
      ) {
        this.wireValveCardFormShow.heatingDate = false;
        this.wireValveCardForm.heatingStartDate = this.wireValveDefaultCardForm.heatingStartDate;
        this.wireValveCardForm.heatingEndDate = this.wireValveDefaultCardForm.heatingEndDate;
      } else {
        this.wireValveCardFormShow.heatingDate = true;
      }


      if (this.wireValveDefaultCardForm.operatorLine !== null && this.wireValveDefaultCardForm.operatorLine === this.wireValveCardForm.operatorLine) {
        this.wireValveCardFormShow.operatorLine = false
        this.wireValveCardForm.operatorLine = this.wireValveDefaultCardForm.operatorLine;
      } else {
        this.wireValveCardFormShow.operatorLine = true
      }

      if (this.wireValveDefaultCardForm.temperatureProbe !== null && this.wireValveDefaultCardForm.temperatureProbe === this.wireValveCardForm.temperatureProbe) {
        this.wireValveCardFormShow.temperatureProbe = false
        this.wireValveCardForm.temperatureProbe = this.wireValveDefaultCardForm.temperatureProbe;
      } else {
        this.wireValveCardFormShow.temperatureProbe = true
      }
      if (this.wireValveCardForm.pressureProbes === null || (this.wireValveDefaultCardForm.pressureProbes !== null && this.wireValveDefaultCardForm.pressureProbes === this.wireValveCardForm.pressureProbes)) {
        this.wireValveCardFormShow.pressureProbes = false
        this.wireValveCardForm.pressureProbes = this.wireValveDefaultCardForm.pressureProbes;
      } else {
        this.wireValveCardFormShow.pressureProbes = true
      }
      console.log(this.wireValveDefaultCardForm.temperatureUpperLimit)
      console.log(this.wireValveCardForm.temperatureUpperLimit)
      console.log('this.isNBDevice', this.isNBDevice)
      if (this.wireValveDefaultCardForm.temperatureUpperLimit !== null && this.wireValveDefaultCardForm.temperatureUpperLimit === this.wireValveCardForm.temperatureUpperLimit) {
        this.wireValveCardFormShow.temperatureUpperLimit = false
        this.wireValveCardForm.temperatureUpperLimit = this.wireValveDefaultCardForm.temperatureUpperLimit;
      } else {
        this.wireValveCardFormShow.temperatureUpperLimit = true
      }
      if (this.wireValveDefaultCardForm.temperatureDownLimit !== null && this.wireValveDefaultCardForm.temperatureDownLimit === this.wireValveCardForm.temperatureDownLimit) {
        this.wireValveCardFormShow.temperatureDownLimit = false
        this.wireValveCardForm.temperatureDownLimit = this.wireValveDefaultCardForm.temperatureDownLimit;
      } else {
        this.wireValveCardFormShow.temperatureDownLimit = true
      }
      if (this.wireValveDefaultCardForm.openingUpperLimit !== null && this.wireValveDefaultCardForm.openingUpperLimit === this.wireValveCardForm.openingUpperLimit) {
        this.wireValveCardForm.openingUpperLimit = this.wireValveDefaultCardForm.openingUpperLimit;
        this.wireValveCardFormShow.openingUpperLimit = false
      } else {
        this.wireValveCardFormShow.openingUpperLimit = true
      }
      if (this.wireValveDefaultCardForm.openingDownLimit !== null && this.wireValveDefaultCardForm.openingDownLimit === this.wireValveCardForm.openingDownLimit) {
        this.wireValveCardForm.openingDownLimit = this.wireValveDefaultCardForm.openingDownLimit;
        this.wireValveCardFormShow.openingDownLimit = false
      } else {
        this.wireValveCardFormShow.openingDownLimit = true
      }
      if (this.wireValveDefaultCardForm.powerState !== null && this.wireValveDefaultCardForm.powerState === this.wireValveCardForm.powerState) {
        this.wireValveCardForm.powerState = this.wireValveDefaultCardForm.powerState;
        this.wireValveCardFormShow.powerState = false
      } else {
        this.wireValveCardFormShow.powerState = true
      }
      if (this.wireValveDefaultCardForm.wirelessAnomaly !== null && this.wireValveDefaultCardForm.wirelessAnomaly === this.wireValveCardForm.wirelessAnomaly) {
        this.wireValveCardForm.wirelessAnomaly = this.wireValveDefaultCardForm.wirelessAnomaly;
        this.wireValveCardFormShow.wirelessAnomaly = false
      } else {
        this.wireValveCardFormShow.wirelessAnomaly = true
      }
      if (this.wireValveDefaultCardForm.regulationMode !== null && this.wireValveDefaultCardForm.regulationMode === this.wireValveCardForm.regulationMode) {
        this.wireValveCardForm.regulationMode = this.wireValveDefaultCardForm.regulationMode;
        this.wireValveCardFormShow.regulationMode = false
      } else {
        this.wireValveCardFormShow.regulationMode = true
      }

      if (this.wireValveDefaultCardForm.strongTemperatureSetting !== null && this.wireValveDefaultCardForm.strongTemperatureSetting === this.wireValveCardForm.strongTemperatureSetting) {
        this.wireValveCardForm.strongTemperatureSetting = this.wireValveDefaultCardForm.strongTemperatureSetting;
        this.wireValveCardFormShow.strongTemperatureSetting = false
      } else {
        this.wireValveCardFormShow.strongTemperatureSetting = true
      }

      if (this.wireValveDefaultCardForm.forcedTemperature !== null && this.wireValveDefaultCardForm.forcedTemperature === this.wireValveCardForm.forcedTemperature) {
        this.wireValveCardForm.forcedTemperature = this.wireValveDefaultCardForm.forcedTemperature;
        this.wireValveCardFormShow.forcedTemperature = false
      } else {
        this.wireValveCardFormShow.forcedTemperature = true
      }

      if (this.wireValveDefaultCardForm.regulationModeValue !== null && this.wireValveDefaultCardForm.regulationModeValue === this.wireValveCardForm.regulationModeValue) {
        this.wireValveCardForm.regulationModeValue = this.wireValveDefaultCardForm.regulationModeValue;
        this.wireValveCardFormShow.regulationModeValue = false
      } else {
        this.wireValveCardForm.regulationModeValue = this.wireValveDefaultCardForm.regulationModeValue;
        this.wireValveCardFormShow.regulationModeValue = true
      }

      if (this.wireValveDefaultCardForm.selfRegulating !== null && this.wireValveDefaultCardForm.selfRegulating === this.wireValveCardForm.selfRegulating) {
        this.wireValveCardForm.selfRegulating = this.wireValveDefaultCardForm.selfRegulating;
        this.wireValveCardFormShow.selfRegulating = false
      } else {
        this.wireValveCardFormShow.selfRegulating = true
      }
      if (this.wireValveDefaultCardForm.adjustmentCycle !== null && this.wireValveDefaultCardForm.adjustmentCycle === this.wireValveCardForm.adjustmentCycle) {
        this.wireValveCardForm.adjustmentCycle = this.wireValveDefaultCardForm.adjustmentCycle;
        this.wireValveCardFormShow.adjustmentCycle = false
      } else {
        this.wireValveCardFormShow.adjustmentCycle = true
      }
      if (this.wireValveDefaultCardForm.screenDisplay !== null && this.wireValveDefaultCardForm.screenDisplay === this.wireValveCardForm.screenDisplay) {
        this.wireValveCardForm.screenDisplay = this.wireValveDefaultCardForm.screenDisplay;
        this.wireValveCardFormShow.screenDisplay = false
      } else {
        this.wireValveCardFormShow.screenDisplay = true
      }

      if (this.wireValveDefaultCardForm.cleaningCycle !== null && this.wireValveDefaultCardForm.cleaningCycle === this.wireValveCardForm.cleaningCycle) {
        this.wireValveCardForm.cleaningCycle = this.wireValveDefaultCardForm.cleaningCycle;
        this.wireValveCardFormShow.cleaningCycle = false
      } else {
        this.wireValveCardFormShow.cleaningCycle = true
      }

      if (this.wireValveDefaultCardForm.factoryOpening !== null && this.wireValveDefaultCardForm.factoryOpening === this.wireValveCardForm.factoryOpening) {
        this.wireValveCardForm.factoryOpening = this.wireValveDefaultCardForm.factoryOpening;
        this.wireValveCardFormShow.factoryOpening = false
      } else {
        this.wireValveCardFormShow.factoryOpening = true
      }

      if (this.wireValveDefaultCardForm.swipeCard !== null && this.wireValveDefaultCardForm.swipeCard === this.wireValveCardForm.swipeCard) {
        this.wireValveCardForm.swipeCard = this.wireValveDefaultCardForm.swipeCard;
        this.wireValveCardFormShow.swipeCard = false
      } else {
        this.wireValveCardFormShow.swipeCard = true
      }


      if (this.wireValveDefaultCardForm.separateWarn !== null && this.wireValveDefaultCardForm.separateWarn === this.wireValveCardForm.separateWarn) {
        this.wireValveCardForm.separateWarn = this.wireValveDefaultCardForm.separateWarn;
        this.wireValveCardFormShow.separateWarn = false
      } else {
        this.wireValveCardFormShow.separateWarn = true
      }

      if (this.wireValveDefaultCardForm.mainAuxiliaryValve !== null && this.wireValveDefaultCardForm.mainAuxiliaryValve === this.wireValveCardForm.mainAuxiliaryValve) {
        this.wireValveCardForm.mainAuxiliaryValve = this.wireValveDefaultCardForm.mainAuxiliaryValve;
        this.wireValveCardFormShow.mainAuxiliaryValve = false
      } else {
        this.wireValveCardFormShow.mainAuxiliaryValve = true
      }


      if (this.wireValveDefaultCardForm.adjustDeadZone !== null && this.wireValveDefaultCardForm.adjustDeadZone === this.wireValveCardForm.adjustDeadZone) {
        this.wireValveCardForm.adjustDeadZone = this.wireValveDefaultCardForm.adjustDeadZone;
        this.wireValveCardFormShow.adjustDeadZone = false
      } else {
        this.wireValveCardFormShow.adjustDeadZone = true
      }
      if (this.wireValveDefaultCardForm.proportionalAdjustment !== null && this.wireValveDefaultCardForm.proportionalAdjustment === this.wireValveCardForm.proportionalAdjustment) {
        this.wireValveCardForm.proportionalAdjustment = this.wireValveDefaultCardForm.proportionalAdjustment;
        this.wireValveCardFormShow.proportionalAdjustment = false
      } else {
        this.wireValveCardFormShow.proportionalAdjustment = true
      }
      console.log('待写入参数：', this.wireValveCardForm)

      //手动流程颜色处理  lightgray 浅灰色
      if (!this.wireValveCardFormShow.factoryOpening) {
        this.wireButtonBackgroundColor.factoryStatusWriteOneColor = button.color.lightgray
        this.wireButtonDisabledStatus.factoryStatusWriteOne = true
        this.wireButtonBackgroundColor.factoryStatusWriteTwoColor = button.color.lightgray
        this.wireButtonDisabledStatus.factoryStatusWriteTwo = true
      }


      if (this.wireValveCardForm.operatorLine !== '3') {
        this.wireButtonBackgroundColor.panelCommunicationOneColor = button.color.lightgray
        this.wireButtonDisabledStatus.panelCommunicationOne = true
        this.wireButtonBackgroundColor.panelCommunicationTwoColor = button.color.lightgray
        this.wireButtonDisabledStatus.panelCommunicationTwo = true
      }
      if (this.wireValveCardForm.swipeCard !== '1') {
        this.wireButtonBackgroundColor.swipeCardFunctionOneColor = button.color.lightgray
        this.wireButtonDisabledStatus.swipeCardFunctionOne = true
        this.wireButtonBackgroundColor.swipeCardFunctionTwoColor = button.color.lightgray
        this.wireButtonDisabledStatus.swipeCardFunctionTwo = true
      }
      if (this.wireValveCardForm.separateWarn !== '1') {
        this.wireButtonBackgroundColor.separationAlarmOneColor = button.color.lightgray
        this.wireButtonDisabledStatus.separationAlarmOne = true
        this.wireButtonBackgroundColor.separationAlarmTwoColor = button.color.lightgray
        this.wireButtonDisabledStatus.separationAlarmTwo = true
      }
      if (this.wireValveCardForm.mainAuxiliaryValve !== '1') {
        this.wireButtonBackgroundColor.mainAuxiliaryValveOneColor = button.color.lightgray
        this.wireButtonDisabledStatus.mainAuxiliaryValveOne = true
        this.wireButtonBackgroundColor.mainAuxiliaryValveTwoColor = button.color.lightgray
        this.wireButtonDisabledStatus.mainAuxiliaryValveTwo = true
      }
      if (this.wireValveCardForm.temperatureProbe === '0') {
        this.wireButtonDisabledStatus.temperatureCalibrationOne = true;
        this.wireButtonDisabledStatus.temperatureCalibrationTwo = true;
        this.wireButtonBackgroundColor.temperatureCalibrationOneColor = button.color.lightgray;
        this.wireButtonBackgroundColor.temperatureCalibrationTwoColor = button.color.lightgray;
      }


      //配置置灰
      let screenDisplay = this.wireValveCardFormShow.screenDisplay
      let temperatureProbe = this.wireValveCardFormShow.temperatureProbe
      let heatingDate = this.wireValveCardFormShow.heatingDate
      let openingUpperLimit = this.wireValveCardFormShow.openingUpperLimit
      let openingDownLimit = this.wireValveCardFormShow.openingDownLimit
      let cleaningCycle = this.wireValveCardFormShow.cleaningCycle
      let regulationMode = this.wireValveCardFormShow.regulationMode
      let adjustmentCycle = this.wireValveCardFormShow.adjustmentCycle
      let adjustDeadZone = this.wireValveCardFormShow.adjustDeadZone
      let selfRegulating = this.wireValveCardFormShow.selfRegulating
      let regulationModeValue = this.wireValveCardFormShow.regulationModeValue
      let proportionalAdjustment = this.wireValveCardFormShow.proportionalAdjustment
      let powerState = this.wireValveCardFormShow.powerState
      let wirelessAnomaly = this.wireValveCardFormShow.wirelessAnomaly
      let strongTemperatureSetting = this.wireValveCardFormShow.strongTemperatureSetting
      let forcedTemperature = this.wireValveCardFormShow.forcedTemperature
      let temperatureUpperLimit = this.wireValveCardFormShow.temperatureUpperLimit
      let temperatureDownLimit = this.wireValveCardFormShow.temperatureDownLimit
      //三条写配置参数 如果有其中一项不满足都不置灰
      if (!(screenDisplay || temperatureProbe || heatingDate || openingUpperLimit ||
        openingDownLimit || cleaningCycle || regulationMode || adjustmentCycle ||
        adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment ||
        powerState || wirelessAnomaly || strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit)) {
        this.wireButtonDisabledStatus.configureWriteOne = true
        this.wireButtonDisabledStatus.configureWriteTwo = true
        this.wireButtonBackgroundColor.configureWriteOneColor = button.color.lightgray
        this.wireButtonBackgroundColor.configureWriteTwoColor = button.color.lightgray

      }
      console.warn('配置是否需要写：', this.wireValveCardFormShow)
    },
    // 按钮禁用
    wireDeviceButtonDisabled(type) {
      if (type === 'one') {
        this.wireButtonDisabledStatus.configureWriteOne = true
        this.wireButtonDisabledStatus.versionMatchOne = true
        this.wireButtonDisabledStatus.writeAddressOne = true
        this.wireButtonDisabledStatus.closeCalibrationOne = true
        this.wireButtonDisabledStatus.openCalibrationOne = true
        this.wireButtonDisabledStatus.panelCommunicationOne = true
        this.wireButtonDisabledStatus.swipeCardFunctionOne = true
        this.wireButtonDisabledStatus.separationAlarmOne = true
        this.wireButtonDisabledStatus.mainAuxiliaryValveOne = true
        this.wireButtonDisabledStatus.temperatureCalibrationOne = true
        this.wireButtonDisabledStatus.factoryStatusWriteOne = true
        this.wireButtonDisabledStatus.scanVerificationOne = true
        this.wireButtonDisabledStatus.processOne = true
      } else {
        this.wireButtonDisabledStatus.configureWriteTwo = true
        this.wireButtonDisabledStatus.versionMatchTwo = true
        this.wireButtonDisabledStatus.writeAddressTwo = true
        this.wireButtonDisabledStatus.closeCalibrationTwo = true
        this.wireButtonDisabledStatus.openCalibrationTwo = true
        this.wireButtonDisabledStatus.panelCommunicationTwo = true
        this.wireButtonDisabledStatus.swipeCardFunctionTwo = true
        this.wireButtonDisabledStatus.separationAlarmTwo = true
        this.wireButtonDisabledStatus.mainAuxiliaryValveTwo = true
        this.wireButtonDisabledStatus.temperatureCalibrationTwo = true
        this.wireButtonDisabledStatus.factoryStatusWriteTwo = true
        this.wireButtonDisabledStatus.scanVerificationTwo = true
        this.wireButtonDisabledStatus.processTwo = true

      }
    },
    wireDeviceButtonEnabled(type) {
      if (type === 'one') {
        // let screenDisplay = this.wireValveCardFormShow.screenDisplay
        // let temperatureProbe = this.wireValveCardFormShow.temperatureProbe
        // let heatingDate = this.wireValveCardFormShow.heatingDate
        // let openingUpperLimit = this.wireValveCardFormShow.openingUpperLimit
        // let openingDownLimit = this.wireValveCardFormShow.openingDownLimit
        // let cleaningCycle = this.wireValveCardFormShow.cleaningCycle
        // let regulationMode = this.wireValveCardFormShow.regulationMode
        // let adjustmentCycle = this.wireValveCardFormShow.adjustmentCycle
        // let adjustDeadZone = this.wireValveCardFormShow.adjustDeadZone
        // let selfRegulating = this.wireValveCardFormShow.selfRegulating
        // let regulationModeValue = this.wireValveCardFormShow.regulationModeValue
        // let proportionalAdjustment = this.wireValveCardFormShow.proportionalAdjustment
        // let powerState = this.wireValveCardFormShow.powerState
        // let wirelessAnomaly = this.wireValveCardFormShow.wirelessAnomaly
        // let strongTemperatureSetting = this.wireValveCardFormShow.strongTemperatureSetting
        // let forcedTemperature = this.wireValveCardFormShow.forcedTemperature
        // let temperatureUpperLimit = this.wireValveCardFormShow.temperatureUpperLimit
        // let temperatureDownLimit = this.wireValveCardFormShow.temperatureDownLimit
        // //三条写配置参数 如果有其中一项满足则恢复
        // if (screenDisplay || temperatureProbe || heatingDate || openingUpperLimit ||
        //   openingDownLimit || cleaningCycle || regulationMode || adjustmentCycle ||
        //   adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment ||
        //   powerState || wirelessAnomaly || strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit) {
        //   this.wireButtonDisabledStatus.configureWriteOne = false
        // }
        // if (this.wireValveCardFormShow.operatorLine) {
        //   this.wireButtonDisabledStatus.panelCommunicationOne = false
        // }
        // if (this.wireValveCardFormShow.swipeCard) {
        //   this.wireButtonDisabledStatus.swipeCardFunctionOne = false
        // }
        // if (this.wireValveCardFormShow.separateWarn) {
        //   this.wireButtonDisabledStatus.separationAlarmOne = false
        // }
        // if (this.wireValveCardFormShow.mainAuxiliaryValve) {
        //   this.wireButtonDisabledStatus.mainAuxiliaryValveOne = false
        // }
        // if (this.wireValveCardFormShow.temperatureProbe) {
        //   this.wireButtonDisabledStatus.temperatureCalibrationOne = false
        // }
        //
        // this.wireButtonDisabledStatus.versionMatchOne = false
        // this.wireButtonDisabledStatus.writeAddressOne = false
        // this.wireButtonDisabledStatus.closeCalibrationOne = false
        // this.wireButtonDisabledStatus.openCalibrationOne = false
        // this.wireButtonDisabledStatus.factoryStatusWriteOne = false
        // this.wireButtonDisabledStatus.scanVerificationOne = false
        this.wireButtonDisabledStatus.processOne = false
      } else {
        // let screenDisplay = this.wireValveCardFormShow.screenDisplay
        // let temperatureProbe = this.wireValveCardFormShow.temperatureProbe
        // let heatingDate = this.wireValveCardFormShow.heatingDate
        // let openingUpperLimit = this.wireValveCardFormShow.openingUpperLimit
        // let openingDownLimit = this.wireValveCardFormShow.openingDownLimit
        // let cleaningCycle = this.wireValveCardFormShow.cleaningCycle
        // let regulationMode = this.wireValveCardFormShow.regulationMode
        // let adjustmentCycle = this.wireValveCardFormShow.adjustmentCycle
        // let adjustDeadZone = this.wireValveCardFormShow.adjustDeadZone
        // let selfRegulating = this.wireValveCardFormShow.selfRegulating
        // let regulationModeValue = this.wireValveCardFormShow.regulationModeValue
        // let proportionalAdjustment = this.wireValveCardFormShow.proportionalAdjustment
        // let powerState = this.wireValveCardFormShow.powerState
        // let wirelessAnomaly = this.wireValveCardFormShow.wirelessAnomaly
        // let strongTemperatureSetting = this.wireValveCardFormShow.strongTemperatureSetting
        // let forcedTemperature = this.wireValveCardFormShow.forcedTemperature
        // let temperatureUpperLimit = this.wireValveCardFormShow.temperatureUpperLimit
        // let temperatureDownLimit = this.wireValveCardFormShow.temperatureDownLimit
        // //三条写配置参数 如果有其中一项满足则恢复
        // if ((screenDisplay || temperatureProbe || heatingDate || openingUpperLimit ||
        //   openingDownLimit || cleaningCycle || regulationMode || adjustmentCycle ||
        //   adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment ||
        //   powerState || wirelessAnomaly || strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit)) {
        //   this.wireButtonDisabledStatus.configureWriteTwo = false
        // }
        // if (this.wireValveCardFormShow.operatorLine) {
        //   this.wireButtonDisabledStatus.panelCommunicationTwo = false
        // }
        // if (this.wireValveCardFormShow.swipeCard) {
        //   this.wireButtonDisabledStatus.swipeCardFunctionTwo = false
        // }
        // if (this.wireValveCardFormShow.separateWarn) {
        //   this.wireButtonDisabledStatus.separationAlarmTwo = false
        // }
        // if (this.wireValveCardFormShow.mainAuxiliaryValve) {
        //   this.wireButtonDisabledStatus.mainAuxiliaryValveTwo = false
        // }
        // if (this.wireValveCardFormShow.temperatureProbe) {
        //   this.wireButtonDisabledStatus.temperatureCalibrationTwo = false
        // }
        //
        //
        // this.wireButtonDisabledStatus.versionMatchTwo = false
        // this.wireButtonDisabledStatus.writeAddressTwo = false
        // this.wireButtonDisabledStatus.closeCalibrationTwo = false
        // this.wireButtonDisabledStatus.openCalibrationTwo = false
        // this.wireButtonDisabledStatus.factoryStatusWriteTwo = false
        // this.wireButtonDisabledStatus.scanVerificationTwo = false
        this.wireButtonDisabledStatus.processTwo = false

      }
    },
    wireDeviceButtonAwait(type) {
      let screenDisplay = this.wireValveCardFormShow.screenDisplay
      let temperatureProbe = this.wireValveCardFormShow.temperatureProbe
      let heatingDate = this.wireValveCardFormShow.heatingDate
      let openingUpperLimit = this.wireValveCardFormShow.openingUpperLimit
      let openingDownLimit = this.wireValveCardFormShow.openingDownLimit
      let cleaningCycle = this.wireValveCardFormShow.cleaningCycle
      let regulationMode = this.wireValveCardFormShow.regulationMode
      let adjustmentCycle = this.wireValveCardFormShow.adjustmentCycle
      let adjustDeadZone = this.wireValveCardFormShow.adjustDeadZone
      let selfRegulating = this.wireValveCardFormShow.selfRegulating
      let regulationModeValue = this.wireValveCardFormShow.regulationModeValue
      let proportionalAdjustment = this.wireValveCardFormShow.proportionalAdjustment
      let powerState = this.wireValveCardFormShow.powerState
      let wirelessAnomaly = this.wireValveCardFormShow.wirelessAnomaly
      let strongTemperatureSetting = this.wireValveCardFormShow.strongTemperatureSetting
      let forcedTemperature = this.wireValveCardFormShow.forcedTemperature
      let temperatureUpperLimit = this.wireValveCardFormShow.temperatureUpperLimit
      let temperatureDownLimit = this.wireValveCardFormShow.temperatureDownLimit
      if (type === 'one') {

        this.wireButtonColor.versionMatchOneColor = this.buttonColor.lightgray
        this.wireButtonColor.writeAddressOneColor = this.buttonColor.lightgray
        this.wireButtonColor.closeCalibrationOneColor = this.buttonColor.lightgray
        this.wireButtonColor.openCalibrationOneColor = this.buttonColor.lightgray
        //三条写配置参数 如果有其中一项满足则变色
        if ((screenDisplay || temperatureProbe || heatingDate || openingUpperLimit ||
          openingDownLimit || cleaningCycle || regulationMode || adjustmentCycle ||
          adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment ||
          powerState || wirelessAnomaly || strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit)) {
          this.wireButtonColor.configureWriteOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.operatorLine) {
          this.wireButtonColor.panelCommunicationOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.swipeCard) {
          this.wireButtonColor.swipeCardFunctionOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.separateWarn) {
          this.wireButtonColor.separationAlarmOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.mainAuxiliaryValve) {
          this.wireButtonColor.mainAuxiliaryValveOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.temperatureProbe) {
          this.wireButtonColor.temperatureCalibrationOneColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.factoryOpening) {
          this.wireButtonColor.factoryStatusWriteOneColor = this.buttonColor.lightgray
          this.wireButtonColor.factoryStatusWriteTwoColor = this.buttonColor.lightgray
        }
        this.wireButtonColor.scanVerificationOneColor = this.buttonColor.lightgray
        this.wireButtonColor.processOneColor = this.buttonColor.lightgray
      } else {
        this.wireButtonColor.versionMatchTwoColor = this.buttonColor.lightgray
        this.wireButtonColor.writeAddressTwoColor = this.buttonColor.lightgray
        this.wireButtonColor.closeCalibrationTwoColor = this.buttonColor.lightgray
        this.wireButtonColor.openCalibrationTwoColor = this.buttonColor.lightgray
        //三条写配置参数 如果有其中一项满足则变色
        if (screenDisplay || temperatureProbe || heatingDate || openingUpperLimit ||
          openingDownLimit || cleaningCycle || regulationMode || adjustmentCycle ||
          adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment ||
          powerState || wirelessAnomaly || strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit) {
          this.wireButtonColor.configureWriteTwoColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.operatorLine) {
          this.wireButtonColor.panelCommunicationTwoColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.swipeCard) {
          this.wireButtonColor.swipeCardFunctionTwoColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.separateWarn) {
          this.wireButtonColor.separationAlarmTwoColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.mainAuxiliaryValve) {
          this.wireButtonColor.mainAuxiliaryValveTwoColor = this.buttonColor.lightgray
        }
        if (this.wireValveCardFormShow.temperatureProbe) {
          this.wireButtonColor.temperatureCalibrationTwoColor = this.buttonColor.lightgray
        }


        this.wireButtonColor.scanVerificationTwoColor = this.buttonColor.lightgray
        this.wireButtonColor.processTwoColor = this.buttonColor.lightgray
      }
    },
    handleWorkNumberInput(value) {
      // 如果已经有正在处理的请求，跳过
      if (this.isProcessing) return;

      // 设置处理标志
      this.isProcessing = true;

      setTimeout(() => {
        // 判断输入是否以 "SJ" 开头
        if (this.workNumberForm.workNumber.startsWith('SJ')) {
          // 检查是否包含 '/' 并分割
          if (this.workNumberForm.workNumber.includes('/')) {
            const parts = this.workNumberForm.workNumber.split('/');
            // 检查分割后第二部分长度是否不足5个字符
            if (parts[1] && parts[1].length < 5) {
              this.workNumberForm.workNumber = '';
              this.isProcessing = false; // 重置处理标志
              return;
            }
            // 只有当工单号长度为17时才调用接口
            if (this.workNumberForm.workNumber.length === 17) {
              // 扫码成功，拉取工单信息
              console.log("扫码成功，开始拉取工单信息");
              console.log(this.workNumberForm.workNumber.length);
              // 拉取工单信息
              getWorkDetail(this.routerParam.token, this.workNumberForm.workNumber).then((res) => {
                let data = res.data;
                if (data.code !== 200) {
                  this.$message.error('网络错误请联系管理员');
                  return; // 如果接口请求失败，终止执行
                }
                this.workNumberForm.precautions = data.data.memo; // 成功返回后更新注意事项
                //解析产品配置 不需要手动选
                // 以下为原有的 getWorkDetail 成功后的逻辑
                let model = data.data.productModel;
                if (model === undefined || model === null || model === '') {
                  this.$message.error('产品型号错误，请联系管理员');
                  return;
                }
                let productNamingConventionsList = model.split('-');
                let productModel = productNamingConventionsList[0];
                if (protocolIDMap[productModel] === undefined || protocolIDMap[productModel] === null) {
                  this.createLeftSpanMessage('该生产软件 不支持此产品：' + productModel + '请联系管理员', 'red');
                  this.$message.error('该生产软件不支持此产品：' + productModel + '请联系管理员');
                  return;
                }
                this.configForm.produceModel = productNamingConventionsList[0];
                if (!this.produceModelList.includes(this.configForm.produceModel)) {
                  this.produceModelList.push(this.configForm.produceModel);
                }


              }).catch((err) => {
                this.$message.error('请求失败，请稍后再试');
              }).finally(() => {
                this.isProcessing = false; // 接口调用完成后重置处理标志
              });
            } else {
              this.isProcessing = false; // 未达到17字符，重置处理标志
            }
          } else {
            this.workNumberForm.workNumber = '';
            this.isProcessing = false; // 重置处理标志
          }
        } else {
          this.workNumberForm.workNumber = '';
          this.isProcessing = false; // 重置处理标志
        }
      }, 200);
    },


    getCurrentYear() {
      return new Date().getFullYear();
    },
    /**
     * 处理协议ID
     * @param {string} type - 工装
     * @param {string} protocolId - 协议ID
     * @param startOperation 流程节点
     */
    async executeHandler(type, protocolId, startOperation) {
      if (type === 'one') {
        this.text.receptionOneText = ''
      } else if (type === 'two') {
        this.text.receptionTwoText = ''

      }
      console.log(type, protocolId, startOperation)
      let openMission = await executionProcess(type, protocolId, startOperation, this, 0)
      //执行完流程开启监听任务
      if (openMission) {

      }
    },

    async temperatureCalibration(type, protocolId) {
      await executeWithAddress(protocolId, type, this, async (valveAddress) => {
        console.log('地址你：', valveAddress)
        await deviceTemperatureCalibration(type, protocolId, this)
      })

    },


    async factoryStatusWrite(type, protocolId) {
      await executeWithAddress(protocolId, type, this, async (valveAddress) => {
        let result = await writeOutFactoryOpenCondition(protocolId, type, this)
        console.log('执行结果：', result)
      })

    },

    async scanVerification(type, protocolId) {
      // let result = await doScanAddressVerification(protocolId, type, this)
      // console.log('执行结果：', result)

    },
    focusInput(type) {
      this.$nextTick(() => {
        if (type === 'one') {
          const input = this.$refs.input1.$el;
          this.leftGenerateAddress = '';
          if (input) {
            // console.log('聚焦')
            input.focus();
            input.select();
          }
        } else {
          const input = this.$refs.input2.$el;
          this.rightGenerateAddress = '';
          if (input) {
            // console.log('聚焦')
            input.focus();
            input.select();
          }
        }
      });

    },
    async alert(type, protocolId) {
      await executeWithAddress(protocolId, type, this, async (valveAddress) => {
      })
      let result1 = await deviceSeparationAlarm(protocolId, type, this, false)  //验证 分离
      console.log('执行结果1 ：', result1)
      let result2 = await deviceSeparationAlarm(protocolId, type, this, true)   //验证 闭合
      console.log('执行结果2：', result2)

    },

    async deviceMainAndAuxiliaryValves(type, protocolId) {
      await executeWithAddress(protocolId, type, this, async (valveAddress) => {
      })
      let result1 = await deviceMainAndAuxiliaryValves(protocolId, type, this, false)  //验证 分离
      console.log('执行结果1 ：', result1)


    },

    scanOneAddressNumberLimit(event) {
      console.log(event)
      let value = event.replace(/\D/g, ''); // 只保留数字
      if (value.length >= 8) {
        this.wireScanAddressOne = value.slice(0, 8);  // 截取前8位
      } else {
        this.wireScanAddressOne = value;  // 保留当前值
      }
    },
    scanTwoAddressNumberLimit(event) {
      let value = event.replace(/\D/g, ''); // 只保留数字
      if (value.length >= 8) {
        this.wireScanAddressTwo = value.slice(0, 8);  // 截取前8位
      } else {
        this.wireScanAddressTwo = value;  // 保留当前值
      }
    },
    openModal(imageUrl) {
      console.log('imageUrl', imageUrl)
      if (imageUrl) {
        this.selectedImage = imageUrl;
        this.modalShow.imageModalVisible = true;
      }
    },
    closeModal() {
      this.modalShow.imageModalVisible = false;
      this.selectedImage = '';
    },
    getImageStyle() {
      console.log('图片尺寸：', this.imageWidth, this.imageHeight)
      // 1. 容器尺寸（基于设计稿 1920x1080 的 vw/vh 比例）
      const containerWidthVw = (640 / 1920 * 100);  // 容器宽度：33.333vw
      const containerHeightVh = (320 / 1080 * 100); // 容器高度：33.333vh

      // 2. 将图片原始像素尺寸转换为 vw/vh（基于当前视口）
      const viewportWidth = window.innerWidth;  // 当前视口宽度（px）
      const viewportHeight = window.innerHeight; // 当前视口高度（px）

      // 图片尺寸转换为 vw/vh
      const imageWidthVw = ((this.imageWidth / viewportWidth) * 100);
      const imageHeightVh = (this.imageHeight / 1080 * 100);
      console.log('计算的png宽度：', imageWidthVw)
      console.log('计算的png高度：', imageHeightVh)
      // 3. 计算缩放比例（基于 vw/vh 单位）
      const widthScale = containerWidthVw / imageWidthVw;
      const heightScale = containerHeightVh / imageHeightVh;
      const scale = Math.min(widthScale, heightScale);
      console.log('缩放比例：', scale)
      // 4. 应用缩放后的 vw/vh 尺寸
      const scaledWidthVw = imageWidthVw * scale;
      const scaledHeightVh = imageHeightVh * scale;
      console.log('图片缩放后的尺寸：', scaledWidthVw, scaledHeightVh)
      return {
        width: `${scaledWidthVw}vw`,  // 使用 vw 单位
        height: `${scaledHeightVh}vh`, // 使用 vh 单位
        display: 'block',
        maxWidth: `${containerWidthVw}vw`, // 限制不超过容器
        maxHeight: `${containerHeightVh}vh`
      };
    },
    createLeftSpanMessage(message, color) {
      const safeMessage = this.escapeHTML(message);
      const messageHTML = `<span style="color: ${color}; font-size: 15px;">${safeMessage}</span><br>`;
      this.text.receptionOneText += (messageHTML);
      this.$nextTick(() => {
        const element = this.$refs.receptionOneText;
        if (element) {
          element.scrollTop = element.scrollHeight;
        } else {

        }
      });
      return this.text.receptionOneText;
    },
    createRightSpanMessage(message, color) {
      const safeMessage = this.escapeHTML(message);
      const messageHTML = `<span style="color: ${color}; font-size: 15px;">${safeMessage}</span><br>`;
      this.text.receptionTwoText += (messageHTML);
      this.$nextTick(() => {
        const element = this.$refs.receptionTwoText;
        if (element) {
          element.scrollTop = element.scrollHeight;
        } else {

        }
      });
      console.log(this.text.receptionTwoText)
      return this.text.receptionTwoText;
    },
    createFailSpanMessage(message, color) {
      const safeMessage = this.escapeHTML(message);
      const messageHTML = `<span style="color: ${color}; font-size: 15px;">${safeMessage}</span><br>`;
      this.text.receptionFailText += (messageHTML);
      this.$nextTick(() => {
        const element = this.$refs.receptionFailText;
        if (element) {
          element.scrollTop = element.scrollHeight;
        } else {

        }
      });
      return this.text.receptionFailText;
    },
    escapeHTML(str) {
      return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "").replace(/'/g, "'");
    },
    async printLabel(flag, protocolId, type) {
      await doPrintLabel(this, flag, protocolId, type)
    },
    async printLabel1() {
      this.createLeftSpanMessage('打印群文件QJWEJQW1', 'grey')
      // 1. 准备打印数据
      // const params = {
      //   deviceName: this.defaultDeviceName,
      //   address: '12345678',
      //   selectPrintModel: 'WAC710CD',
      //   date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
      //   width: this.printLabelWidth,
      //   height: this.printLabelHeight,
      //   listDoubleRowLabels: this.listDoubleRowLabels,
      //   message: '检：  01',
      // };
      //
      // // 2. 调用主进程打印
      // await ipc.send(ipcApiRoute.printSuccessSingleRowInspectLabel5012, params);
    },
    getAllPorts(type) {
      initializeAllSerialPorts(this, type)
    },
    togglePrinterSelection(printer) {
      // 取消其他打印机的选择状态
      this.printerList.forEach(item => {
        if (item !== printer) {
          item.isSelected = false;
        }
      });
      // 设置当前打印机的选择状态
      printer.isSelected = true;
      this.defaultDeviceName = printer.name
    },
    setPreviousSelection() {
      this.printerList.forEach(item => {
        item.isSelected = (item.name === this.defaultDeviceName);
      });
    },
    printDeviceModalHandleOk() {
      if (this.defaultDeviceName === '') {
        this.$message.error('请选择打印机');
        return;
      }
      if (!this.isNBDevice) {
        this.leftWorkPrompt = '请打开右侧工装串口'
        this.rightWorkPrompt = '请打开右侧工装串口'
      }
      this.modalShow.printDeviceModalShow = false
      const selectedPrinter = this.printerList.find(item => item.isSelected);
      if (selectedPrinter) {
        this.defaultDeviceName = selectedPrinter.name;
      }
      if (this.selectLabelPaperSize === '40mm*20mm') {
        console.log('40mm*20mm')
        this.printLabelWidth = 40
        this.printLabelHeight = 20
      } else if (this.selectLabelPaperSize === '30mm*12mm') {
        this.printLabelWidth = 30
        this.printLabelHeight = 12
      } else if (this.selectLabelPaperSize === '50mm*12mm') {
        this.printLabelWidth = 50
        this.printLabelHeight = 12
      }
      this.configDetail.printerName = this.defaultDeviceName
      this.configDetail.paperSize = this.selectLabelPaperSize
      this.configDetail.whetherDoubleRowPrinting = this.listDoubleRowLabels
      this.$message.success('打印机、标签设置成功');
    },
    async workNumberModalOk() {
      if (this.checkPassword()) {
        // 生产录入工单信息
        if (this.routerParam.produceMachine === 0) {
          try {
            //TODO ： 获取工单配置信息 工序重点从开工配置中获取
            // MES信息赋值

          } catch (error) {
            this.$message.error('网络错误请联系管理员');
            console.log(error);
          }
        }
      } else {
        this.modalShow.workNumberDetailModalShow = true
        this.$message.error('密码输入错误');
      }
    },
    changePrintModel() {
      if (this.configForm.produceModel === 'WAC710CD') {
        //3）WAC710CD 选择25Nm，且选择为单回温探头，无压差探头时，打印型号37003.02
        //4）WAC710CD 选择25Nm，且选择为进回温探头，无压差探头时，打印型号37003.05
        //5）WAC710CD 选择25Nm，且选择为进回温探头，带压差探头时，打印型号37003.07
        //6）WAC710CD 选择50Nm，且选择为单回温探头，无压差探头时，打印型号37003.03
        //7）WAC710CD 选择50Nm，且选择为进回温探头，无压差探头时，打印型号37003.06
        //8）WAC710CD 选择50Nm，且选择为进回温探头，带压差探头时，打印型号37003.08
        if (this.configForm.torques !== undefined &&
          this.configForm.temperatureProbes !== undefined &&
          this.configForm.pressureProbes !== undefined) {

          if (this.configForm.torques === '25Nm') {
            if (this.configForm.temperatureProbes === '回温探头' && this.configForm.pressureProbes !== '压差') {
              this.configForm.customizePrintLabel = '37003.02'
            } else if (this.configForm.temperatureProbes === '双探头' && this.configForm.pressureProbes !== '压差') {
              this.configForm.customizePrintLabel = '37003.05'
            } else if (this.configForm.temperatureProbes === '双探头' && this.configForm.pressureProbes === '压差') {
              this.configForm.customizePrintLabel = '37003.07'
            } else {
              this.configForm.customizePrintLabel = undefined
            }
          } else if (this.configForm.torques === '50Nm') {
            if (this.configForm.temperatureProbes === '回温探头' && this.configForm.pressureProbes !== '压差') {
              this.configForm.customizePrintLabel = '37003.03'
            } else if (this.configForm.temperatureProbes === '双探头' && this.configForm.pressureProbes !== '压差') {
              this.configForm.customizePrintLabel = '37003.06'
            } else if (this.configForm.temperatureProbes === '双探头' && this.configForm.pressureProbes === '压差') {
              this.configForm.customizePrintLabel = '37003.08'
            } else {
              this.configForm.customizePrintLabel = undefined
            }
          } else {
            this.configForm.customizePrintLabel = undefined
          }


        }


      } else if (this.configForm.produceModel === 'WAC300CD') {
        //1）WAC300CD 选择单回温探头时，打印型号为37003.01
        //2）WAC300CD 选择进回温探头时，打印型号为37003.04
        if (this.configForm.temperatureProbes === '回温探头') {
          this.configForm.customizePrintLabel = '37003.01'
        } else if (this.configForm.temperatureProbes === '双探头') {
          this.configForm.customizePrintLabel = '37003.04'
        } else {
          this.configForm.customizePrintLabel = undefined
        }
      }
    },
    async configInputDetailModalOk() {
      //配置录入需要区分是工单跳转还是直接点击配置录入
      let pass = this.checkPassword()
      if (pass) {
        // //配置验证
        // if (this.configForm.produceModel === 'WAC710CD') {
        //   if (this.configForm.temperatureProbes === undefined && this.isNBDevice) {
        //     this.$message.error('请配置温度探头');
        //     return
        //   }
        //   if (this.configForm.pressureProbes === undefined && this.isNBDevice) {
        //     this.$message.error('请配置压力探头');
        //     return
        //   }
        //   if (this.configForm.torques === undefined && this.isNBDevice) {
        //     this.$message.error('请配置扭矩');
        //     return
        //   }
        //   if (this.configForm.screenDisplay === undefined && this.isNBDevice) {
        //     this.$message.error('请配置屏幕显示');
        //     return
        //   }
        // }
        //根据不同型号展示的页面不同
        if (this.configForm.produceModel.includes('VAC10') ||
          this.configForm.produceModel.includes('VAC20') ||
          this.configForm.produceModel.includes('VAC30') ||
          this.configForm.produceModel.includes('VAC40') ||
          this.configForm.produceModel.includes('VAC00')
        ) {
          this.leftProduceViewTitle = '左侧工装'
          this.rightProduceViewTitle = '右侧工装'
        } else if (this.configForm.produceModel === 'WAC710CD' ||
          this.configForm.produceModel === 'WAC230CF' ||
          this.configForm.produceModel === 'WAC300CD' ||
          this.configForm.produceModel === 'WAC330HE' ||
          this.configForm.produceModel === 'NTP100C' ||
          this.configForm.produceModel === 'CT1000' ||
          this.configForm.produceModel === 'ET01' ||
          this.configForm.produceModel === 'WAC300N' ||
          this.configForm.produceModel === 'WAC300NH'
        ) {
          this.leftProduceViewTitle = '测试验证'
          this.rightProduceViewTitle = '不良记录'
        } else if (this.configForm.produceModel === 'NBT200' ||
          this.configForm.produceModel === '东元热表') {
          this.leftProduceViewTitle = '测试验证'
          this.rightProduceViewTitle = '不良记录'
        }

        //无线配置
        this.configDetail.temperatureProbe = this.configForm.temperatureProbes
        this.configDetail.version = this.configForm.version
        this.configDetail.temperature = this.configForm.temperature
        this.configDetail.processFocus = this.configForm.processFocus
        this.configDetail.screenDisplay = this.configForm.screenDisplay
        this.configDetail.printLabel = this.configForm.produceModel
        this.configDetail.customizePrintLabel = this.configForm.customizePrintLabel
        this.configDetail.pressureProbes = this.configForm.pressureProbes
        if(this.configForm.produceModel==='WAC330HE'){
          this.configDetail.communication = this.configForm.communication
        }
        if (this.configForm.produceModel === 'WAC710CD') {
          this.configDetail.torques = this.configForm.torques
        }
        this.configDetail.temperatureDiff = this.configForm.temperatureDiff
        this.configDetail.cs_device_err = this.configForm.cs_device_err
        this.configDetail.sig_cs_err = this.configForm.sig_cs_err
        this.configDetail.sig_device_err = this.configForm.sig_device_err
        this.configDetail.currentSource = this.configForm.currentSource
        if (this.configForm.produceModel === 'WAC710CD' ||
          this.configForm.produceModel === 'WAC230CF' ||
          this.configForm.produceModel === 'WAC300CD' ||
          this.configForm.produceModel === 'WAC330HE' ||
          this.configForm.produceModel === 'NTP100C' ||
          this.configForm.produceModel === 'NBT200' ||
          this.configForm.produceModel === 'CT1000' ||
          this.configForm.produceModel === 'ET01' ||
          this.configForm.produceModel === 'WAC300N' ||
          this.configForm.produceModel === 'WAC300NH'
        ) {
          this.isNBDevice = true
          if (this.configForm.version === undefined) {
            this.$message.error('请配置版本号');
            return
          }
        }

        if (
          this.configForm.produceModel.includes('VAC00') ||
          this.configForm.produceModel.includes('VAC20') ||
          this.configForm.produceModel.includes('VAC10') ||
          this.configForm.produceModel.includes('VAC30') ||
          this.configForm.produceModel.includes('VAC40')
        ) {
          this.listenLeftFixture(); //开启监听器 监听左侧工装
          this.listenRightFixture(); //开启监听器 监听右侧工装
          this.isNBDevice = false
        }
        console.warn('nb,', this.isNBDevice)
        //非NB设备,研发测试配置
        if (!this.isNBDevice && this.routerParam.produceMachine === '1') {
          this.configDetail.printLabel = this.configForm.produceModel
        }


      } else {
        this.$message.error('密码错误');
        return
      }
      //处理录入有线配置
      if (!this.isNBDevice) {
        await this.wireDeviceConfigInput()
      }
      this.modalShow.configInputDetailModalShow = false
      this.$message.success('配置录入成功');
      this.password = undefined

    }
    ,
    getPrinter() {
      ipc.invoke(ipcApiRoute.getPrinterList, {}).then(res => {
        this.printerList = res;
      })
      this.modalShow.printDeviceModalShow = true
    }
    ,
    checkPassword() {
      console.log(this.workNumberPassword)
      return this.password === this.workNumberPassword;
    }
    ,
    configInputDetail() {
      this.password = undefined
      this.modalShow.configInputDetailModalShow = true
    }
    ,
    workNumberInputDetail() {
      this.modalShow.workNumberDetailModalShow = true
    }
    ,
    buttonDisabled() {
      this.nbButtonDisabledStatus.writeAddress = true
      this.nbButtonDisabledStatus.selfTest = true
      this.nbButtonDisabledStatus.awaken = true
      this.nbButtonDisabledStatus.labelPrint = true
      this.nbButtonDisabledStatus.breakSelfTest = true
      this.nbButtonDisabledStatus.quadraticVerify = true
      this.nbButtonDisabledStatus.scanCode = true
    }
    ,
    buttonEnable() {
      this.nbButtonDisabledStatus.writeAddress = false
      this.nbButtonDisabledStatus.selfTest = false
      this.nbButtonDisabledStatus.awaken = false
      this.nbButtonDisabledStatus.labelPrint = false
      this.nbButtonDisabledStatus.breakSelfTest = false
      this.nbButtonDisabledStatus.quadraticVerify = false
      this.nbButtonDisabledStatus.scanCode = false
    },
    buttonSuccess(node) {
      if (this.isNBDevice) {
        this.nbButtonColor[node] = button.color.success
      } else {
        this.wireButtonColor[node] = button.color.success;
      }
    },
    buttonError(node) {
      if (this.isNBDevice) {
        this.nbButtonColor[node] = button.color.error
      } else {
        this.wireButtonColor[node] = button.color.error
      }
    }
    ,
    buttonWaiting(node) {
      if (this.isNBDevice) {
        this.nbButtonColor[node] = button.color.waiting
      } else {
        this.wireButtonColor[node] = button.color.waiting;
      }
    }
    ,

    validateNumberInputOne(event, maxLength) {
      // const leadingZeros = value.match(/^0+/);
      // const zeroCount = leadingZeros ? leadingZeros[0].length : 0;
      // let numPart = parseInt(value, 10);
      // if (value.length > 8) {
      //   value = value.slice(0, 8);
      // }
      // let newValue = numPart.toString().padStart(zeroCount, "0");
      // this.leftGenerateAddress = newValue.slice(0, 8).padStart(8, "0");
      let value = event.target.value;
      if (value.length > maxLength) {
        value = value.slice(0, maxLength);  // 截断超出部分
        event.target.value = value;  // 重新赋值
      }
      this.leftGenerateAddress = value;  // 更新 v-model
    },
    validateNumberInputSecondaryInspectionGenerateAddress(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      this.secondaryInspectionGenerateAddress = value;
    },
    validateNumberInputTwo(value) {
      const leadingZeros = value.match(/^0+/);
      const zeroCount = leadingZeros ? leadingZeros[0].length : 0;
      let numPart = parseInt(value, 10);
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      let newValue = numPart.toString().padStart(zeroCount, "0");
      this.rightGenerateAddress = newValue.slice(0, 8).padStart(8, "0");
    },
    handlePortChange(selectSerialPort, type) {
      doHandleSelectChange(this, type)
    },
    async openPort(portName, type) {
      console.warn(this.configDetail.printLabel)
      if (this.routerParam.produceMachine === 1) {
        if (this.configDetail.printLabel === undefined || this.configDetail.printLabel === null) {
          this.$message.error('请配置标签型号后再进行串口操作');
          return
        }
      }
      let parity = protocolIDMap[this.configForm.produceModel].portAttribute.parity
      let dataBits = protocolIDMap[this.configForm.produceModel].portAttribute.dataBits
      let baudRate = protocolIDMap[this.configForm.produceModel].portAttribute.baudRate
      let stopBits = protocolIDMap[this.configForm.produceModel].portAttribute.stopBits
      this.createLeftSpanMessage('当前打开串口 波特率：' + baudRate+'校验位:'+parity,'grey')
      console.log('串口属性：', portName, parity, dataBits, baudRate, stopBits)
      if (!this.isNBDevice) {
        if (type === 'one') {
          this.leftWorkPrompt = '请按压工装后扫码进行测试'
        } else if (type === 'two') {
          this.rightWorkPrompt = '请按压工装后扫码进行测试'
        }
      }
      await doOpenPort(this, portName, parity, dataBits, baudRate, stopBits, type)
    }
    ,
    closePort(portName, type) {
      doClosePort(this, portName, type)
    }
    ,
    async selfTest(protocolId, type) {
      await doSelfTest(this, protocolId, type)
    },
    async quadraticVerify(protocolId, type) {
      if (this.secondaryInspectionGenerateAddress === undefined || this.secondaryInspectionGenerateAddress === '') {
        this.createLeftSpanMessage('请先扫码二次检验地址', 'red')
        return
      }
      this.autoSecondaryInspectionWorkExecute = false
      this.buttonDisabled()
      await doQuadraticVerification(this, protocolId, type)
      this.autoSecondaryInspectionWorkExecute = true
      this.buttonEnable()
    },
    async addressWrite(protocolId, type) {
      await doWriteAddress(this, protocolId, type)
      this.buttonEnable()
    }
    ,
    /**
     * 上传MES成功后 或点击流程按钮  所有状态清空
     * */
    messageClean() {
      this.leftWorkPrompt = '\u200B'
      this.rightWorkPrompt = '\u200B'
      this.text.receptionOneText = ''

      //无线设备
      this.buttonWaiting('selfTest')
      this.buttonWaiting('writeAddress')
      this.buttonWaiting('awaken')
      this.buttonWaiting('labelPrint')
      this.buttonWaiting('breakSelfTest')
      //有线设备
      this.buttonWaiting('configureWriteOneColor')
      this.buttonWaiting('configureWriteTwo')
      this.buttonWaiting('versionMatchOneColor')
      this.buttonWaiting('versionMatchTwo')
      this.buttonWaiting('writeAddressOne')
      this.buttonWaiting('writeAddressTwo')
      this.buttonWaiting('closeCalibrationOne')
      this.buttonWaiting('closeCalibrationTwo')
      this.buttonWaiting('openCalibrationOne')
      this.buttonWaiting('openCalibrationTwo')
      this.buttonWaiting('panelCommunicationOne')
      this.buttonWaiting('panelCommunicationTwo')
      this.buttonWaiting('swipeCardFunctionOne')
      this.buttonWaiting('swipeCardFunctionTwo')
      this.buttonWaiting('separationAlarmOne')
      this.buttonWaiting('separationAlarmTwo')
      this.buttonWaiting('mainAuxiliaryValveOne')
      this.buttonWaiting('mainAuxiliaryValveTwo')
      this.buttonWaiting('temperatureCalibrationOne')
      this.buttonWaiting('temperatureCalibrationTwo')
      this.buttonWaiting('factoryStatusWriteOne')
      this.buttonWaiting('factoryStatusWriteTwo')
      this.buttonWaiting('scanVerificationOne')
      this.buttonWaiting('scanVerificationTwo')
    }
    ,
    async awaken(protocolId, type) {
      await doAwaken(this, protocolId, type)
    },
    async breakSelfTest(protocolId, type) {
      await doBreakSelfTest(this, protocolId, type)
    },
    async scanCodeVerification(protocolId, type) {
      await doScanCodeVerification(this, protocolId, type)
    },
    async handleScanAddressInput(protocolId, type) {
      if (!checkPort(this, type)) {
        this.scanAddress = ''
        return
      }
      this.text.receptionTwoText = ''
      this.messageClean()
      clearTimeout(this.scanTimeout);
      if (this.scanAddress.length !== 8) {
        this.scanTimeout = setTimeout(() => {
          this.scanAddress = ''
        }, 100);
      }

      if (this.scanAddress.length === 8) {
        // if (!await checkNetWork(this, protocolId, type)) {
        //   // if (!this.uploadAddressList.includes(this.scanAddress)) {
        //   //
        //   // }    console.warn(this.uploadAddressList)
        //   this.uploadAddressList.push(this.scanAddress)
        //   this.leftGoodProductQuantity += 1;
        //   //TODO 成功打印定制标签根据型号区分
        // }
      }
    }
    ,
    /**
     * MES上传设备信息
     * 地址可以为空
     * logot= 0  不良品  logot=1 良品
     * badMemo: 不良类型
     * */
    async uploadMes(address, logot, badMemo) {
      //生产机器才上传MES
      if (this.routerParam.produceMachine === 0) {
        let data = {
          address: address,
          workNo: this.routerParam.workNumber,
          logot: logot,
          machineNumber: this.routerParam.machineNumber,
          badMemo: badMemo,
          empNumber: this.routerParam.pwd
        }
        this.uploadDataList.push(data)
        //上传MES
        await saveVacDeviceProduceInfo(this.routerParam.token, this.uploadDataList).then(res => {
          if (res.data.success) {
            // this.createLeftSpanMessage('MES上传成功', 'green')
          } else {
            this.createLeftSpanMessage('MES上传失败', 'red')
          }
        }).catch(err => {
          this.uploadDataList = [];
          handleError(this, 'MES', '网络错误请联系管理员', undefined)
        })

        this.uploadDataList = [];
      }
    },


  }
};
</script>

<style>
html, body {
  margin-top: 0;
  padding: 0;
  overflow: hidden; /* 禁止页面滚动 */
  height: 100%;
  width: 100%;
}

.ant-modal-content {
  width: 45vw !important;
}

/* 自定义样式 */
.a-card {
  background-color: #f0f2f5;
}


.info-line {
  text-align: left;
  margin-bottom: 16px;
  margin-top: -1vh;
  width: 23vw;
}

.info-line-span-printInfo {
  width: calc(650 / 1080 * 100vw);
}

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

.ant-modal-content {
  width: 38vw !important;
}

.a-row, .a-col {
  box-sizing: border-box;
}

/* 彻底覆盖 Ant Design Card 头部样式 */
.ant-card-head {
  min-height: 10px !important;
}

.ant-card-head-title {
  font-size: calc(24 / 1920 * 100vw) !important;
  width: calc(640 / 1920 * 100vw) !important;
  height: calc(40 / 1080 * 100vh) !important;
  /* 文字居中 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.ant-card-head-wrapper {
  height: calc(40 / 1080 * 100vh) !important; /*修正配置信息头部 因其他元素变形问题*/
}


.custom-button.config-btn {
  background-color: rgba(29, 57, 196, 0); /*透明*/
  color: #3f3f3f;
  border: none;
}

.custom-button.print-btn {
  background-color: rgba(29, 57, 196, 0); /*透明*/
  color: #3f3f3f;
  border: none;
}

.custom-button:hover {
  opacity: 0.8; /* 悬停效果 */
}


/*上半部card样式*/
.hlm-card-info-container {
  margin-top: -20px;
  width: calc(1920 / 1920 * 100vw);
  height: calc(350 / 1080 * 100vh);
  display: inline-flex;
}


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
  text-align: left; /*左对齐*/
  display: flex;
  width: 100%; /* 让宽度自适应父容器 */
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-workNumber-body-info-line-label {
  width: calc(80 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh)
}

.hlm-card-workNumber-body-info-line-value {
  width: calc(520 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh)
}


.hlm-card-configInfo {
  width: calc(640 / 1920 * 100vw);
  height: calc(360 / 1080 * 100vh);
  border: 1px solid grey;
  left: 0;
}

.hlm-card-configInfo-body-left-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-nb-configInfo-body-left-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-configInfo-body-center-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-configInfo-body-right-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-nb-configInfo-body-right-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-configInfo-body-info-line {
  text-align: left; /*左对齐*/
  display: flex;
  width: 105%; /* 让宽度自适应父容器 */
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-configInfo-body-info-line-label {
  width: calc(85 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh)
}

.hlm-card-nb-configInfo-body-info-line-label {
  width: calc(80 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh)
}

.hlm-card-configInfo-body-info-line-value {
  width: calc(100 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh)
}

.hlm-card-png {
  width: calc(640 / 1920 * 100vw);
  height: calc(360 / 1080 * 100vh);
  border: 1px solid grey;
  left: 0;
}

/*工装样式*/
.hlm-frock-container {
  margin-top: calc(10 / 1080 * 100vh);
  width: calc(1920 / 1920 * 100vw);
  height: calc(660 / 1080 * 100vh);
  display: inline-flex;
  left: 0;
}

.hlm-form-port {
  display: flex;
  margin-top: calc(20 / 1080 * 100vh);
  height: calc(30 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  width: auto;
  min-width: max-content; /* 允许内容决定最小宽度 */
  flex-wrap: nowrap; /* 禁止换行 */
}

/* 动态间距元素 类似弹框 */
.flex-spacer {
  flex: 1 1 auto; /* 禁止扩展，允许收缩 */
}


.hlm-operate-button-style {
  width: calc(60 / 1920 * 100vw); /* 基于 1920px 设计稿的响应式宽度 */
  height: calc(30 / 1080 * 100vh); /* 基于 1080px 设计稿的响应式高度 */
  min-width: 50px; /* 防止在小屏幕上过小 */
  min-height: 25px; /* 防止在小屏幕上过小 */
  color: grey;
  font-size: calc(14 / 1920 * 100vw); /* 响应式字体大小 */
}

.hlm-port-button-select-style {
  width: calc(120 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  color: grey;
}

/* 地址组（按钮+输入框） */
.address-group {
  margin-right: 1.8vw; /*右边距撑开*/
  display: flex;
}

.hlm-writeAddress-button-style {
  /* 响应式宽度（原120px，限制在 100px~150px 之间按比例缩放） */
  width: clamp(100px, calc(120 / 1920 * 100vw), 150px);
  /* 响应式高度（与原按钮一致） */
  height: clamp(25px, calc(30 / 1080 * 100vh), 40px);
  /* 响应式字体大小（原可能14px，限制在 12px~16px 之间） */
  font-size: calc(14 / 1920 * 100vw); /* 响应式字体大小 */
  /* 其他样式 */
  color: grey;
  border-radius: 4px;
  padding: 0.2em 0.5em; /* 优化文字间距 */
}

.hlm-assignmentTips {
  margin-top: calc(20 / 1080 * 100vh);
  display: inline-flex;
}

.hlm-assignmentTips-button-style {
  /* 响应式宽度（原120px，限制在 100px~150px 之间按比例缩放） */
  width: calc(120 / 1920 * 100vw);
  /* 响应式高度（与原按钮一致） */
  height: calc(50 / 1080 * 100vh);
  /* 响应式字体大小（原可能14px，限制在 12px~16px 之间） */
  font-size: calc(19 / 1920 * 100vw); /* 响应式字体大小 */
  font-weight: bold;
  color: grey;
}

.hlm-assignmentTips-button-text-style {
  /* 响应式宽度（原120px，限制在 100px~150px 之间按比例缩放） */
  width: calc(740 / 1920 * 100vw);
  /* 响应式高度（与原按钮一致） */
  height: calc(50 / 1080 * 100vh);
  /* 响应式字体大小（原可能14px，限制在 12px~16px 之间） */
  font-size: calc(19 / 1920 * 100vw); /* 响应式字体大小 */
  font-weight: bold;
  color: #FF770F;
  visibility: visible !important;

}

.hlm-flow-container-style {
  margin-top: calc(20 / 1080 * 100vh);
  display: inline-flex;
  position: relative;
}


.hlm-nb-flow-arrowContainer-style {
  position: absolute;
  margin-top: calc(35 / 1080 * 100vh);
  display: flex; /*箭头由两部分组成 ：实现+空心箭头 flex布局 */
}

.hlm-nb-flow-straightArrows-style {
  width: calc(600 / 1920 * 100vw);
  height: 0.5vh;
  background-color: #FF770F;
  margin-left: 3vw;
}

.hlm-nb-flow-arrows-style {
  position: absolute;
  right: -0.01vh; /* 向内收一点，让线条顶到箭头 */
  top: 50%;
  width: 2vh;
  height: 2vh;
  border-top: 0.4vh solid #FF770F;
  border-right: 0.4vh solid #FF770F;
  transform: translateY(-50%) rotate(45deg);
  background: transparent;
}

.hlm-flow-arrowContainer-style {
  position: absolute;
  top: 7vh;
  display: flex; /*箭头由两部分组成 ：实现+空心箭头 flex布局 */
  margin-left: -3vw;

}

.hlm-flow-straightArrows-style {
  width: 35vw;
  height: 0.5vh;
  background-color: #FF770F;
  margin-left: 3vw;
}

.hlm-flow-arrows-style {
  position: absolute;
  right: -0.01vh; /* 向内收一点，让线条顶到箭头 */
  top: 50%;
  width: 2vh;
  height: 2vh;
  border-top: 0.4vh solid #FF770F;
  border-right: 0.4vh solid #FF770F;
  transform: translateY(-50%) rotate(45deg);
  background: transparent;
}

.hlm-flow-button-style {
  width: calc(60 / 1920 * 100vw);
  height: calc(50 / 1080 * 100vh);
  border-color: #666666;
  background-color: transparent;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(15 / 1920 * 100vw); /* 响应式字体大小 */
  white-space: normal;

}

.hlm-nb-flow-button-style {
  width: calc(120 / 1920 * 100vw);
  height: calc(50 / 1080 * 100vh);
  border-color: #666666;
  background-color: transparent;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(15 / 1920 * 100vw); /* 响应式字体大小 */
  white-space: normal;

}

.hlm-flow-start-button-style {
  width: calc(140 / 1920 * 100vw);
  height: calc(100 / 1080 * 100vh);
  border-color: #666666;
  background-color: #FF770F !important; /*强制覆盖 防止disabled 优先级过高*/
  color: white !important; /*强制覆盖 防止disabled 优先级过高*/
  text-align: center;
  font-weight: bold;
  font-size: calc(22 / 1920 * 100vw); /* 响应式字体大小 */
  white-space: nowrap;

}

.hlm-nb-business-start-button-style {
  width: calc(120 / 1920 * 100vw);
  height: calc(50 / 1080 * 100vh);
  border-color: #666666;
  background-color: #FF770F; /*强制覆盖 防止disabled 优先级过高*/
  color: white !important; /*强制覆盖 防止disabled 优先级过高*/
  text-align: center;
  font-size: calc(18 / 1920 * 100vw); /* 响应式字体大小 */
  white-space: nowrap;
  margin-left: calc(40 / 1920 * 100vw);

}

.hlm-nb-not-important-business-start-button-style {
  width: calc(60 / 1920 * 100vw);
  height: calc(50 / 1080 * 100vh);
  border-color: #666666;
  background-color: #F2F2F2;
  font-size: calc(15 / 1920 * 100vw);
  padding: 0; /* 清除可能的内边距 */
}

.hlm-nb-not-important-business-body-style {
  margin-left: calc(140 / 1920 * 100vw);
}


.hlm--statistics-container-style {
  margin-top: calc(20 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  width: 100%;
  display: inline-flex;

}

.hlm-nb-statistics-container-style {
  margin-top: calc(70 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  width: 100%;
  display: inline-flex;

}

.hlm-flow-machine-goodProduct-statistics-style {
  width: calc(60 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  border-color: grey;
  color: black;
  font-size: calc(15 / 1920 * 100vw); /* 响应式字体大小 */
  padding: 0 !important; /* 防止框架默认 padding 影响 */
}

.hlm-nb-address-style {
  width: calc(140 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  border-color: grey;
  color: black;
  font-size: calc(15 / 1920 * 100vw); /* 响应式字体大小 */
  padding: 0 !important; /* 防止框架默认 padding 影响 */
}

.hlm-flow-defectiveProducts-statistics-style {
  width: calc(60 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  border-color: grey;
  color: red;
  font-size: calc(15 / 1920 * 100vw); /* 响应式字体大小 */
  padding: 0 !important; /* 防止框架默认 padding 影响 */
}

.hlm-flow-log-container-style {
  width: calc(860 / 1920 * 100vw);
  height: calc(290 / 1080 * 100vh);
  margin-top: calc(20 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  border: 1px solid #d9d9d9; /*外边框*/
  text-align: left;
  overflow: hidden; /*  禁止外层滚动 */
}

.hlm-nb-log-container-style {
  width: calc(860 / 1920 * 100vw);
  height: calc(230 / 1080 * 100vh);
  margin-top: calc(20 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  border: 1px solid #d9d9d9; /*外边框*/
  text-align: left;
  overflow: hidden; /*  禁止外层滚动 */
}


.hlm-flow-fail-log-container-style {
  width: calc(860 / 1920 * 100vw);
  height: calc(568 / 1080 * 100vh);
  margin-top: calc(20 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  border: 1px solid #d9d9d9; /*外边框*/
  text-align: left;
  overflow: hidden; /*  禁止外层滚动 */
}

.hlm-flow-log-info-style {
  font-size: calc(16 / 1920 * 100vw) !important;
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(30 / 1920 * 100vw);
  /* 内层内容区：限制为外层高度的60%并滚动 */
  max-height: 60% !important;
  overflow-y: auto !important;
}

.hlm-flow-fail-log-info-style {
  font-size: calc(16 / 1920 * 100vw) !important;
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(30 / 1920 * 100vw);
  /* 内层内容区：限制为外层高度的60%并滚动 */
  max-height: 75% !important;
  overflow-y: auto !important;
}

.hlm-flow-log-info-style * {
  font-size: inherit !important; /* 继承父级字体大小 */
}

.hlm-writeAddress-input-style {
  width: calc(140 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  color: grey;
}

.static-btn {
  pointer-events: none; /* 禁用所有鼠标事件（点击、悬停） */
  cursor: default; /* 鼠标指针变回默认箭头（非手型） */
  opacity: 1; /* 防止 Ant Design 禁用状态变灰 */
}

.form-item-spacing {
  margin-left: -0.9vw;
}

/* 隐藏数字输入框的加减按钮（Chrome、Safari、Edge、Opera） */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 隐藏数字输入框的加减按钮（Firefox） */
.no-spinner {
  -moz-appearance: textfield;
}

/* 强制覆盖 AntD 按钮禁用样式 */
.ant-btn[disabled],
.ant-btn-disabled {
  border-color: inherit !important; /* 继承原边框色 */
  cursor: not-allowed !important; /* 保留禁止点击光标 */
  pointer-events: none !important; /* 禁止点击效果 */
}
</style>
