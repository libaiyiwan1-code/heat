export default {
  modalShow: false,
  portAttribute: {
    portClosedOneStatus: true,
    portClosedTwoStatus: true,
    serialPortOne:undefined,
    selectedPortOne:undefined,
    serialPortTwo:undefined,
    selectedPortTwo:undefined,
    addressOne:'',
    addressTwo:'',
    ports: [],
  },
  receivedData:{
    globalReceivedOneData: '',
    globalReceivedTwoData: '',
  },
  text:{
    receptionOneText: '',
    receptionTwoText: '',
  },
  address:{
    leftAddress:"",
    rightAddress:""
  },
  machineNumber:{
    leftMachineNumber:'',
    rightMachineNumber:'',
  },
  goodProductQuantity:{
    leftGoodProductQuantity:0,
    rightGoodProductQuantity:0,
  },
  badProductQuantity:{
    leftBadProductQuantity:0,
    rightBadProductQuantity:0,
  },
  badRate:{
    leftBadRate:0,
    rightBadRate:0,
  },
  uploadDataList: [],
  /*0 : 待执行 (默认)
  * 1:  执行中
  * */
  missionStatus:{
    leftMissionStatus:0,
    rightMissionStatus:0
  },
  //全局任务重试
  missionRetry:{
    leftMissionRetry:false,
    rightMissionRetry:false,
  }
};

