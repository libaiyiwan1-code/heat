import axios from "axios";
export const queryWorkNosWithUnfinished=(token)=>{

  return axios({
    url: 'http://192.168.0.158:82/api/workNo',
    method: 'get',
    timeout: 6000,
    headers: {
      authorization:token
    }
  })
}



export const login = (param) => {
  return axios({
    url: 'http://192.168.0.158:82/login',
    method: 'post',
    data: param,
    timeout: 6000
  });
};

export const getWorkDetail = (token, workNo) => {
  return axios({
    url: 'http://192.168.0.158:82/preWork/detail',
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
    url: 'http://192.168.0.158:82/prdMaterial/info',
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
    url: 'http://192.168.0.158:82/pre-work/config-param',
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
    url: 'http://192.168.0.158:82/api/vac-device-produce-info',
    method: 'post',
    timeout: 6000,
    data: data,
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    }
  });
}
