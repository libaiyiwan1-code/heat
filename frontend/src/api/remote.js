import axios from "axios";

const ip = '158'


export const queryWorkNosWithUnfinished = (token) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/api/workNo',
    method: 'get',
    timeout: 6000,
    headers: {
      authorization: token
    }
  })
}

export const findBadRecordList = (token, workNo, machineNumber) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/api/vac-device-produce-info/failureMessage',
    method: 'get',
    timeout: 6000,
    headers: {
      authorization: token
    },
    params: {
      workNo: workNo,
      machineNumber: machineNumber
    }
  })
}


export const login = (param) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/login',
    method: 'post',
    data: param,
    timeout: 6000
  });
};

export const getWorkDetail = (token, workNo) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/preWork/detail',
    method: 'get',
    timeout: 6000,
    params: {
      workNo: workNo
    },
    headers: {
      authorization: token
    }
  });
}
export const getProductImageList = (token, materialCode) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/prdMaterial/info',
    method: 'get',
    timeout: 6000,
    params: {
      materialCode: materialCode
    },
    headers: {
      authorization: token
    }
  });
}
export const getWorkConfigParam = (token, workNo) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/pre-work/config-param',
    method: 'get',
    timeout: 6000,
    params: {
      workNo: workNo
    },
    headers: {
      authorization: token
    }
  });
}

export const saveVacDeviceProduceInfo = (token, data) => {
  return axios({
    url: 'http://192.168.0.' + ip + ':82/api/vac-device-produce-info',
    method: 'post',
    timeout: 6000,
    data: data,
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
}
export default ip;
