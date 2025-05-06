<template>
  <a-layout style="height: 100vh; width: 100vw;overflow: hidden;">

    <a-layout-content style=" height: 100%; width: 100%;">
      <div style="display: flex; gap: 5px;     ">
        <a-button class="custom-button" @click="workNumberInputDetail">
          工单录入
        </a-button>
        <a-button class="custom-button" @click="configInputDetail">
          配置录入
        </a-button>
        <a-button class="custom-button" @click="getPrinter()">
          打印机，标签设置
        </a-button>
      </div>

      <div>
        <!-- Modal container for the configuration input form -->
        <a-modal
          v-model:visible="modalShow.configInputDetailModalShow"
          title="配置录入"
          :bodyStyle="{ height: '52.5vh' }"
          style="margin-left: 22vw; margin-top: -5vh"
          okText="确定"
          cancelText="取消"
          @ok="configInputDetailModalOk()"
        >
          <!-- Form with horizontal layout -->
          <a-form
            layout="horizontal"
            style="width: 100%; height: 100%"
          >
            <!-- Grid row to create two-column layout -->
            <a-row :gutter="4">
              <!-- Left column: Configuration Items -->
              <a-col :span="11">
                <h1 style="font-weight: bold">配置项</h1>
                <!-- Pressure Probe dropdown -->
                <a-form-item label="压力探头">
                  <a-select
                    v-model:value="this.configForm.pressureProbes"
                    style="width: 7vw; margin-left: 3vw"
                  >
                    <a-select-option
                      v-for="item in this.pressureProbesList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- Temperature Type dropdown -->
                <a-form-item label="测温类型">
                  <a-select
                    v-model:value="this.configForm.temperatureProbes"
                    style="width: 7vw; margin-left: 3vw"
                  >
                    <a-select-option
                      v-for="item in this.temperatureProbesList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- Torque dropdown -->
                <a-form-item label="扭矩">
                  <a-select
                    v-model:value="this.configForm.torques"
                    style="width: 8vw; margin-left: 4.5vw"
                  >
                    <a-select-option
                      v-for="item in this.torquesList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- Screen Display dropdown -->
                <a-form-item label="屏幕显示">
                  <a-select
                    v-model:value="this.configForm.screenDisplay"
                    style="width: 7vw; margin-left: 3vw"
                  >
                    <a-select-option
                      v-for="item in this.screenDisplayList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <!-- Right column: Verification Items -->
              <a-col :span="12">
                <h1 style="font-weight: bold">验证项</h1>
                <!-- Temperature Calibration input -->
                <a-form-item label="温度标定">
                  <a-input-number
                    v-model:value="this.configForm.temperature"
                    style="width: 7vw; margin-left: 3vw"
                  ></a-input-number>
                </a-form-item>
                <!-- Produce Model dropdown -->
                <a-form-item label="标签型号">
                  <a-select
                    v-model:value="this.configForm.produceModel"
                    style="width: 7vw; margin-left: 3vw"
                  >
                    <a-select-option
                      v-for="item in this.produceModelList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- Custom Print Label dropdown -->
                <a-form-item label="定制化标签型号">
                  <a-select
                    v-model:value="this.configForm.customizePrintLabel"
                    style="width: 7vw; margin-left: 0.8vw"
                  >
                    <a-select-option
                      v-for="item in this.customizePrintLabelList"
                      :value="item"
                    >
                      {{ item }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <!-- Program Version input -->
                <a-form-item label="程序版本">
                  <a-input
                    v-model:value="this.configForm.version"
                    style="width: 7vw; margin-left: 3vw"
                  ></a-input>
                </a-form-item>
                <!-- Process Focus input -->

              </a-col>
            </a-row>
            <a-form-item label="工序重点" style="margin-top: 7vh;margin-left: 8vw">
              <a-input
                v-model:value="this.configForm.processFocus"
                style="width: 11vw; margin-left: 3vw"
              ></a-input>
            </a-form-item>
            <!-- Password field at the bottom -->
            <a-form-item label="密码" style="margin-top: 20px;margin-left: 8vw">
              <a-input-password
                style="width: 8vw; margin-left: 4.5vw"
                v-model:value="this.password"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>

      <div>
        <a-modal v-model:visible="modalShow.workNumberDetailModalShow" title="工单录入"
                 :bodyStyle="{  height: '26vh' }"
                 style="margin-left: 22vw;margin-top: -5vh"
                 okText="确定" cancelText="取消" @ok="workNumberModalOk"

        >
          <a-form
            layout="horizontal"
            style="width: 100%;height: 100%"
          >
            <a-form-item label="工单号">
              <a-input v-model:value="this.workNumberForm.workNumber" style="width: 12vw;margin-left: 2vw"></a-input>
            </a-form-item>

            <a-form-item label="注意事项">
              <a-input v-model:value="this.workNumberForm.precautions" style="width: 20vw;margin-left: 1.2vw"></a-input>
            </a-form-item>


            <a-form-item label="厂商代码">
              <a-select v-model:value="this.workNumberForm.vendorCode" style="width: 7vw;margin-left: 1.2vw">
                <a-select-option v-for="item in this.vendorCodeList"
                                 :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
<!--            <a-form-item label="客户">
              <a-select v-model:value="this.workNumberForm .customer" style="width: 7vw;margin-left: 2.65vw">
                <a-select-option v-for="item in this.customerList"
                                 :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>-->
            <a-form-item label="密码">
              <a-input-password style="width: 8vw;margin-left: 2.65vw" v-model:value="this.password"
                                placeholder="请输入密码"/>
            </a-form-item>
          </a-form>
        </a-modal>
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
              <a-select v-model:value="this.labelPaperSize" style="width: 7vw">
                <a-select-option v-for="item in this.labelPaperSizeList" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>

        </a-modal>
      </div>

      <div style="height: 33.58vh">
        <a-card
          title="工单信息"
          style="height: 35vh; width: 25.5vw; border:1.5px solid grey; "
          :headStyle="{
            textAlign: 'left',
            background: 'linear-gradient(45deg, #409EFF, #67C23A)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '0.9px 16px'}"
        >
          <div style="height: 34px">
            <!-- 工单信息内容 -->
            <div class="info-line"><span class="label">工单号</span>: <span
              class="value">{{ workDetail.workNumber }}</span></div>
            <div class="info-line"><span class="label">产品编码</span>: <span
              class="value">{{ workDetail.productCode }}</span></div>
            <div class="info-line"><span class="label">产品名称</span>: <span
              class="value">{{ workDetail.productName }}</span>
            </div>
            <div class="info-line"><span class="label">型号规格</span>: <span
              class="value">{{ workDetail.productModel }}</span>
            </div>
            <div class="info-line"><span class="label">程序名称</span>: <span
              class="value">{{ workDetail.programName }}</span>
            </div>
            <div class="info-line"><span class="label">工单数量</span>: <span
              class="value">{{ workDetail.workQuantity }}</span>
            </div>
            <div class="info-line"><span class="label">完工日期</span>: <span
              class="value">{{ workDetail.finishDate }}</span>
            </div>
            <div class="info-line"><span class="label">注意事项</span>: <span
              class="value">{{ workDetail.memo }}</span>
            </div>
            <div class="info-line"><span class="label">当前选择厂商代码:</span>: <span
              class="value">{{ workDetail.vendorCode }}</span>
            </div>
<!--            <div class="info-line"><span class="label">当前客户:</span>: <span
              class="value">{{ workDetail.customerName }}</span>
            </div>-->

          </div>

        </a-card>

        <a-card
          title="配置信息"
          style="height: 35vh; width: 30vw; margin-top: -35vh; margin-left: 25.5vw; border: 1.5px solid grey;"
          :headStyle="{
    textAlign: 'left',
    background: 'linear-gradient(45deg, #409EFF, #67C23A)',
    color: '#fff',
    fontWeight: 'bold',
    padding: '0.9px 16px'
  }"
        >
          <div>
            <a-row :gutter="16">
              <!-- Left column: Configuration Items -->
              <a-col :span="12">
                <h1 style="font-weight: bold; margin-bottom: 10px;">配置项</h1>
                <div class="info-line">
                  <span class="label">测温类型</span>:
                  <span class="value">{{ configDetail.temperatureProbe }}</span>
                </div>
                <div class="info-line">
                  <span class="label">压力探头</span>:
                  <span class="value">{{ configDetail.pressureProbes }}</span>
                </div>
                <div class="info-line">
                  <span class="label">扭矩</span>:
                  <span class="value">{{ configDetail.torques }}</span>
                </div>
                <div class="info-line">
                  <span class="label">屏幕显示</span>:
                  <span class="value">{{ configDetail.screenDisplay }}</span>
                </div>
              </a-col>

              <!-- Right column: Verification Items -->
              <a-col :span="12">
                <h1 style="font-weight: bold; margin-bottom: 10px;">验证项</h1>
                <div class="info-line">
                  <span class="label">温度标定</span>:
                  <span class="value">{{ configDetail.temperature }}</span>
                </div>
                <div class="info-line">
                  <span class="label">标签型号</span>:
                  <span class="value">{{ configDetail.printLabel }}</span>
                </div>
                <div class="info-line">
                  <span class="label">定制化标签型号</span>:
                  <span class="value">{{ configDetail.customizePrintLabel }}</span>
                </div>
                <div class="info-line">
                  <span class="label">程序版本</span>:
                  <span class="value">{{ configDetail.version }}</span>
                </div>
              </a-col>
            </a-row>

            <!-- Process Focus (spanning full width) -->
            <div class="info-line" style="margin-top: 10px;">
              <span class="label">工序重点</span>:
              <span class="value">{{ configDetail.processFocus }}</span>
            </div>
          </div>
        </a-card>


        <a-card
          title="产品首件图片"
          style="height: 35vh; width: 46.5vw; margin-top: -35vh; margin-left: 55.5vw; border: 1.5px solid grey;"
          :headStyle="{
      textAlign: 'left',
      background: 'linear-gradient(45deg, #409EFF, #67C23A)',
      color: '#fff',
      fontWeight: 'bold',
      padding: '0.9px 16px'
    }"
        >
          <a-row :gutter="5" style="height: 100%; width: 100%">
            <!-- 主图位置 1 -->
            <img
              v-if="mainImages[0]"
              :src="mainImages[0] === undefined ? '' : mainImages[0].url"
              style="width: 15.3vw; height: 29.3vh; margin-top: -2.1vh; margin-left: -1.22vw; "
              @click="openModal(mainImages[0]?.url)"
            />
            <!-- 主图位置 2 -->
            <img
              v-if="mainImages[1]"
              :src="mainImages[1] === undefined ? '' : mainImages[1].url"
              style="width: 15.3vw; height: 29.3vh; margin-top: -2.1vh; margin-left: -1.22vw;  "
              @click="openModal(mainImages[1]?.url)"
            />
            <!-- 非主图位置 3 (index 0) -->
            <img
              v-if="mainImages[2]"
              :src="subImages[2] === undefined ? '' : subImages[2].url"
              style="width: 18vw; height: 14.5vh; margin-top: -29.3vh; margin-left: 28.1vw;  "
              @click="openModal(subImages[0]?.url)"
            />
            <!-- 非主图位置 4 (index 1) -->
            <img
              v-if="mainImages[3]"
              :src="subImages[3] === undefined ? '' : subImages[3].url"
              style="width: 18vw; height: 14.9vh; margin-top: -14.8vh; margin-left: 28.1vw; "
              @click="openModal(subImages[1]?.url)"
            />
          </a-row>
        </a-card>
        <a-modal
          :visible="modalVisible"
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
      `
      <div style="display: inline-flex ;">
        <a-card title="生产流程" style="height: 65vh;
        margin-top: -1.5vh;
        width: 50vw; margin-right: 9vw;overflow: hidden;"
                :headStyle="{ backgroundColor: '#ADD8E6' }">
          <!-- 左侧工装内容 -->
          <a-form
            name="basic"
            layout="inline"
            style="padding-left: 10px; display: flex; align-items: center;"
          >
            <a-form-item>
              <a-button @click=" this.getAllPorts()">刷新</a-button>
            </a-form-item>
            <a-form-item label="串口列表">
              <a-select v-model:value="this.portAttributes.selectedPort" style="width: 110px;"
                        @change="handlePortChange(this.portAttributes.selectedPort)">
                <a-select-option v-for="port in this.portAttributes.serialPortList" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button @click="openPort(
                this.portAttributes.selectedPort,


              )"
                        :disabled="!this.portAttributes.portClosedStatus">打开
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button @click="closePort(this.portAttributes.selectedPort)"
                        :disabled="this.portAttributes.portClosedStatus">关闭
              </a-button>
            </a-form-item>

            <a-form-item label="写入地址" style="margin-left: 1vw">
              <a-input
                type="number"
                v-model:value="this.generateAddress"
                placeholder="请输入地址"
                :maxlength="8"
                ref="input1"
                @input="validateNumberInputOne(this.generateAddress)"
              ></a-input>
            </a-form-item>


          </a-form>

          <div style="margin-top: 16px; display: inline-flex; margin-right: 9vw;">
            <p style="font-size: 19px; white-space: nowrap;font-weight: bold ;margin-top:5px">
              作业提示：
            </p>
            <a-button type="primary"
                      :style="{
                     backgroundColor:nbButtonColor.leftWorkPrompt,
                     borderColor:'black',
                       color: 'black', width: '42vw', height: '5vh' ,
                      pointerEvents: 'none',fontWeight: 'bold',fontSize: '19px'
                      }">
              <p>
                {{ this.leftWorkPrompt }}
              </p>
            </a-button>
          </div>


          <div style="position: relative; display: inline-flex; margin-right: 7vw; margin-top: 5vh;">
            <!-- 绿色箭头 -->
            <div
              style="position: absolute; top: -4vh; left: 0; right: 0; display: flex; justify-content: center;margin-left: -2vw">
              <div style="width: 47vw; height: 1vh; background-color: limegreen; position: relative;">
                <!-- 箭头本体 -->
                <div style="height: 100%; width: 100%; background-color: limegreen;"></div>
                <!-- 箭头尖（朝右） -->
                <div
                  style="border-top: 1.5vh solid transparent; border-bottom: 1.5vh solid transparent; border-left: 3vh solid limegreen; position: absolute; right: -3vh; top: -0.8vh;"></div>
              </div>
            </div>

            <a-button type="primary" block
                      @click="selfTest(protocolIDMap[this.configForm.produceModel].protocolId)"
                      :disabled="nbButtonDisabledStatus.selfTest"
                      :style="{
                        backgroundColor: nbButtonColor.selfTest,
                         borderColor: 'black',
                         width: '7vw',
                         height:'5.5vh',
                         color: 'black',
                         textAlign: 'center',
                         whiteSpace: 'nowrap',
                         wordBreak: 'break-all',
                         paddingTop: '0px',
                         fontWeight: 'bold'
                      }">
              自检
            </a-button>

            <a-button type="primary" block
                      @click="addressWrite(protocolIDMap[this.configForm.produceModel].protocolId)"
                      :disabled="nbButtonDisabledStatus.writeAddress"
                      :style="{
                        backgroundColor: nbButtonColor.writeAddress,
                         borderColor: 'black',
                          width: '7vw',height:'5.5vh',
                          color: 'black',
                          textAlign: 'center',
                          marginLeft:'3.3vw',
                         whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        paddingTop:'0px',
                        fontWeight: 'bold'
                }">
              地址写入
            </a-button>
            <a-button type="primary" block
                      v-if="
                      this.configDetail.printLabel === 'WAC230CF'||
                      this.configDetail.printLabel === 'WAC710CD'"
                      @click="awaken(
                        protocolIDMap[this.configForm.produceModel].protocolId,
                        )"
                      :disabled="nbButtonDisabledStatus.awaken"
                      :style="{
                        backgroundColor: nbButtonColor.awaken,
                         borderColor: 'black',
                          width: '7vw',height:'5.5vh',
                          color: 'black',
                          textAlign: 'center',
                          marginLeft:'3.3vw',
                         whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        paddingTop:'0px',
                        fontWeight: 'bold'
                }">
              唤醒
            </a-button>
            <a-button type="primary" block
                      @click="printLabel(
                      false,
                        protocolIDMap[this.configForm.produceModel].protocolId,
                        )"
                      :disabled="nbButtonDisabledStatus.labelPrint"
                      :style="{
                        backgroundColor: nbButtonColor.labelPrint,
                         borderColor: 'black',
                          width: '7vw',height:'5.5vh',
                          color: 'black',
                          textAlign: 'center',
                          marginLeft:'3.3vw',
                         whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        paddingTop:'0px',
                        fontWeight: 'bold'
                }">
              标签打印
            </a-button>
            <a-button type="primary" block
                      v-if="
                      this.configDetail.printLabel === 'WAC710CD'"
                      @click="breakSelfTest(
                        protocolIDMap[this.configForm.produceModel].protocolId,
                        )"
                      :disabled="nbButtonDisabledStatus.breakSelfTest"
                      :style="{
                        backgroundColor: nbButtonColor.breakSelfTest,
                         borderColor: 'black',
                          width: '7vw',height:'5.5vh',
                          color: 'black',
                          textAlign: 'center',
                          marginLeft:'3.3vw',
                         whiteSpace: 'nowrap',
                        wordBreak: 'break-all',
                        paddingTop:'0px',
                        fontWeight: 'bold'
                }">
              退出自检
            </a-button>

          </div>

          <div style="margin-top: 2vh; width: 45vw; height: 25vh">
            <div
              id="left_textarea_id"
              ref="receptionLeftText"
              style="width: 47vw; height: 25vh; overflow-y: auto; border: 1px solid #d9d9d9; padding: 4px;"
            >
              <div
                v-html="receptionLeftText"
                style="font-weight: bold; color: green;"
              ></div>
            </div>
          </div>

        </a-card>
        <a-card title="生产验证" style="
        height: 65vh; width: 50vw;margin-left: -9vw;
                 margin-top: -1.50vh;
         overflow: hidden; "
                :headStyle="{ backgroundColor: '#ADD8E6' }">
          <div style="display: inline-flex; align-items: center; gap: 20px; margin-top: -150px">
            <a-form :layout="'inline'">
              <a-form-item label="机号" style="background-color: deepskyblue;height: 32px ;width: 5vw;margin-left:-4vw">
                <p
                  :style="machineNumber !== undefined ? { backgroundColor: '#f0f0f0', padding: '5px', width: '3vw' } : {}">
                  {{ machineNumber }}
                </p>
              </a-form-item>
              <a-form-item label="良品数"
                           style="background-color: deepskyblue;height: 32px ;margin-left: 3vw;width: 5vw;">
                <p
                  :style="goodProductQuantity !== undefined ? { backgroundColor: '#f0f0f0', padding: '5px', width: '3vw' } : {}">
                  {{ goodProductQuantity }}
                </p>
              </a-form-item>
              <a-form-item label="不良数"
                           style="background-color: deepskyblue;height: 32px;;margin-left: 3vw;width: 5vw;">
                <p
                  :style="badProductQuantity !== undefined ? { backgroundColor: '#f0f0f0', padding: '5px', width: '3vw' } : {}">
                  {{ badProductQuantity }}
                </p>
              </a-form-item>
              <a-form-item label="不良率"
                           style="background-color: deepskyblue;height: 32px;margin-left: 3vw;width: 5vw;">
                <p
                  :style="this.badRate !== undefined ? { backgroundColor: '#f0f0f0', padding: '5px', width: '3vw'  } : {}">
                  {{ this.computedBadRate() }}
                </p>
              </a-form-item>
            </a-form>
          </div>
          <div style="margin-top: 16px; display: inline-flex; margin-right: 5vw;">
            <p style="font-size: 19px; white-space: nowrap;font-weight: bold ;margin-top:5px">
              作业提示：
            </p>
            <a-button type="primary"
                      :style="{
                     backgroundColor:nbButtonColor.rightWorkPrompt,
                     borderColor:'black',
                       color: 'black', width: '42vw', height: '5vh' ,
                      pointerEvents: 'none',fontWeight: 'bold',fontSize: '19px'
                      }">
              <p>
                {{ this.rightWorkPrompt }}
              </p>
            </a-button>
          </div>

          <div style="position: relative; margin-top: 5vh;">
            <a-form
              name="basic"
              layout="inline"
              style=" display: flex; align-items: center;margin-left: 10px"
            >
              <a-form-item label="扫码地址验证 联网|温度">
                <a-input v-model:value="scanAddress" style="width: 140px"
                         @input="handleScanAddressInput( protocolIDMap[this.configForm.produceModel].protocolId)"
                />
              </a-form-item>


            </a-form>

          </div>
          <div style="height: 2.5vh;">
            <div style="margin-top: 0.9vh" v-if="this.configDetail.printLabel!=='WAC230CF'">
              <a-form
                name="basic"
                layout="inline"
                style="display: flex; align-items: center;"
              >
<!--                <a-form-item label="误差限额50℃ ±" :colon="false" style="margin-left: 3.4vw;">
                  <a-input v-model:value="diffTemperatureValue" style="width: 140px"/>
                </a-form-item>
                <a-form-item label="设备进温" :colon="true" style="margin-left: 0.5vw">
                  <p style="width: 5vw; margin: 0 0 0 -40px; color: #0080FF; font-weight: bold;">
                    {{ deviceInTemperature }}
                  </p>
                </a-form-item>
                <a-form-item label="设备回温" :colon="true" style="margin-left: -1vw">
                  <p style="width: 5vw; margin: 0 0 0 -40px; color: #0080FF; font-weight: bold;">
                    {{ deviceInTemperature }}
                  </p>
                </a-form-item>-->
              </a-form>
            </div>
          </div>
          <div style="margin-top: 2vh; width: 45vw; height: 25vh">
            <div
              id="right_textarea_id"
              ref="receptionRightText"
              style="width: 47vw; height: 25vh; overflow-y: auto; border: 1px solid #d9d9d9; padding: 4px;"
            >
              <div
                v-html="receptionRightText"
                style="font-weight: bold; color: green;"
              ></div>
            </div>
          </div>


        </a-card>
      </div>

    </a-layout-content>
  </a-layout>
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
import {checkNetWork, doAwaken, doPrintLabel, doSelfTest, doWriteAddress, doBreakSelfTest} from "@/views/device/handler/deviceHandler";
import {handleRightError, handleRightSuccess} from "@/views/device/action/deviceAction";
import {
  getProductImageList,
  getWorkDetail,
  login,
  queryWorkNosWithUnfinished,
  saveVacDeviceProduceInfo
} from "@/api/remote";
import {sm2} from 'sm-crypto';
import {getDefaultPassword} from "@/components/global/productdb";
import {decodeGetTorque} from "@/packBuffer/decode/decode";

export default {
  data() {
    return {
      modalVisible: false,
      selectedImage: '',
      globalReceivedData: '',
      click: true,
      machineNumber: undefined,
      goodProductQuantity: 0,
      badProductQuantity: 0,
      badRate: 0,
      leftWorkPrompt: '',
      rightWorkPrompt: '',
      selfTestButtonStatus: false,
      writeAddressButtonStatus: false,
      audioContext: undefined,
      defaultDeviceName: '',
      portAttributes: {
        portClosedStatus: true,
        selectedPort: null,
        serialPort: undefined,
        serialPortList: undefined
      },
      printerList: [],
      routerParam: {
        token: undefined,
        number: undefined,
        customerName: '',
        vendorCode: '',
        userId: undefined,
        macAddr: undefined,
        machineNumber: undefined,
        produceMachine: undefined
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
        vendorCode: undefined,
        customerName: undefined,
      },
      deviceInTemperature: 0,
      temperatureProbesList: ['无探头', '回温探头', '进温探头', '双探头'],
      screenDisplayList: ['轮显', '不轮显'],
      produceModelList: ['WAC230CF'],
      customizePrintLabelList: [],
      pressureProbesList: ['无探头', '进压探头', '回压探头', '双探头'],
      torquesList: ['25Nm', '50Nm'],
      vendorCodeList: ['0000000', '0000001', '0000002', '0000003'],
      labelPaperSize: undefined,
      labelPaperSizeList: ['30mm*12mm'],
      customerList: ['青岛海龙马电子', '泉州七阳'],
      configForm: {
        temperatureProbes: undefined,
        version: undefined,
        temperature: undefined,
        processFocus: undefined,
        screenDisplay: undefined,
        produceModel: undefined,
        customizePrintLabel: undefined,
        pressureProbes: undefined,
        torques: undefined,
      },
      workNumberForm: {
        workNumber: undefined,
        precautions: undefined,
        vendorCode: '000000',
        customer: undefined,
      },
      modalShow: {
        printDeviceModalShow: false,
        configInputDetailModalShow: false,
        workNumberDetailModalShow: false,
      },
      configDetail: {
        temperatureProbe: undefined,//温度探针 0、无探头: 1、回温: 2、进温: 3、双探头
        version: undefined, //程序版本号
        temperature: 50,//设定温度 默认
        processFocus: undefined, //工序重点
        screenDisplay: '轮显', //屏幕显示 0 不轮显 1 轮显
        printLabel: undefined, //打印标签
        customizePrintLabel: undefined,//定制化打印标签
        pressureProbes: undefined, //压力探头,
        torques: undefined,//扭矩
      },
      generateAddress: '',
      receptionLeftText: '',
      receptionRightText: '',
      password: undefined,
      workNumberPassword: undefined,
      nbButtonDisabledStatus: button.nbDeviceButton.disabledStatus,
      nbButtonColor: button.nbDeviceButton.color,
      scanAddress: undefined,
      maxRetries: 3,
      timeout: 3000,
      productName: undefined,
      protocolId: undefined,
      version: undefined,
      netprovider: 2,
      imei: undefined,
      torque: undefined,
      iccid: undefined,
      readAddress: undefined,
      uploadDataList: [],
      token: 'Bearer',
      workNumberList: undefined,
      url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=',
      mainImages: [],
      subImages: [],
      imageList: [
        // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1910246876502339585', flag: true},
        // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475299650256897', flag: true},
        // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475386392657922', flag: false},
        // {url: 'http://192.168.0.159:82/bdaFile/preview?objectKey=1696475765050228737', flag: false}
      ],
      decodeConfigForm: {
        produceModel: '', // 第一级：产品型号
        secondLevelContainsD: false, // 第二级是否包含 D 显示屏
        temperatureConfig: '', // 第三级：测温配置
        pressureConfig: '' // 第九级：压力传感器配置
      },
      uploadAddressList: [],
    };
  },
  async mounted() {
    const route = useRoute();
    //路由 获取userId,mac地址
    //初始化登录MES拿token
    this.routerParam.userId = route.query.userId;
    this.routerParam.machineNumber = route.query.machineNumber;
    this.machineNumber = this.routerParam.machineNumber
    this.routerParam.produceMachine = Number(route.query.produceMachine);
    //获取工单默认密码
    let defaultPassword = await getDefaultPassword('workNumber')
    this.workNumberPassword = defaultPassword[0].passWord;
    console.log(this.routerParam)

    //登录
    const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
    const password = sm2.doEncrypt('libaiyiwan1', publicKey, 1)
    await login({account: 'libaiyi', password: password}).then(async (res) => {
      console.log(res)
      if (res.data.code === 200) {
        console.log('登录成功')
        this.token = this.token + " " + res.data.data
        //获取全部工单号
        await queryWorkNosWithUnfinished(this.token).then((res) => {
          this.workNumberList = res.data.data
            .filter(item => item.workNo !== undefined)
            .map(item => item.workNo);
          console.log(res)
        })
      }

    }).catch((error) => {
      this.$message.error('网络错误,请联系管理员',)
      console.log('网络错误,请联系管理员', error)
    });

  },
  computed: {
    // 主图 (flag=true)，最多取前2张
    protocolIDMap() {
      return protocolIDMap
    },
    computedBadRate() {
      return () => {
        if (this.badProductQuantity !== undefined && this.badProductQuantity !== null && this.badProductQuantity !== 0) {
          return Number((this.badProductQuantity / (this.goodProductQuantity + this.badProductQuantity)).toFixed(2)) * 100 + '%'
        } else {
          return 0
        }
      }
    }

  },
  created() {
    //初始化串口列表
    this.getAllPorts()
    //初始化协议id
  },
  watch: {
    receptionLeftText() {
      //$nextTick:更新DOM后再操作DOM
      this.$nextTick(() => {
        const textarea = this.$refs.receptionLeftText;
        textarea.scrollTop = textarea.scrollHeight;
      });
    }
    ,
    receptionRightText() {
      //$nextTick:更新DOM后再操作DOM
      this.$nextTick(() => {
        setTimeout(() => {
          const textarea = document.getElementById('right_textarea_id')
          textarea.scrollTop = textarea.scrollHeight;
        }, 20);
      });
    }
    ,
  },
  methods: {
    openModal(imageUrl) {
      if (imageUrl) {
        this.selectedImage = imageUrl;
        this.modalVisible = true;
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.selectedImage = '';
    },
    createLeftSpanMessage(message, color) {
      this.receptionLeftText += `<span style="color: ${color}; font-size: 15px;">${message}</span><br>`;
      return this.receptionLeftText;
    },
    createRightSpanMessage(message, color) {
      this.receptionRightText += `<span style="color: ${color}; font-size: 15px;">${message}</span><br>`;
      return this.receptionRightText;
    },
    async printLabel(flag, protocolId) {
      await doPrintLabel(this, flag, protocolId)
    },
    getAllPorts() {
      initializeAllSerialPorts(this)
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
      this.modalShow.printDeviceModalShow = false
      const selectedPrinter = this.printerList.find(item => item.isSelected);
      if (selectedPrinter) {
        this.defaultDeviceName = selectedPrinter.name;
      }
    },
    async workNumberModalOk() {
      if (this.checkPassword()) {
        if (this.routerParam.produceMachine === 0 && (this.workNumberForm.workNumber === undefined || this.workNumberForm.workNumber === '' || this.workNumberForm.workNumber === null)) {
          this.$message.error('请录入工单号');
          return;
        }
        console.log(this.workNumberList)
        // 验证工单是否正确
        if (this.routerParam.produceMachine === 0 && this.workNumberList.find(item => item === this.workNumberForm.workNumber) === undefined) {
          this.$message.error('工单号错误，请重新录入');
          return;
        }
        // 生产录入工单信息
        if (this.routerParam.produceMachine === 0) {
          try {
            // MES信息赋值
            const res = await getWorkDetail(this.token, this.workNumberForm.workNumber);
            let data = res.data;
            if (data.code !== 200) {
              this.$message.error('网络错误请联系管理员');
              return; // Stop execution if getWorkDetail fails
            }

            // 以下为原有的 getWorkDetail 成功后的逻辑
            let model = data.data.productModel;
            if (model === undefined || model === null || model === '') {
              this.$message.error('产品型号错误，请联系管理员');
              return;
            }
            let productNamingConventionsList = model.split('-');
            let productModel = productNamingConventionsList[0];
            // if (protocolIDMap[productModel] === undefined || protocolIDMap[productModel] === null) {
            //   this.createLeftSpanMessage('该生产软件不支持此产品：' + productModel + '请联系管理员', 'red');
            //   this.$message.error('该生产软件不支持此产品：' + productModel + '请联系管理员');
            //   return;
            // }
            this.configForm.produceModel = productNamingConventionsList[0];
            if (!this.produceModelList.includes(this.configForm.produceModel)) {
              this.produceModelList.push(this.configForm.produceModel);
            }


            // NB 配置解析
            if (productNamingConventionsList.length >= 2) {
              this.decodeConfigForm.secondLevelContainsD = productNamingConventionsList[1].includes('D');
              console.warn(this.decodeConfigForm.secondLevelContainsD);
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
              }
            } else {
              this.decodeConfigForm.pressureConfig = '无探头';
            }

            this.configForm.temperatureProbes = this.decodeConfigForm.temperatureConfig;
            this.configForm.pressureProbes = this.decodeConfigForm.pressureConfig;
            this.decodeConfigForm.secondLevelContainsD === true ? (this.configForm.screenDisplay = '轮显') : (this.configForm.screenDisplay = '不轮显');

            this.configDetail.screenDisplay = this.configForm.screenDisplay
            this.configDetail.printLabel = this.configForm.produceModel
            this.configDetail.temperatureProbe = this.configForm.temperatureProbes

            this.configDetail.pressureProbes = this.configForm.pressureProbes
            this.workDetail = data.data;
            console.log(data.data);
            this.workNumberForm.precautions = data.data.memo;
            this.workDetail.productCode = data.data.productCode;
            this.workDetail.productModel = data.data.productModel;
            this.workDetail.programName = data.data.procedureName;
            this.workDetail.workQuantity = data.data.workQuantity;
            this.workDetail.finishDate = data.data.finishDate;

            // 获取产品图片
            await getProductImageList(this.token, this.workDetail.productCode).then((res) => {
              if (res.data.code === 200) {
                if (res.data.data.imageList !== undefined && res.data.data.imageList.length > 0) {
                  res.data.data.imageList.forEach(item => {
                    this.imageList.push({
                      url: this.url + item.objectKey,
                      flag: item.flag === 'Y'
                    });
                  });
                  this.mainImages = this.imageList.filter(item => item.flag === true);
                  this.subImages = this.imageList.filter(item => item.flag !== true);
                }
                console.log(this.imageList);
              }
            }).catch((error) => {
              this.$message.error('网络错误请联系管理员');
              console.log(error);
            });

            // 表单赋值
            this.workDetail.workNumber = this.workNumberForm.workNumber;
            this.workDetail.memo = this.workNumberForm.precautions;
            this.workDetail.vendorCode = this.workNumberForm.vendorCode;
            // this.workDetail.customerName = this.workNumberForm.customer;
            this.modalShow.configInputDetailModalShow = true;
            this.modalShow.workNumberDetailModalShow = false;
            this.$message.success('工单录入成功');
          } catch (error) {
            this.$message.error('网络错误请联系管理员');
            console.log(error);
          }
        }
      } else {
        this.$message.error('密码输入错误');
      }
    },
    configInputDetailModalOk() {
      //配置录入需要区分是工单跳转还是直接点击配置录入
      let pass = this.checkPassword()
      if (pass) {
        //配置赋值
        this.configDetail.temperatureProbe = this.configForm.temperatureProbes
        this.configDetail.version = this.configForm.version
        this.configDetail.temperature = this.configForm.temperature
        this.configDetail.processFocus = this.configForm.processFocus
        this.configDetail.screenDisplay = this.configForm.screenDisplay
        this.configDetail.printLabel = this.configForm.produceModel
        this.configDetail.customizePrintLabel = this.configForm.customizePrintLabel
        this.configDetail.pressureProbes = this.configForm.pressureProbes
        this.configDetail.pressureProbes = this.configForm.pressureProbes
        this.configDetail.torques = this.configForm.torques

        this.modalShow.configInputDetailModalShow = false
        this.$message.success('配置录入成功');
        this.password = undefined
      } else {
        this.$message.error('密码错误');
      }
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
    }
    ,
    buttonEnable() {
      this.nbButtonDisabledStatus.writeAddress = false
      this.nbButtonDisabledStatus.selfTest = false
      this.nbButtonDisabledStatus.awaken = false
      this.nbButtonDisabledStatus.labelPrint = false
    }
    ,
    buttonSuccess(node) {
      this.nbButtonColor[node] = button.color.success
    }
    ,
    buttonError(node) {
      this.nbButtonColor[node] = button.color.error
    }
    ,
    buttonWaiting(node) {
      this.nbButtonColor[node] = button.color.waiting
    }
    ,

    validateNumberInputOne(value) {
      const leadingZeros = value.match(/^0+/);
      const zeroCount = leadingZeros ? leadingZeros[0].length : 0;
      let numPart = parseInt(value, 10);
      if (value.length > 8) {
        value = value.slice(0, 8);
      }
      let newValue = numPart.toString().padStart(zeroCount, "0");
      this.generateAddress = newValue.slice(0, 8).padStart(8, "0");
    }
    ,
    handlePortChange(selectSerialPort, type) {
      doHandleSelectChange(this, selectSerialPort, type)
    },
    async openPort(portName) {
      console.warn(this.configDetail.printLabel)
      if (this.configDetail.printLabel === undefined || this.configDetail.printLabel === null) {
        this.$message.error('请配置标签型号后再进行串口操作');
        return
      }
      let parity = protocolIDMap[this.configForm.produceModel].portAttribute.parity
      let dataBits = protocolIDMap[this.configForm.produceModel].portAttribute.dataBits
      let baudRate = protocolIDMap[this.configForm.produceModel].portAttribute.baudRate
      let stopBits = protocolIDMap[this.configForm.produceModel].portAttribute.stopBits
      console.log('串口属性：', portName, parity, dataBits, baudRate, stopBits)
      await doOpenPort(this, portName, parity, dataBits, baudRate, stopBits)
    }
    ,
    closePort(portName, type) {
      doClosePort(this, portName, type)
    }
    ,
    async selfTest(protocolId) {
      await doSelfTest(this, protocolId)
    }
    ,
    async addressWrite(protocolId) {
      await doWriteAddress(this, protocolId)
    }
    ,
    /**
     * 上传MES成功后 或点击流程按钮  所有状态清空
     * */
    messageClean() {
      this.leftWorkPrompt = ''
      this.rightWorkPrompt = ''
      this.receptionLeftText = ''
      this.buttonWaiting('leftWorkPrompt')
      this.buttonWaiting('rightWorkPrompt')
      this.buttonWaiting('selfTest')
      this.buttonWaiting('writeAddress')
      this.buttonWaiting('awaken')
      this.buttonWaiting('labelPrint')
      this.buttonWaiting('breakSelfTest')
    }
    ,
    async awaken(protocolId) {
      await doAwaken(this, protocolId)
    },
    async breakSelfTest(protocolId) {
      await doBreakSelfTest(this, protocolId)
    },
    async handleScanAddressInput(protocolId) {
      if (!checkPort(this)) {
        this.scanAddress = ''
        return
      }
      this.receptionRightText = ''
      this.messageClean()
      clearTimeout(this.scanTimeout);
      if (this.scanAddress.length !== 8) {
        this.scanTimeout = setTimeout(() => {
          this.scanAddress = ''
        }, 100);
      }

      if (this.scanAddress.length === 8) {
        if (!await checkNetWork(this, protocolId)) {
          // if (!this.uploadAddressList.includes(this.scanAddress)) {
          //
          // }    console.warn(this.uploadAddressList)
          this.uploadAddressList.push(this.scanAddress)
          this.goodProductQuantity += 1;
          //TODO 成功打印定制标签根据型号区分
        }
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
      if (this.routerParam.produceMachine === 0) {
        let data = {
          address: address,
          workNo: this.workNumberForm.workNumber,
          logot: logot,
          machineNumber: this.routerParam.machineNumber,
          badMemo: badMemo
        }
        this.uploadDataList.push(data)
        //上传MES
        await saveVacDeviceProduceInfo(this.token, this.uploadDataList).then(res => {
          if (res.data.success) {
            handleRightSuccess(this, 'MES', '上传', undefined)
          } else {
            handleRightError(this, 'MES', 'MES上传失败：'+res.data.message, undefined)
          }

        }).catch(err => {
          handleRightError(this, 'MES', '网络错误请联系管理员', undefined)
        })

        this.uploadDataList = [];

      }
    },


  }
};
</script>

<style>
html, body {
  margin: 0;
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
}

.label {
  color: black;
  font-weight: bold;
}

:deep(.ant-card-body) {
  padding: 0;
  position: fixed;
}

.value {
  color: blue;
}

.a-row, .a-col {
  box-sizing: border-box;
}

</style>
